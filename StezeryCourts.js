import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, SafeAreaView, Text, View, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { CheckBox } from 'react-native-btr';

const StezeryCourts = () => {
    const [playerOne, setPlayerOne] = useState('');
    const [playerTwo, setPlayerTwo] = useState('');
    const [playerOnePass, setPlayerOnePass] = useState(false);
    const [playerTwoPass, setPlayerTwoPass] = useState(false);
    const [courtNumber, setCourtNumber] = useState(1);
    const [date, setDate] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisibleFrom, setTimePickerVisibilityFrom] = useState(false);
    const [timeFrom, setTimeFrom] = useState(new Date());
    const [isTimePickerVisibleTo, setTimePickerVisibilityTo] = useState(false);
    const [timeTo, setTimeTo] = useState(new Date());
    const [cookies, setCookies] = useState('');
    const [cookiesFetched, setCookiesFetched] = useState(false);
    const webviewRef = React.useRef(null);


    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);
    const handleConfirm = (newDate) => {
        setDate(newDate);
        hideDatePicker();
    };

    const showTimePickerFrom = () => setTimePickerVisibilityFrom(true);
    const hideTimePickerFrom = () => setTimePickerVisibilityFrom(false);
    const handleTimeConfirmFrom = (selectedTimeFrom) => {
        const minutes = selectedTimeFrom.getMinutes();
        const roundedMinutes = minutes < 15 || minutes > 45 ? 0 : 30;
        selectedTimeFrom.setMinutes(roundedMinutes);
        setTimeFrom(selectedTimeFrom);
        hideTimePickerFrom();
    };

    const showTimePickerTo = () => setTimePickerVisibilityTo(true);
    const hideTimePickerTo = () => setTimePickerVisibilityTo(false);
    const handleTimeConfirmTo = (selectedTimeTo) => {
        const minutes = selectedTimeTo.getMinutes();
        const roundedMinutesTo = minutes < 15 || minutes > 45 ? 0 : 30;
        selectedTimeTo.setMinutes(roundedMinutesTo);
        setTimeTo(selectedTimeTo);
        hideTimePickerTo();
    };

    useEffect(() => {
        const fetchCookies = async () => {
            try {
                const storedCookies = await AsyncStorage.getItem('session_cookie');
                if (storedCookies !== null) {
                    setCookies(storedCookies);
                } else {
                    console.log('No session cookie found.');
                }
            } catch (error) {
                console.error('Error fetching cookies:', error);
            }
            setCookiesFetched(true);
        };

        fetchCookies();
    }, []);

    const injectedJavaScript = `
    var backWeekButton = document.getId('backWeekButton').outerHTML;
    var currentWeekButton = document.getId('currentWeekButton').outerHTML;
    var nextWeekButton = document.getId('nextWeekButton').outerHTML;
    var calendarTable = document.getId('calendarTable').outerHTML;
    document.body.innerHTML = backWeekButton + currentWeekButton + nextWeekButton + calendarTable;
    true;
    `;

    const handleTestRequest = async () => {
        try {
            const cookies = await AsyncStorage.getItem('session_cookie');
            const headers = cookies ? { Cookie: cookies } : {};

            const response = await axios.get(
                'http://www.sokolstezery.cz/ebooking/order?mondaydate=20240429&timeslot=20240505_2100-2130&subjectId=1&calendarId=1&veri=SlzfOy2Wfuc0FlUp3IMO2ptPwvd8fldG&src=weekformaa', {
                    headers,
                });

            const responseBody = response.data;

            const userNameMatch = responseBody.match(/name="userName".*? value='([^']+)'/i);
            console.log('Match:', userNameMatch);

            if (userNameMatch && userNameMatch[1]) {
                setPlayerOne(userNameMatch[1]);
            } else {
                console.log('Username not found.');
            }

            const playerOnePassMatch = responseBody.match(/name="pass"[\s\S]*?value="(true|false)"/i);
            console.log('Pass:', playerOnePassMatch);

            if (playerOnePassMatch && playerOnePassMatch[1]) {
                setPlayerOnePass(playerOnePassMatch[1] === "true");
            } else {
                console.log('Player one pass not found.');
            }

        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'An error occurred during the test request.');
        }
    };

    useEffect(() => {
        handleTestRequest();
    }, []);

    const handleAvailabilityAndReservation = async (shouldReserve = false) => {
        console.log('Reservation Check:', {
            date,
            courtNumber,
            timeFrom,
            timeTo,
            players: [
                { name: playerOne, hasPass: playerOnePass },
                { name: playerTwo, hasPass: playerTwoPass },
            ],
        });

        const czechDayNames = ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"];
        const englishAbbrev = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
        const dayOfWeekEng = englishAbbrev[date.getDay()];

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const dateString = `${day}.${month}.${year}`;

        const splitTimeRange = (timeFrom, timeTo) => {
            let blocks = [];
            let start = new Date(timeFrom);

            while (start < timeTo) {
                const end = new Date(start);
                end.setMinutes(start.getMinutes() + 30);

                if (end > timeTo) break;

                const timeFromString = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace(":", "");
                const timeToString = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace(":", "");

                blocks.push({ timeFromString, timeToString });
                start = end;
            }

            return blocks;
        };

        const timeBlocks = splitTimeRange(timeFrom, timeTo);

        try {
            const response = await axios.get('http://www.sokolstezery.cz/ebooking/weekformaa?calendarId=1');
            const htmlContent = response.data;

            let veriValues = {};

            for (const { timeFromString, timeToString } of timeBlocks) {
                console.log(`Availability Check: Court ${courtNumber} for ${timeFromString} to ${timeToString} on ${dateString}`);

                const timeSlotRegex = new RegExp(`<th id="timeCell-${dayOfWeekEng}-${courtNumber}-${timeFromString}-${timeToString}"[^>]*class="([^"]*)`);
                const match = timeSlotRegex.exec(htmlContent);

                if (match) {
                    const classAttr = match[1];

                    if (classAttr.includes("booked")) {
                        console.log(`Court ${courtNumber} is booked from ${timeFromString}-${timeToString} on ${dateString}`);
                        return;
                    }

                    const timeCellsJson = htmlContent.split("var timeCellsJson = '")[1].split("';")[0];
                    const timeCells = JSON.parse(timeCellsJson);

                    const timeCellKey = `timeCell-${dayOfWeekEng}-${courtNumber}-${timeFromString}-${timeToString}`;
                    const veri = timeCells[timeCellKey]?.veri;

                    if (veri) {
                        veriValues[timeCellKey] = veri;
                    }

                } else {
                    console.log(`No matching time slot: Court ${courtNumber} from ${timeFromString}-${timeToString}`);
                    return;
                }
            }

            await AsyncStorage.setItem("timeCellVeri", JSON.stringify(veriValues));
            console.log(`Court ${courtNumber} is available for all slots on ${dateString}`);

            if (shouldReserve) {
                for (const { timeFromString, timeToString } of timeBlocks) {
                    const timeSlot = `${year}${month}${day}_${timeFromString}-${timeToString}`;

                    const params = {
                        "bookingId": "",
                        "mondaydate": "20240429",
                        "timeslot": timeSlot,
                        "subjectId": courtNumber.toString(),
                        "calendarId": "1",
                        "src": "weekformaa",
                        "veri": veriValues[`timeCell-${dayOfWeekEng}-${courtNumber}-${timeFromString}-${timeToString}`] || "",
                        "userName": playerOne.replace(" ", "+"),
                        "personName0": playerTwo.replace(" ", "+"),
                        "personPass0": playerTwoPass.toString(),
                        "personName1": "",
                        "personName2": "",
                        "personName3": "",
                        "submitnew": "Objednat"
                    };

                    const cookies = await AsyncStorage.getItem("session_cookie");

                    const headers = {
                        "Accept": "*/*",
                        "Accept-Encoding": "gzip, deflate",
                        "Accept-Language": "cs-CZ,cs;q=0.9,en;q=0.8",
                        "Cache-Control": "max-age=0",
                        "Connection": "keep-alive",
                        "Content-Length": "265",
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Cookie": cookies,
                        "Host": "www.sokolstezery.cz",
                        "Origin": "http://www.sokolstezery.cz"
                    };

                    console.log(`Reservation Request:\nParams: ${JSON.stringify(params, null, 2)}\nHeaders: ${JSON.stringify(headers, null, 2)}`);
                    console.log(`Reservation Request: bookingId=&mondaydate=20240429&timeslot=${timeSlot}&subjectId=${courtNumber}&calendarId=1&src=weekformaa&veri=${params.veri}&userName=${params.userName}&personName0=${params.personName0}&personPass0=${params.personPass0}&personName1=&personName2=&personName3=&submitnew=Objednat`);

                    try {
                        const response = await axios.post(
                            'http://www.sokolstezery.cz/ebooking/orderAction',
                            null,
                            { params, headers }
                        );
                        console.log(`Reservation response: ${response.status}`);
                    } catch (error) {
                        console.error(`Reservation error: ${error}`);
                    }

                    // Introducing delay between requests
                    await new Promise(resolve => setTimeout(resolve, 3000)); // 3-second delay
                }

                console.log("Reservations processed.");
                webviewRef.current?.reload();
            }

        } catch (error) {
            console.log(`Availability Fetch Error: ${error}`);
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <Text style={styles.header}>Stěžery</Text>
                {cookiesFetched && (
                    <WebView
                        ref={webviewRef}
                        source={{
                            uri: 'http://www.sokolstezery.cz/ebooking/weekformaa?calendarId=1',
                            headers: {Cookie: cookies,},
                        }}
                        injectedJavaScript={injectedJavaScript}
                        injectedJavaScriptForMainFrameOnly={false}
                        style={styles.webviewOne}
                        onLoad={() => console.log('WebView 1 loaded!')}
                    />
                )
            }

                <View style={styles.reservationForm}>
                    <View style={styles.datePickerContainer}>
                        <Text style={styles.dateLabel}>Datum: </Text>
                        <Text style={styles.dateDisplay} onPress={showDatePicker}>{date.toLocaleDateString()}</Text>
                        <DateTimePickerModal
                            date={date}
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                        />
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.dateLabel}>Číslo kurtu:</Text>
                        <TouchableOpacity onPress={() => setCourtNumber(1)}>
                            <View style={styles.wrapper}>
                                <View style={styles.radio}>{courtNumber === 1 && <View style={styles.radioBg}></View>}</View>
                                <Text style={styles.radioText}>1</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setCourtNumber(2)}>
                            <View style={styles.wrapper}>
                                <View style={styles.radio}>{courtNumber === 2 && <View style={styles.radioBg}></View>}</View>
                                <Text style={styles.radioText}>2</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.timePickerContainer}>
                        <Text style={styles.timeLabel}>Čas od:</Text>
                        <Text style={styles.timeDisplay} onPress={showTimePickerFrom}>{`${timeFrom.getHours()}:${timeFrom.getMinutes() === 0 ? '00' : '30'}`}</Text>
                        <DateTimePickerModal
                            date={timeFrom}
                            isVisible={isTimePickerVisibleFrom}
                            mode="time"
                            onConfirm={handleTimeConfirmFrom}
                            onCancel={hideTimePickerFrom}
                        />
                    </View>

                    <View style={styles.timePickerContainer}>
                        <Text style={styles.timeLabel}>Čas do:</Text>
                        <Text style={styles.timeDisplay} onPress={showTimePickerTo}>{`${timeTo.getHours()}:${timeTo.getMinutes() === 0 ? '00' : '30'}`}</Text>
                        <DateTimePickerModal
                            date={timeTo}
                            isVisible={isTimePickerVisibleTo}
                            mode="time"
                            onConfirm={handleTimeConfirmTo}
                            onCancel={hideTimePickerTo}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                        <Text style={styles.timeLabel}>Hráč 1:</Text>
                        <TextInput style={styles.input} placeholder="Hráč 1 (jméno a příjmení)" value={playerOne} />
                        <Text style={styles.timeLabel}>P: </Text>
                        <CheckBox checked={playerOnePass} style={styles.checkbox} />
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                        <Text style={styles.timeLabel}>Hráč 2: </Text>
                        <TextInput style={styles.input} placeholder="Hráč 2 (jméno a příjmení)" value={playerTwo} onChangeText={setPlayerTwo} />
                        <Text style={styles.timeLabel}>P: </Text>
                        <CheckBox checked={playerTwoPass} onPress={() => setPlayerTwoPass(!playerTwoPass)} style={styles.checkbox} />
                    </View>

                    <Button title="Kontrola dostupnosti" onPress={() => handleAvailabilityAndReservation(false)} />
                    <Button title="Test Request" onPress={handleTestRequest} />
                    <Button title="Proved rezervaci" onPress={() => handleAvailabilityAndReservation(true)} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
    },
    scrollView: {
        flex: 1,
    },
    radioStyle: {
        flex: 1,
        alignItems: "center",
        justifyContent: 'center'
    },
    radio: {
        width: 15,
        height: 15,
        borderColor: "black",
        borderRadius: 20,
        borderWidth: 2,
        margin: 10
    },
    radioText: {
        fontSize: 16,
    },
    wrapper: {
        flexDirection: 'row', alignItems: 'center'
    },
    radioBg: {
        backgroundColor: 'black',
        height: 9,
        width: 9,
        margin: 1,
        borderRadius: 15
    },
    timePickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    timeLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 8,
    },
    timeDisplay: {
        fontSize: 16,
        color: 'blue',
    },
    webviewOne: {
        height: 200,
    },
    header: {
        fontSize: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
    reservationForm: {
        padding: 20,
    },
    input: {
        height: 30,
        width: 120,
        marginBottom: 12,
        borderWidth: 1,
        padding: 10,
        marginRight: 20
    },
    datePickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    dateLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 8,
    },
    dateDisplay: {
        fontSize: 16,
        color: 'blue',
    },
    checkbox: {
        marginLeft: 10,
    },
});
export default StezeryCourts;

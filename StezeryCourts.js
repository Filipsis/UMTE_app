import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, SafeAreaView, Text, View, TextInput, Button, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const StezeryCourts = () => {
    const [playerOne, setPlayerOne] = useState('');
    const [playerTwo, setPlayerTwo] = useState('');
    const [playerOnePass, setPlayerOnePass] = useState(false);
    const [playerTwoPass, setPlayerTwoPass] = useState(false);
    const [courtNumber, setCourtNumber] = useState(1);
    const [date, setDate] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => { setDatePickerVisibility(true);};
    const hideDatePicker = () => {setDatePickerVisibility(false);};
    const handleConfirm = (date) => {setDate(date); hideDatePicker();};
    const [isTimePickerVisibleFrom, setTimePickerVisibilityFrom] = useState(false);
    const [timeFrom, setTimeFrom] = useState(new Date());

    const showTimePickerFrom = () => {setTimePickerVisibilityFrom(true);};
    const hideTimePickerFrom = () => {setTimePickerVisibilityFrom(false);};
    const handleTimeConfirmFrom = (selectedTimeFrom) => {
        // Zaokrouhlit minuty na nejbližší půlhodinu
        const minutes = selectedTimeFrom.getMinutes();
        const roundedMinutes = minutes < 15 || minutes > 45 ? 0 : 30;
        selectedTimeFrom.setMinutes(roundedMinutes);
        setTimeFrom(selectedTimeFrom);
        hideTimePickerFrom();};

    const [isTimePickerVisibleTo, setTimePickerVisibilityTo] = useState(false);
    const [timeTo, setTimeTo] = useState(new Date());
    const showTimePickerTo = () => {setTimePickerVisibilityTo(true);};
    const hideTimePickerTo = () => {setTimePickerVisibilityTo(false);};

    const handleTimeConfirmTo = (selectedTimeTo) => {
        const minutes = selectedTimeTo.getMinutes();
        const roundedMinutesTo = minutes < 15 || minutes > 45 ? 0 : 30;
        selectedTimeTo.setMinutes(roundedMinutesTo);
        setTimeTo(selectedTimeTo);
        hideTimePickerTo();};
    const [cookies, setCookies] = useState('');
    useEffect(() => {
        const fetchCookies = async () => {
            const storedCookies = await AsyncStorage.getItem('session_cookie');
            setCookies(storedCookies);
        };

        fetchCookies();
    }, []);
//     const customScript1 = `
//     var backWeekButton = document.getElementById('backWeekButton').outerHTML;
//     var currentWeekButton = document.getElementById('currentWeekButton').outerHTML;
//     var nextWeekButton = document.getElementById('nextWeekButton').outerHTML;
//     var calendarTable = document.getElementById('calendarTable').outerHTML;
//     document.body.innerHTML = backWeekButton + currentWeekButton + nextWeekButton + calendarTable;
//     true;
// `;
    const injectedJavaScript = `
    document.cookie = "${cookies}";
    var backWeekButton = document.getElementById('backWeekButton').outerHTML;
    var currentWeekButton = document.getElementById('currentWeekButton').outerHTML;
    var nextWeekButton = document.getElementById('nextWeekButton').outerHTML;
    var calendarTable = document.getElementById('calendarTable').outerHTML;
    document.body.innerHTML = backWeekButton + currentWeekButton + nextWeekButton + calendarTable;
    true;
`;

    const handleTestRequest = async () => {
        try {
            // Retrieve cookies from AsyncStorage
            const cookies = await AsyncStorage.getItem('session_cookie');
            const headers = cookies ? { Cookie: cookies } : {};

            // Make a GET request to the specified URL
            const response = await axios.get('http://www.sokolstezery.cz/ebooking/order?mondaydate=20240429&timeslot=20240505_2100-2130&subjectId=1&calendarId=1&veri=SlzfOy2Wfuc0FlUp3IMO2ptPwvd8fldG&src=weekformaa', {
                headers,
            });

            const responseBody = response.data;

            // Extract username from the response body
            const userNameMatch = responseBody.match(/name="userName".*? value='([^']+)'/i);
            console.log('Match Result:', userNameMatch);
            if (userNameMatch && userNameMatch[1]) {
                setPlayerOne(userNameMatch[1]);
            } else {
                console.log('Username not found.');
            }

        } catch (error) {
            console.error('Error making request:', error);
            Alert.alert('Error', 'An error occurred while making the test request.');
        }
    };


    useEffect(() => {
        handleTestRequest(); // Automatically call this function when the page loads
    }, []);

    const handleReservation = async () => {
        console.log('Reservation Details:', {
            date,
            courtNumber,
            timeFrom,
            timeTo,
            players: [
                { name: playerOne, hasPass: playerOnePass },
                { name: playerTwo, hasPass: playerTwoPass }
            ]
        });

        const czechDayNames = ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"];
        const englishAbbrev = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

        const dayOfWeekCzech = czechDayNames[date.getDay()];
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


            for (const { timeFromString, timeToString } of timeBlocks) {
                console.log(`Checking availability for Court ${courtNumber} from ${timeFromString} to ${timeToString} on ${dateString}`);

                const timeSlotRegex = new RegExp(`<th id="timeCell-${dayOfWeekEng}-${courtNumber}-${timeFromString}-${timeToString}"[^>]*class="([^"]*)`);
                const match = timeSlotRegex.exec(htmlContent);

                if (match) {
                    const classAttr = match[1];
                    if (classAttr.includes("booked")) {
                        console.log(`Court ${courtNumber} is booked from ${timeFromString} to ${timeToString} on ${dateString}.`);
                        return;
                    }
                } else {
                    console.log(`No matching time slot found for Court ${courtNumber} from ${timeFromString} to ${timeToString} on ${dateString}.`);
                    return;
                }
            }

            console.log(`Court ${courtNumber} is available for all time slots on ${dateString}.`);
        } catch (error) {
            console.log(`Error fetching response: ${error}`);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <Text style={styles.header}>Stěžery</Text>
                <WebView
                    source={{ uri: 'http://www.sokolstezery.cz/ebooking/weekformaa?calendarId=1' }}
                    injectedJavaScript={injectedJavaScript}
                    injectedJavaScriptForMainFrameOnly={false}
                    style={styles.webviewOne}
                    onLoad={() => console.log('WebView 1 loaded!')}
                    onMessage={(event) => console.log('event 1: ', event)}
                />
                <View style={styles.reservationForm}>
                    <View style={styles.datePickerContainer}>
                        <Text style={styles.dateLabel}>Datum: </Text>
                        <Text style={styles.dateDisplay} onPress={showDatePicker}>{date.toLocaleDateString()}
                        </Text>
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
                        <TouchableOpacity onPress={()=>setCourtNumber(1)}>
                            <View style={styles.wrapper}>
                                <View style={styles.radio}>
                                    {courtNumber===1 && <View style={styles.radioBg}></View>}
                                </View>
                                <Text style={styles.radioText}>1     </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>setCourtNumber(2)}>
                            <View style={styles.wrapper}>
                                <View style={styles.radio}>
                                    {courtNumber===2 && <View style={styles.radioBg}></View>}
                                </View>
                                <Text style={styles.radioText}>2</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.timePickerContainer}>
                        <Text style={styles.timeLabel}>Čas od: </Text>
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
                        <Text style={styles.timeLabel}>Čas do: </Text>
                        <Text style={styles.timeDisplay} onPress={showTimePickerTo}>{`${timeTo.getHours()}:${timeTo.getMinutes() === 0 ? '00' : '30'}`}</Text>
                        <DateTimePickerModal
                            date={timeTo}
                            isVisible={isTimePickerVisibleTo}
                            mode="time"
                            onConfirm={handleTimeConfirmTo}
                            onCancel={hideTimePickerTo}
                        />
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 2}}>
                        <Text style={styles.timeLabel}>Hráč 1: </Text>
                        <TextInput style={styles.input} placeholder="Hráč 1 (jméno a příjmení)" value={playerOne} />
                        <Text style={styles.timeLabel}>P: </Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12}}>
                        <Text style={styles.timeLabel}>Hráč 2: </Text>
                        <TextInput style={styles.input} placeholder="Hráč 2 (jméno a příjmení)" value={playerTwo}
                                   onChangeText={setPlayerTwo}/>
                    </View>
                    <Button title="Rezervovat" onPress={handleReservation}/>
                    <Button title="Test Request" onPress={handleTestRequest}/>
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
    radioStyle:
        {
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
    wrapper:{
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
        height:30,
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

});

export default StezeryCourts;
import React, { useState } from 'react';
import { ScrollView, StyleSheet, SafeAreaView, Text, View, TextInput, Button } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { WebView } from 'react-native-webview';

const StezeryCourts = () => {
    const [playerOne, setPlayerOne] = useState('');
    const [playerTwo, setPlayerTwo] = useState('');
    const [playerOnePass, setPlayerOnePass] = useState(false);
    const [playerTwoPass, setPlayerTwoPass] = useState(false);
    const [courtNumber, setCourtNumber] = useState('1');
    const [date, setDate] = useState(new Date());
    const [timeFrom, setTimeFrom] = useState('');
    const [timeTo, setTimeTo] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        setDate(date);
        hideDatePicker();
    };

    const customScript1 = `
    var backWeekButton = document.getElementById('backWeekButton').outerHTML;
    var currentWeekButton = document.getElementById('currentWeekButton').outerHTML;
    var nextWeekButton = document.getElementById('nextWeekButton').outerHTML;
    var calendarTable = document.getElementById('calendarTable').outerHTML;
    document.body.innerHTML = backWeekButton + currentWeekButton + nextWeekButton + calendarTable;
    true;
`;
    const handleReservation = () => {
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
        // Logika pro zpracování rezervace (např. odeslání na server)
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <Text style={styles.header}>Stěžery</Text>
                <WebView
                    source={{ uri: 'http://www.sokolstezery.cz/ebooking/weekformaa?calendarId=1' }}
                    injectedJavaScript={customScript1}
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
                    <TextInput style={styles.input} placeholder="Číslo kurtu (1 nebo 2)" value={courtNumber} onChangeText={setCourtNumber} keyboardType="numeric"/>
                    <TextInput style={styles.input} placeholder="Čas od (HH:MM)" value={timeFrom} onChangeText={setTimeFrom}/>
                    <TextInput style={styles.input} placeholder="Čas do (HH:MM)" value={timeTo} onChangeText={setTimeTo}/>
                    <TextInput style={styles.input} placeholder="Hráč 1 (jméno a příjmení)" value={playerOne} onChangeText={setPlayerOne}/>
                    <TextInput style={styles.input} placeholder="Hráč 2 (jméno a příjmení)" value={playerTwo} onChangeText={setPlayerTwo}/>
                    <Button title="Rezervovat" onPress={() => console.log('Reservation confirmed.')}/>
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
        height: 40,
        marginBottom: 12,
        borderWidth: 1,
        padding: 10,
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
    }
});

export default StezeryCourts;
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

function ThirdPage() {
    const [bookingId] = useState(''); // Vzorový kód neměl hodnotu, ponecháno prázdné
    const [mondaydate] = useState('20240422');
    const [timeslot] = useState('20242804_1330-1400');
    const [subjectId] = useState('1');
    const [calendarId] = useState('1');
    const [src] = useState('weekformaa');
    const [veri] = useState('0dvZ3zK2dBRYU6UfFz0luiSTOIKN98Qq');
    const [userName] = useState('Filip Bidlo'); // Predpokládám, že to je statické
    const [personName0, setPersonName0] = useState('');
    const [personPass0, setPersonPass0] = useState(true);
    const [personName1, setPersonName1] = useState('');
    const [personPass1, setPersonPass1] = useState(false);
    const [personName2, setPersonName2] = useState('');
    const [personPass2, setPersonPass2] = useState(false);
    const [response, setResponse] = useState('');

    const handleSubmit = async () => {
        const data = `bookingId=${bookingId}&mondaydate=${mondaydate}&timeslot=${timeslot}&subjectId=${subjectId}&calendarId=${calendarId}&src=${src}&veri=${veri}&userName=${encodeURIComponent(userName)}&personName0=${encodeURIComponent(personName0)}&personPass0=${personPass0}&personName1=${encodeURIComponent(personName1)}&personPass1=${personPass1}&personName2=${encodeURIComponent(personName2)}&personPass2=${personPass2}&submitnew=Objednat`;

        console.log('Sending data:', data);
        try {
            const response = await fetch('http://www.sokolstezery.cz/ebooking/orderAction', {
                method: 'POST',
                body: data,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            const text = await response.text();
            console.log('Response text:', text);
            setResponse(text);
        } catch (error) {
            console.error('Error sending data:', error);
            setResponse('Error sending data: ' + error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Zadejte informace o hráčích</Text>
            <TextInput
                style={styles.input}
                onChangeText={setPersonName0}
                value={personName0}
                placeholder="Jméno hráče 0"
            />
            <TextInput
                style={styles.input}
                onChangeText={setPersonName1}
                value={personName1}
                placeholder="Jméno hráče 1"
            />
            <TextInput
                style={styles.input}
                onChangeText={setPersonName2}
                value={personName2}
                placeholder="Jméno hráče 2"
            />
            <View style={styles.checkboxContainer}>
                <Text>Permanentka hráče 0:</Text>
                <TextInput
                    style={styles.checkbox}
                    onChangeText={() => setPersonPass0(previousState => !previousState)}
                    value={personPass0.toString()}
                />
            </View>
            <View style={styles.checkboxContainer}>
                <Text>Permanentka hráče 1:</Text>
                <TextInput
                    style={styles.checkbox}
                    onChangeText={() => setPersonPass1(previousState => !previousState)}
                    value={personPass1.toString()}
                />
            </View>
            <View style={styles.checkboxContainer}>
                <Text>Permanentka hráče 2:</Text>
                <TextInput
                    style={styles.checkbox}
                    onChangeText={() => setPersonPass2(previousState => !previousState)}
                    value={personPass2.toString()}
                />
            </View>
            <Button title="Odeslat" onPress={handleSubmit} />
            <Text style={styles.response}>{response}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    header: {
        fontSize: 20,
        marginBottom: 20
    },
    input: {
        height: 40,
        marginVertical: 12,
        borderWidth: 1,
        padding: 10,
        width: '100%'
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    checkbox: {
        margin: 8
    },
    response: {
        marginTop: 20,
        color: 'green'
    }
});

export default ThirdPage;

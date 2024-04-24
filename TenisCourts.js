import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { parse } from 'react-native-html-parser';

const extractDataFromHTML = (html) => {
    const document = parse(html);
    const days = ['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle'];
    let schedule = [];

    days.forEach((dayAbbrev, index) => {
        const dayData = { day: dayAbbrev, courts: [] };
        for (let court = 1; court <= 2; court++) { // Předpokládáme 2 kurty
            const courtData = { court, slots: [] };
            for (let hour = 7; hour <= 22; hour++) {
                for (let half = 0; half < 2; half++) {
                    const minute = half === 0 ? '00' : '30';
                    const time = `${hour}:${minute}`;
                    const timeCellId = `timeCell-${dayAbbrev}-${court}-${hour}${minute}-${hour}${half === 0 ? '30' : ((hour + 1) % 24).toString().padStart(2, '0')}00`;
                    const timeCell = document.getElementById(timeCellId);
                    if (timeCell) {
                        const status = timeCell.classNames.includes('booked') ? 'Booked' :
                            timeCell.classNames.includes('available') ? 'Available' : 'Unavailable';
                        courtData.slots.push({ time, status });
                    }
                }
            }
            dayData.courts.push(courtData);
        }
        schedule.push(dayData);
    });

    return schedule;
};

function TennisCourts() {
    const [courtsData, setCourtsData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://www.sokolstezery.cz/ebooking/weekformaa?calendarId=1');
            const htmlString = await response.text();
            const data = extractDataFromHTML(htmlString);
            setCourtsData(data);
        };

        fetchData();
    }, []);

    return (
        <ScrollView style={styles.container}>
            {courtsData.map(day => (
                <View key={day.day} style={styles.dayContainer}>
                    <Text style={styles.dayHeader}>{day.day}</Text>
                    {day.courts.map(court => (
                        <View key={court.court} style={styles.courtContainer}>
                            <Text style={styles.courtHeader}>Court {court.court}</Text>
                            {court.slots.map(slot => (
                                <Text key={slot.time} style={styles.slot}>
                                    {slot.time} - {slot.status}
                                </Text>
                            ))}
                        </View>
                    ))}
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    dayContainer: {
        marginBottom: 20
    },
    dayHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10
    },
    courtContainer: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 10
    },
    courtHeader: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    slot: {
        fontSize: 14
    }
});

export default TennisCourts;

import React from 'react';
import {View, Text, Button, StyleSheet, Linking, Image} from 'react-native';

function TennisHome({ navigation }) {

    return (
        <View style={styles.container}>
            <Image source={require('./assets/TENNIS_cover.jpeg')} style={{width: 250, height: 250}} />
            <View style={{ height: 30 }} />
            <View style={styles.buttonContainer}>
                <Text style={styles.header}>Přehled kurtů</Text>
                <Button title="Kurty Hradec Králové" onPress={() => navigation.navigate('TennisCourts')} />
                <View style={{ height: 30 }} />
                <Text style={styles.header}>Přejít na rezervační systém</Text>
                <Button title="Sokol Stěžery" onPress={() => Linking.openURL('http://www.sokolstezery.cz/ebooking/')}  />
                <Button title="Sportpark HIT" onPress={() => Linking.openURL('https://memberzone.cz/sportparkhit/')} />
                <Button title="Tenis centrum DTJ" onPress={() => Linking.openURL('https://www.rezzy.eu/tenant-6/schedules')} />
            </View>
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
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold'
    },
    buttonContainer: {
        width: '100%',
        justifyContent: 'space-around'
    }
});

export default TennisHome;

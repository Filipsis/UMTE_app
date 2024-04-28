import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

function TennisHome({ route, navigation }) {

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <Text style={styles.header}>Přehled</Text>
                <Button title="Přehled kurtů" onPress={() => navigation.navigate('TennisCourts')} />
                <Text style={styles.header}>Volba sportovišť</Text>
                <Button title="Stěžery" onPress={() => navigation.navigate('StezeryLogin')} />
                <Button title="Sportpark HIT (TBD)" onPress={() => {/* Funkce pro správu HIT */}} />
                <Button title="Tenis centrum DTJ (TBD)" onPress={() => {/* Funkce pro správu DTJ */}} />
                <Text style={styles.header}>Správa</Text>
                <Button title="Nastavení (TBD)" onPress={() => {/* Funkce správu účtu */}} />
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

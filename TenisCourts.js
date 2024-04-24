import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function TenisCourts() {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Rezervace Kurtů</Text>
            {/* Další obsah */}
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
    }
});

export default TenisCourts;

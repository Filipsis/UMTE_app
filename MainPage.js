import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';

export default function App() {
    const [address, setAddress] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setError('Přístup k poloze zamítnut, pouze omezené funkce aplikace.');
                return;
            }
        })();
    }, []);

    const fetchAddressInfo = async () => {
        setLoading(true);
        try {
            let location = await Location.getCurrentPositionAsync({});
            const coordinates = `${location.coords.latitude},${location.coords.longitude}`;
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates}&key=AIzaSyBXXdUsE24GqfwOPONTlxiw41LkMHoruPM`);
            const json = await response.json();
            if (json.status === 'OK') {
                setAddress(json.results[0].formatted_address);
            } else {
                setError('Chyba pri zjistovani adresy');
            }
        } catch (error) {
            setError('Nepodarilo se zjistit adresu');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Button
                title="Zjisti moji adresu"
                onPress={fetchAddressInfo}
            />
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
                <Text style={styles.error}>{error}</Text>
            ) : (
                <Text style={styles.dataText}>Adresa: {address}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    dataText: {
        fontSize: 16,
        marginVertical: 10,
    },
    error: {
        fontSize: 18,
        color: 'red',
        marginTop: 20,
    },
});

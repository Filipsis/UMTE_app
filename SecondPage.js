import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import FetchAddress from "./utils/FetchAddress";
import { Picker } from '@react-native-picker/picker';

function SecondPage() {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [places, setPlaces] = useState([]);
    const [address, setAddress] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedType, setSelectedType] = useState('restaurant');
    const [showPicker, setShowPicker] = useState(false);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Přístup k poloze zamítnut, pouze omezené funkce aplikace budou dostupné.');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    const findPlaces = async () => {
        if (!location) return;

        try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.coords.latitude},${location.coords.longitude}&radius=500&type=${selectedType}&key=AIzaSyBXXdUsE24GqfwOPONTlxiw41LkMHoruPM`);
            const data = response.data.results.slice(0, 5);
            setPlaces(data);
        } catch (error) {
            setErrorMsg('Nepodařilo se stáhnout seznam míst');
            console.error(error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.container}>
                <Button
                    title="Zjisti moji adresu"
                    onPress={async () => {
                        setLoading(true);
                        try {
                            const fetchedAddress = await FetchAddress();
                            setAddress(fetchedAddress);
                        } catch (error) {
                            setError('Nepodařilo se zjistit adresu');
                            console.error(error);
                        } finally {
                            setLoading(false);
                        }
                    }}
                />
                {isLoading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : error ? (
                    <Text style={styles.error}>{error}</Text>
                ) : (
                    <Text style={styles.dataText}>Adresa: {address}</Text>
                )}
                <View style={styles.pickerContainer}>
                    <Text style={styles.description}>Typ místa:</Text>
                    <TouchableOpacity onPress={() => setShowPicker(true)}>
                        <Text style={styles.description}>
                            {selectedType === 'bar' ? 'Bary'
                                : selectedType === 'supermarket' ? 'Obchody' : 'Zubaři'}
                        </Text>
                    </TouchableOpacity>
                    <Modal
                        transparent={true}
                        visible={showPicker}
                        animationType="slide"
                        onRequestClose={() => setShowPicker(false)}
                    >
                        <View style={styles.modalContent}>
                            <Picker
                                selectedValue={selectedType}
                                onValueChange={(itemValue) => setSelectedType(itemValue)}
                                style={{ height: 200, width: 300 }}
                            >
                                <Picker.Item label="Bary" value="bar" />
                                <Picker.Item label="Obchody" value="supermarket" />
                                <Picker.Item label="Zubaři" value="dentist" />
                            </Picker>
                            <Button title="OK" onPress={() => setShowPicker(false)} />
                        </View>
                    </Modal>
                </View>
                <Button
                    title="Najdi nejbližší"
                    onPress={findPlaces}
                />
                {places.map((place, index) => (
                    <View key={index} style={styles.placeContainer}>
                        <Text style={styles.placeName}>{place.name}</Text>
                        <Text style={styles.placeRating}>Hodnocení: {place.rating || 'N/A'}</Text>
                    </View>
                ))}
                <Text>{errorMsg}</Text>
                <Button
                    title="Reset"
                    onPress={() => {
                        setPlaces([]);
                        setErrorMsg('');
                        setAddress('');
                    }}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    description: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 8,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -150 }, { translateY: -100 }],
        width: 300,
    },
    dataText: {
        fontSize: 16,
        marginVertical: 10,
    },
    error: {
        color: 'red',
    },
    placeContainer: {
        marginVertical: 5,
        alignItems: 'center',
    },
    placeName: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    placeRating: {
        fontSize: 13,
        color: 'gray',
    }

});

export default SecondPage;

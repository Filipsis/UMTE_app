import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Modal, Image } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import FetchAddress from "./utils/FetchAddress";
import { Picker } from '@react-native-picker/picker';

function SecondPage() {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [places, setPlaces] = useState([]);
    const [address, setAddress] = useState('');
    const [isLoadingAddress, setLoadingAddress] = useState(false);
    const [isLoadingPlaces, setLoadingPlaces] = useState(false);
    const [error, setError] = useState('');
    const [selectedType, setSelectedType] = useState('');
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
        if (!location || selectedType === '<vyberte>') return;
        setLoadingPlaces(true);
        try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.coords.latitude},${location.coords.longitude}&radius=500&type=${selectedType}&key=AIzaSyBXXdUsE24GqfwOPONTlxiw41LkMHoruPM`);
            const data = response.data.results.slice(0, 5);
            setPlaces(data);
        } catch (error) {
            setErrorMsg('Nepodařilo se stáhnout seznam míst');
            console.error(error);
        } finally {
            setLoadingPlaces(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
                <Image source={require('./assets/PLACES_cover.png')} style={{width: 250, height: 250}} />
                <View style={{ height: 30 }} />
                <Text style={styles.header}>Aktuální adresa</Text>
                {isLoadingAddress ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : error ? (
                    <Text style={styles.error}>{error}</Text>
                ) : (
                    <Text style={styles.dataText}>{address === '' ? '<stiskněte Zjistit adresu>' : address}</Text>
                )}
                <Button
                    title="Zjisti adresu"
                    onPress={async () => {
                        setLoadingAddress(true);
                        try {
                            const fetchedAddress = await FetchAddress();
                            setAddress(fetchedAddress);
                        } catch (error) {
                            setError('Nepodařilo se zjistit adresu');
                            console.error(error);
                        } finally {
                            setLoadingAddress(false);
                        }
                    }}
                />
                <View style={{ height: 30 }} />
                <View style={styles.pickerContainer}>
                    <Text style={styles.header}>Nejbližší místa</Text>
                </View>
                <View style={styles.pickerContainer}>
                    <Text style={styles.description}>Typ místa:</Text>
                    <TouchableOpacity onPress={() => setShowPicker(true)}>
                        <Text style={styles.dataText}>
                            {selectedType === 'bar' ? 'Bary'
                                : selectedType === 'supermarket' ? 'Obchody'
                                    : selectedType === 'dentist' ? 'Zubaři' : '<vyberte>'}
                        </Text>
                    </TouchableOpacity>
                </View>
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
                <Button
                    title="Hledat"
                    onPress={findPlaces}
                />

            {isLoadingPlaces ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
                <Text style={styles.error}>{error}</Text>
            ) : (
                places.map((place, index) => (
                        <View key={index} style={styles.placeContainer}>
                            <Text style={styles.placeName}>{place.name}</Text>
                            <Text style={styles.placeRating}>Hodnocení: {place.rating || 'N/A'}</Text>
                        </View>
                    ))
            )}

                <Text>{errorMsg}</Text>
                <Button
                    title="Reset"
                    onPress={() => {
                        setPlaces([]);
                        setErrorMsg('');
                        setAddress('');
                        setSelectedType('<vyberte>');
                    }}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        paddingVertical: 20,
    },
    container: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexGrow: 1,
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
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold'
    }
});

export default SecondPage;

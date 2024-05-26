import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
    View,
    Text,
    Button,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Modal,
    Image
} from 'react-native';
import * as Location from 'expo-location';
import {Picker} from '@react-native-picker/picker';
import FetchAddress from "./utils/FetchAddress";
import GetPressure from './utils/GetPressure';

function PagePlaces() {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [places, setPlaces] = useState([]);
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState({
        address: false,
        places: false,
        pressure: false
    });
    const [error, setError] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [pressure, setPressure] = useState(null);

    useEffect(() => {
        (async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
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
        setLoading({...loading, places: true});
        try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.coords.latitude},${location.coords.longitude}&radius=500&type=${selectedType}&key=AIzaSyBXXdUsE24GqfwOPONTlxiw41LkMHoruPM`);
            const data = response.data.results.slice(0, 5);
            setPlaces(data);
        } catch (error) {
            setErrorMsg('Nepodařilo se stáhnout seznam míst');
            console.error(error);
        } finally {
            setLoading({...loading, places: false});
        }
    };

    const handleGetPressure = async () => {
        setLoading({...loading, pressure: true});
        try {
            const pressureValue = await GetPressure();
            setPressure(pressureValue);
        } catch (error) {
            setError(`Nepodařilo se zjistit tlak: ${error}`);
            console.error(error);
        } finally {
            setLoading({...loading, pressure: false});
        }
    };

    const handleFetchAddress = async () => {
        setLoading({...loading, address: true});
        try {
            const fetchedAddress = await FetchAddress();
            setAddress(fetchedAddress);
        } catch (error) {
            setError('Nepodařilo se zjistit adresu');
            console.error(error);
        } finally {
            setLoading({...loading, address: false});
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Image source={require('./assets/PLACES_cover.png')} style={{width: 250, height: 250}}/>
                <View style={{height: 30}}/>
                <Text style={[styles.header]}>Aktuální adresa</Text>
                {loading.address ? (
                    <ActivityIndicator size="large" color="#0000ff"/>
                ) : error ? (
                    <Text style={styles.error}>{error}</Text>
                ) : (
                    <Text style={[styles.text]}>{address === '' ? null : address}</Text>
                )}
                <Button
                    title="Zjisti adresu"
                    onPress={handleFetchAddress}
                />
                <View style={{height: 30}}/>
                <View style={styles.container}>
                    <Text style={styles.header}>Nejbližší místa</Text>
                </View>
                <View style={styles.pickerContainer}>
                    <Text style={[styles.text, {fontWeight: 'bold'}]}>Typ místa: </Text>
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
                            style={{height: 200, width: 300}}
                        >
                            <Picker.Item label="Bary" value="bar"/>
                            <Picker.Item label="Obchody" value="supermarket"/>
                            <Picker.Item label="Zubaři" value="dentist"/>
                        </Picker>
                        <Button title="OK" onPress={() => setShowPicker(false)}/>
                    </View>
                </Modal>

                {loading.places ? (
                    <ActivityIndicator size="large" color="#0000ff"/>
                ) : error ? (
                    <Text style={styles.error}>{error}</Text>
                ) : (
                    places.map((place, index) => (
                        <View key={index} style={styles.placeContainer}>
                            <Text style={[styles.text, {fontSize: 14, fontWeight: 'bold'}]}>{place.name}</Text>
                            <Text style={[styles.text, {
                                fontSize: 12,
                                marginVertical: 0
                            }]}>Hodnocení: {place.rating || 'N/A'}</Text>
                        </View>
                    ))
                )}
                <Button
                    title="Hledat"
                    onPress={findPlaces}
                />
                <View style={styles.container}>
                    <Text style={styles.header}>Tlak vzduchu</Text>
                </View>
                {loading.pressure ? (
                    <ActivityIndicator size="large" color="#0000ff"/>
                ) : pressure ? (
                    <Text style={styles.text}>{pressure} hPa</Text>
                ) : null}
                <Button
                    title="Zjisti tlak"
                    onPress={handleGetPressure}
                />
                <Text>{errorMsg}</Text>
                <Button
                    title="Reset"
                    onPress={() => {
                        setPlaces([]);
                        setErrorMsg('');
                        setAddress('');
                        setSelectedType('<vyberte>');
                        setPressure(null);
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
        marginVertical: 10,
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    text: {
        fontSize: 16,
        marginVertical: 10,
    },
    placeContainer: {
        marginVertical: 5,
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{translateX: -150}, {translateY: -100}],
        width: 300,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
    }
});

export default PagePlaces;
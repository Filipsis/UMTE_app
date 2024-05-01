import React, { useState, useEffect } from 'react';
import { View, Text, Button, Switch, StyleSheet, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

function SecondPage() {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [isRestaurantChecked, setRestaurantChecked] = useState(false);
    const [isParkChecked, setParkChecked] = useState(false);
    const [places, setPlaces] = useState([]);

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

        let types = [];
        if (isRestaurantChecked) types.push('restaurant');
        if (isParkChecked) types.push('park');

        try {
            for (const type of types) {
                const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.coords.latitude},${location.coords.longitude}&radius=500&type=${type}&key=AIzaSyBXXdUsE24GqfwOPONTlxiw41LkMHoruPM`);
                const data = response.data.results.slice(0, 5);
                setPlaces(prevPlaces => [...prevPlaces, ...data]);
            }
        } catch (error) {
            setErrorMsg('Nepodarilo se stahnout seznam mist');
            console.error(error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text>{errorMsg}</Text>
            <View style={styles.switchContainer}>
                <Switch
                    value={isRestaurantChecked}
                    onValueChange={setRestaurantChecked}
                />
                <Text>Restaurace</Text>
            </View>
            <View style={styles.switchContainer}>
                <Switch
                    value={isParkChecked}
                    onValueChange={setParkChecked}
                />
                <Text>Parky</Text>
            </View>
            <Button
                title="Najít nejbližší"
                onPress={findPlaces}
            />
            {places.map((place, index) => (
                <Text key={index}>{place.name}</Text>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
});

export default SecondPage;

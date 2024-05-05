import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as MailComposer from 'expo-mail-composer';

export default function App() {
    const [address, setAddress] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [openCamera, setOpenCamera] = useState(false);
    const cameraRef = useRef(null);
    const [pictureTaken, setPictureTaken] = useState(false);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setError('Přístup k poloze zamítnut, pouze omezené funkce aplikace.');
                return;
            }

            status = await Camera.requestCameraPermissionsAsync();
            if (status.status !== 'granted') {
                setError('Přístup ke kameře zamítnut, pouze omezené funkce aplikace.');
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

    const takePicture = async () => {
        if (cameraRef.current && !pictureTaken) {
            setPictureTaken(true);
            setTimeout(async () => {
                try {
                    const options = { quality: 0.5, base64: false };
                    const data = await cameraRef.current.takePictureAsync(options);
                    const asset = await MediaLibrary.createAssetAsync(data.uri);
                    console.log('Foto uloženo do galerie:', asset.uri);
                    const localUri = await MediaLibrary.getAssetInfoAsync(asset);
                    console.log('Lokální URI souboru:', localUri.localUri);
                    await sendEmailWithPhoto(localUri.localUri);
                } catch (error) {
                    console.log('Nepodařilo se pořídit foto:', error);
                } finally {
                    if (cameraRef.current) {
                        setOpenCamera(false);
                    } else {
                        console.log('Kamera není dostupná.')
                    }
                }
            }, 800);
        }
    };

    const sendEmailWithPhoto = async (photoUri) => {
        let available = await MailComposer.isAvailableAsync();
        if (available) {
            const emailOptions = {
                recipients: [],
                subject: "Někoho jsme našli",
                body: "Tady ho máte:",
                attachments: [photoUri],
            };
            await MailComposer.composeAsync(emailOptions);
        } else {
            console.log("e-mail není konfigurován na tomto zařízení.");
        }
    };

    useEffect(() => {
        setPictureTaken(false);
    }, [openCamera]);

    useEffect(() => {
        (async () => {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                setError('Přístup k médiím zamítnut, pouze omezené funkce aplikace.');
                return;
            }
        })();
    }, []);

    if (openCamera) {
        return (
            <Camera
                style={{ flex: 1 }}
                type={Camera.Constants.Type.front}
                ref={cameraRef}
                onCameraReady={takePicture}
            />
        );
    }

    return (
        <View style={styles.container}>
            <Button
                title="Zjisti moji adresu"
                onPress={fetchAddressInfo}
            />
            <Button
                title="Pořiď foto"
                onPress={() => setOpenCamera(true)}
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
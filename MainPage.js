import React, { useRef, useState, useEffect } from 'react';
import {StyleSheet, Text, View, Button, ActivityIndicator, TextInput, Modal} from 'react-native';
import * as Location from 'expo-location';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import FetchAddress from './utils/FetchAddress';
import TakePicture from "./utils/TakePicture";
import SendEmail from "./utils/SendEmail";
import SearchFBI from "./utils/SearchFBI";

export default function App() {
    const [address, setAddress] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [openCamera, setOpenCamera] = useState(false);
    const cameraRef = useRef(null);
    const [pictureTaken, setPictureTaken] = useState(false);
    const [name, setName] = useState('');
    const [searchResult, setSearchResult] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

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
                onCameraReady={() =>
                    TakePicture(cameraRef, pictureTaken, setPictureTaken, setOpenCamera, SendEmail)}
            />
        );
    }

    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>
                            {searchResult === 1 ?
                                'Shoda nalezena!' :
                                'Zatím vás nehledají. \n Zkuste své štěstí zítra.'}
                        </Text>
                        <Button
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}
                            title="OK"
                        />
                    </View>
                </View>
            </Modal>

            <Text style={styles.dataText}>Zadejte informace o hledané osobě</Text>
            <View style={styles.attribute}>
                <Text style={styles.description}>Jméno: </Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setName}
                    value={name}
                    placeholder="Jméno"
                />
            </View>
            <Button
                title="Hledat"
                onPress={async () => {
                    setLoading(true);
                    const result = await SearchFBI(name);
                    setSearchResult(result);
                    setLoading(false);
                    setModalVisible(true);
                }}
            />
            <Text>{searchResult}</Text>
            <Button
                title="Zjisti moji adresu"
                onPress={async () => {
                    setLoading(true);
                    try {
                        const fetchedAddress = await FetchAddress();
                        setAddress(fetchedAddress);
                    } catch (error) {
                        setError('Nepodarilo se zjistit adresu');
                        console.error(error);
                    } finally {
                        setLoading(false);
                    }
                }}
            />
            <Button
                title="Pořiď foto"
                onPress={() => setOpenCamera(true)}
            />
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff"/>
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
    input: {
        height: 40,
        width: 150,
        marginBottom: 12,
        borderWidth: 1,
        padding: 10,
        marginRight: 20
    },
    description: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 8,
    },
    attribute: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    error: {
        fontSize: 18,
        color: 'red',
        marginTop: 20,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator, TextInput, Modal, Image } from 'react-native';
import * as Location from 'expo-location';
import SendEmail from "./utils/SendEmail";
import SearchFBI from "./utils/SearchFBI";

export default function App() {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [name, setName] = useState('');
    const [searchResult, setSearchResult] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [isEmailSending, setIsEmailSending] = useState(false);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setError('Přístup k poloze zamítnut, pouze omezené funkce aplikace.');
                return;
            }
        })();
    }, []);

    const handleSendEmail = async () => {
        setIsEmailSending(true);
        try {
            await SendEmail(name);
        } catch (error) {
            console.error("Chyba při otevírání e-mailu:", error);
        }
        setModalVisible(false);
        setIsEmailSending(false);
    };

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
                        <Text style={styles.modalText}>Hledaná osoba: {name}</Text>
                        <Text style={styles.modalText}>
                            {searchResult === 1 ? (
                                <>
                                    {'Shoda nalezena! \n'}
                                    <Text style={styles.modalText}>Znáte ho? Pošlete nám e-mail!</Text>
                                    <Button
                                        onPress={handleSendEmail}
                                        title="Poslat e-mail"
                                        disabled={isEmailSending}
                                    />
                                </>
                            ) : (
                                'Zatím vás nehledají. \n Zkuste své štěstí zítra.'
                            )}
                        </Text>
                        <Button
                            onPress={() => setModalVisible(!modalVisible)}
                            title="Zavřít"
                        />
                    </View>
                </View>
            </Modal>

            <Image source={require('./assets/FBI_cover.png')} style={{ width: 250, height: 250 }} />
            <View style={{ height: 30 }} />
            <Text style={styles.header}>Zadejte informace o hledané osobě</Text>
            <View style={styles.attribute}>
                <Text style={styles.description}>Jméno a příjmení: </Text>
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
                    if (name === '') {
                        console.log('Nebylo zadáno jméno');
                        return;
                    }
                    setLoading(true);
                    const result = await SearchFBI(name);
                    setSearchResult(result);
                    setLoading(false);
                    setModalVisible(true);
                }}
            />
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
                <Text style={styles.error}>{error}</Text>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'top',
        padding: 20,
    },

    input: {
        height: 38,
        width: 160,
        marginBottom: 12,
        borderWidth: 1,
        padding: 8,
        marginRight: 10
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
    },
    header: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: 'bold'
    }
});
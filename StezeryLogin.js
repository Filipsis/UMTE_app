import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

function StezeryLogin({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginResponse, setLoginResponse] = useState('');

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const response = await axios.get('http://www.sokolstezery.cz/ebooking/');

                if (response.status === 200) {
                    const setCookieHeader = response.headers['set-cookie'];
                    if (setCookieHeader && setCookieHeader.length > 0) {
                        // Parse the cookie to store only up to the first semicolon
                        const fullCookie = setCookieHeader[0];
                        const sessionCookie = fullCookie.split(';')[0];
                        console.log('Parsed Session Cookie:', sessionCookie);

                        await AsyncStorage.setItem('session_cookie', sessionCookie);
                        console.log('Session cookie stored:', sessionCookie);
                    }
                } else {
                    console.log('Failed to fetch initial data:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Error fetching initial data:', error);
            }
        };

        fetchInitialData();
    }, []);

    const handleLogin = async () => {
        const loginData = `userName=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&submit=++Přihlásit+`;

        try {
            const response = await fetch('http://www.sokolstezery.cz/ebooking/loginAction', {
                method: 'POST',
                body: loginData,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            const responseBody = await response.text();
            console.log('Status kód odpovědi:', response.status);
           // console.log('Odpověď ze serveru:', responseBody);

            if (responseBody.includes("Uživatel")) {
                const usernameRegex = /Uživatel: (\w+)/;
                const match = responseBody.match(usernameRegex);
                const username = match ? match[1] : null;

                if (username) {
                    console.log('Přihlášení bylo úspěšné, uživatel je:', username);
                    navigation.navigate('StezeryMenu', { userLogged: username }); // Pass username as a parameter
                } else {
                    console.log('Přihlášení selhalo, nelze extrahovat uživatelské jméno.');
                    setLoginResponse('Login failed: Cannot extract username');
                }
            } else if (responseBody.includes("Nesprávné")) {
                console.log('Přihlášení selhalo, server vrátil nesprávné údaje.');
                setLoginResponse('Login failed: Incorrect username or password.');
            } else {
                console.log('Přihlášení selhalo, server vrátil neznámou odpověď.');
                setLoginResponse('Login failed: ' + responseBody);
            }
        } catch (error) {
            console.error('Došlo k chybě při přihlášení:', error);
            setLoginResponse('Error during login: ' + error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Login</Text>
            <TextInput
                style={styles.input}
                onChangeText={setUsername}
                value={username}
                placeholder="Username"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                onChangeText={setPassword}
                value={password}
                placeholder="Password"
                secureTextEntry={true}
            />
            <Button title="Přihlásit" onPress={handleLogin} />
            <Text style={styles.response}>{loginResponse}</Text>
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
        fontSize: 20,
        marginBottom: 20
    },
    input: {
        height: 40,
        marginVertical: 12,
        borderWidth: 1,
        padding: 10,
        width: '100%'
    },
    response: {
        marginTop: 20
    }
});

export default StezeryLogin;

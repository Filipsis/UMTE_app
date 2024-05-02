import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { useIsFocused } from '@react-navigation/native';

function StezeryLogin({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginResponse, setLoginResponse] = useState('');
    const [sessionCookie, setSessionCookie] = useState('');
    const isFocused = useIsFocused();

    const fetchInitialData = async () => {
        try {
            const response = await axios.get('http://www.sokolstezery.cz/ebooking/');

            if (response.status === 200) {
                const setCookieHeader = response.headers['set-cookie'];
                if (setCookieHeader && setCookieHeader.length > 0) {
                    const fullCookie = setCookieHeader[0];
                    const cookieValue = fullCookie.split(';')[0];
                    console.log('Parsed Session Cookie:', cookieValue);

                    await AsyncStorage.setItem('session_cookie', cookieValue);
                    setSessionCookie(cookieValue); // Update state
                    console.log('Session cookie stored:', cookieValue);
                    return cookieValue;
                }
            } else {
                console.log('Failed to fetch initial data:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error fetching initial data:', error);
        }
        return null;
    };

    const checkSessionCookie = async () => {
        let cookie = await AsyncStorage.getItem('session_cookie');
        if (cookie === null) {
            cookie = await fetchInitialData();
            console.log('Session cookie after fetchInitialData', cookie);
        } else {
            console.log('Session cookie found:', cookie);
            setSessionCookie(cookie); // Update state
        }
    };

    useEffect(() => {
        console.log("called");

        if (isFocused) {
            checkSessionCookie();
        }
    }, [isFocused]);


    const handleLogin = async () => {
        const loginData = `userName=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&submit=++Přihlásit+`;

        try {
            const sessionCookie = await AsyncStorage.getItem('session_cookie');

            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
            };

            if (sessionCookie) {
                headers['Cookie'] = sessionCookie;
            }

            const response = await axios.post('http://www.sokolstezery.cz/ebooking/loginAction', loginData, {
                headers,
            });

            const responseBody = response.data;
            console.log('Status kód odpovědi:', response.status);

            if (responseBody.includes("Uživatel")) {
                const usernameRegex = /Uživatel: (\w+)/;
                const match = responseBody.match(usernameRegex);
                const username = match ? match[1] : null;

                if (username) {
                    console.log('Přihlášení bylo úspěšné, uživatel je:', username);
                    navigation.navigate('StezeryMenu', { userLogged: username });
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

    return (<View style={styles.container}>
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
            <Button title="Přihlásit" onPress={handleLogin}
            />
            <Text style={styles.response}>{loginResponse}</Text>
        </View>);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        fontSize: 20,
        marginBottom: 20,
    },
    input: {
        height: 40,
        marginVertical: 12,
        borderWidth: 1,
        padding: 10,
        width: '100%',
    },
    response: {
        marginTop: 20,
    },
});

export default StezeryLogin;

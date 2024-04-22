import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

function ThirdPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginStatus, setLoginStatus] = useState('');

    const handleLogin = async () => {
        const bodyContent = `userName=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&submit=++Přihlásit+`;

        console.log('Odesílám požadavek na:', 'http://www.sokolstezery.cz/ebooking/loginAction');
        console.log('Data požadavku:', bodyContent);

        try {
            let response = await fetch('http://www.sokolstezery.cz/ebooking/loginAction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                    'Connection': 'keep-alive',
                    'Referer': 'http://www.sokolstezery.cz/ebooking/login',
                    // Uvedte další hlavičky z logu podle potřeby
                },
                body: bodyContent
            });

            const textResponse = await response.text();  // Načtení odpovědi jako text
            console.log('HTTP Status:', response.status);
            console.log('Odpověď serveru:', textResponse);

            if (response.url.endsWith('index') && response.status === 200) {
                setLoginStatus('Login úspěšný');
            } else {
                setLoginStatus('Přihlášení se nezdařilo');
                console.log('Nepodařilo se přihlásit, detaily odpovědi:', textResponse);
            }
        } catch (error) {
            setLoginStatus('Chyba při přihlášení: ' + error.message);
            console.log('Chyba při přihlášení:', error);
        }
    }

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Uživatelské jméno"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
            />
            <TextInput
                placeholder="Heslo"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                style={styles.input}
            />
            <Button title="Přihlásit se" onPress={handleLogin} />
            <Text>{loginStatus}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: '80%',
        padding: 10,
        margin: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
});

export default ThirdPage;

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function StezeryMenu({ route, navigation }) {
    const userLogged = route.params?.userLogged ?? "Neznámý uživatel";  // Receiving the username from navigation

    const handleLogout = async () => {
        try {
            const response = await fetch('http://www.sokolstezery.cz/ebooking/index?action=logout', {
                method: 'GET',
            });

            if (response.ok) {
                console.log('Logout request successful.');

                // Remove the stored cookie
                await AsyncStorage.removeItem('login_cookie');
                console.log('Cookie removed.');

                navigation.navigate('TennisHome'); // Navigate back to the login page
            } else {
                console.log('Logout request failed:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Uživatel: {userLogged}</Text>
            <View style={styles.buttonContainer}>
                <Button title="Rezervovat kurt" onPress={() => navigation.navigate('StezeryCourts')} />
                <Button title="Moje rezervace" onPress={() => {/* Function to display reservations */}} />
                <Button title="Historie objednávek" onPress={() => {/* Function for order history */}} />
                <Button title="Nastavení" onPress={() => {/* Function for settings */}} />
                <Button title="Odhlásit" onPress={handleLogout} />
            </View>
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
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold'
    },
    buttonContainer: {
        width: '100%',
        justifyContent: 'space-around'
    }
});

export default StezeryMenu;

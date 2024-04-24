import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

function TenisMenu({ route, navigation }) {
    const userLogged = route.params?.userLogged ?? "Neznámý uživatel";  // Přijímáme username z navigace

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Uživatel: {userLogged}</Text>
            <View style={styles.buttonContainer}>
                <Button title="Rezervovat kurt" onPress={() => navigation.navigate('TenisCourts')} />
                <Button title="Moje rezervace" onPress={() => {/* Funkce pro zobrazení rezervací */}} />
                <Button title="Historie objednávek" onPress={() => {/* Funkce pro historii objednávek */}} />
                <Button title="Nastavení" onPress={() => {/* Funkce pro nastavení */}} />
                <Button title="Odhlásit" onPress={() => navigation.navigate('LoginPage')} />
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

export default TenisMenu;

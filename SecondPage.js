import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function SecondPage() {
    return (
        <View style={styles.container}>
            <Text>Nová stránka</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default SecondPage;

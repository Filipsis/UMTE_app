import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, ActivityIndicator } from 'react-native';

export default function App() {
  const [coordinates, setCoordinates] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAddressInfo = async () => {
    if (!coordinates) {
      setError('Prosim zadejte platne souradnice');
      return;
    }
    try {
      setLoading(true);
      setError('');
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

  return (
      <View style={styles.container}>
        <TextInput
            style={styles.input}
            value={coordinates}
            onChangeText={setCoordinates}
            placeholder="Zadejte GPS souřadnice (lat,lon)"
        />
        <Button
            title="Zjisti moji adresu"
            onPress={fetchAddressInfo}
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
  input: {
    width: '80%',
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
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

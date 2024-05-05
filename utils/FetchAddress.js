import * as Location from "expo-location";

const fetchAddressInfo = async () => {
    try {
        let location = await Location.getCurrentPositionAsync({});
        const coordinates = `${location.coords.latitude},${location.coords.longitude}`;
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates}&key=AIzaSyBXXdUsE24GqfwOPONTlxiw41LkMHoruPM`);
        const json = await response.json();
        if (json.status === 'OK') {
            return json.results[0].formatted_address;
        } else {
            throw new Error('Chyba pri zjistovani adresy');
        }
    } catch (error) {
        throw new Error('Nepodarilo se zjistit adresu');
    }
};

export default fetchAddressInfo;
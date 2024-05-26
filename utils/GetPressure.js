import { Barometer } from 'expo-sensors';

const GetPressure = () => {
    return new Promise((resolve, reject) => {
        const subscription = Barometer.addListener(barometerData => {
            resolve(barometerData.pressure.toFixed(4));
            subscription.remove();
        });

        setTimeout(() => {
            subscription.remove();
            reject('Timeout: Nepodařilo se zjistit tlak za 5 sekund');
        }, 5000);
    });
};

export default GetPressure;

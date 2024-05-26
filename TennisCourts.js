import React from 'react';
import { ScrollView, StyleSheet, SafeAreaView, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

const TennisCourts = () => {
    const customScript1 = `
    document.body.innerHTML = 
        document.getElementById('backWeekButton').outerHTML + 
        document.getElementById('currentWeekButton').outerHTML + 
        document.getElementById('nextWeekButton').outerHTML + 
        document.getElementById('calendarTable').outerHTML; 
    true;
`;

    const customScript2 = `
    document.addEventListener('DOMContentLoaded', (event) => {
        console.log('DOMContentLoaded event fired');
        var buttonClicked = false;

        function handleButtonClick() {
            const button = document.getElementById('BTN1');
            if (button && !buttonClicked) {
                button.click();
                buttonClicked = true;
            } else if (!buttonClicked) {
                setTimeout(handleButtonClick, 100);
            }
        }

        handleButtonClick();
    });
`;

    const customScript3 = `
    setTimeout(function() {
        const cardColumns = document.querySelectorAll('.card-column');
        if (cardColumns.length > 0) {
            document.body.innerHTML = ''; 
            cardColumns.forEach(function(column) {
                document.body.appendChild(column.cloneNode(true)); 
            });
        } else {
            document.body.innerHTML = 'No card-column divs found';
        }
    }, 5000);
    true;
`;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <Text style={styles.header}>Stěžery</Text>
                <WebView
                    source={{ uri: 'http://www.sokolstezery.cz/ebooking/weekformaa?calendarId=1' }}
                    injectedJavaScript={customScript1}
                    injectedJavaScriptForMainFrameOnly={false}
                    style={styles.webviewOne}
                    onMessage={(event) => {
                        console.log('event 1: ', event)
                    }}
                />
                <Text style={styles.header}>Sportpark HIT</Text>
                <WebView
                    source={{ uri: 'https://memberzone.cz/sportparkhit/' }}
                    injectedJavaScript={customScript2}
                    injectedJavaScriptForMainFrameOnly={false}
                    style={styles.webviewTwo}
                    onMessage={(event) => {
                        console.log('event 2: ', event)
                    }}
                />
                <View style={{ height: 60 }} />
                <Text style={styles.header}>Teniscentrum DTJ</Text>
                <WebView
                    source={{ uri: 'https://www.rezzy.eu/tenant-6/schedules' }}
                    javaScriptEnabled={true}
                    injectedJavaScript={customScript3}
                    injectedJavaScriptForMainFrameOnly={false}
                    style={styles.webviewThree}
                    onMessage={(event) => {
                        console.log('WebView 3 content: ', event.nativeEvent.data);
                    }}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
    },
    scrollView: {
        flex: 1,
    },
    webviewOne: {
        height: 200,
    },
    webviewTwo: {
        height: 800,
    },
    webviewThree: {
        height: 500,
    },
    header: {
        fontSize: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default TennisCourts;
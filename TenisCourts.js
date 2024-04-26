import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';

const TennisCourtSchedule = () => {
    const customScript = `
        const style = document.createElement('style');
        style.textContent = \`
            #calendarTable, #calendarTable * {
                pointer-events: none;  // Zakazuje klikání
                user-select: none;    // Zakazuje výběr textu
            }
        \`;
        document.head.appendChild(style);
        document.body.innerHTML = document.getElementById('calendarTable').outerHTML;
        true;
    `;

    return (
        <SafeAreaView style={styles.container}>
            <WebView
                source={{ uri: 'http://www.sokolstezery.cz/ebooking/weekformaa?calendarId=1' }}
                injectedJavaScript={customScript}
                injectedJavaScriptForMainFrameOnly={false}
                style={styles.webview}
                onLoad={() => console.log('WebView loaded!')}
                onMessage={(event) => {
                    console.log('event: ', event)
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
    },
    webview: {
        flex: 1,
    }
});

export default TennisCourtSchedule;

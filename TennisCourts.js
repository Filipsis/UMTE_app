import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';

const TennisCourts = () => {
    const customScript1 = `document.body.innerHTML = document.getElementById('calendarTable').outerHTML;true;`;

    // Immediately attempt to click the button when the script runs, without waiting for DOMContentLoaded
    const customScript2 = `
        function handleButtonClick() {
            const button = document.getElementById('BTN1');
            if (button) {
                button.click();
                const table = document.getElementById('TAB_ROZPIS_TabPanel_l_1_Table_lekce');
                if (table) {
                    const style = document.createElement('style');
                    style.textContent = \`
                        .ntabulka, .ntabulka th, .ntabulka td {
                            font-size: 12px;
                            padding: 4px;
                        }
                        .ntabulka {
                            min-width: 1200px; // Ensures the table is scrollable horizontally
                            table-layout: fixed; // Keeps the column widths consistent
                        }
                        body {
                            overflow-x: scroll; // Allows scrolling on x-axis if needed
                        }
                    \`;
                    document.head.appendChild(style);
                    document.body.innerHTML = table.outerHTML;
                }
            } else {
                // If the button isn't available yet, try again shortly
                setTimeout(handleButtonClick, 100);
            }
        }
        
        handleButtonClick();
        true;
    `;

    return (
        <SafeAreaView style={styles.container}>
            <WebView
                source={{ uri: 'http://www.sokolstezery.cz/ebooking/weekformaa?calendarId=1' }}
                injectedJavaScript={customScript1}
                injectedJavaScriptForMainFrameOnly={false}
                style={styles.webview}
                onLoad={() => console.log('WebView 1 loaded!')}
                onMessage={(event) => {
                    console.log('event 1: ', event)
                }}
            />
            <WebView
                source={{ uri: 'https://memberzone.cz/sportparkhit/' }}
                injectedJavaScript={customScript2}
                injectedJavaScriptForMainFrameOnly={false}
                style={styles.webview}
                onLoad={() => console.log('WebView 2 loaded!')}
                onMessage={(event) => {
                    console.log('event 2: ', event)
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

export default TennisCourts;

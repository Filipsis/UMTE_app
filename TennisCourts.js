import React from 'react';
import { ScrollView, StyleSheet, SafeAreaView, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

const TennisCourts = () => {
    const customScript1 = `document.body.innerHTML = document.getElementById('calendarTable').outerHTML;true;`;

    const customScript2 = `
        var buttonClicked = false;

        function handleButtonClick() {
            if (!buttonClicked) {
                const button = document.getElementById('BTN1');
                if (button) {
                    button.click();
                    buttonClicked = true;
                    const table = document.getElementById('TAB_ROZPIS_TabPanel_l_1_Table_lekce');
                    if (table) {
                        const style = document.createElement('style');
                        style.textContent = \`
                            .ntabulka, .ntabulka th, .ntabulka td {
                                font-size: 12px;
                                padding: 4px;
                            }
                            .ntabulka {
                                min-width: 800px;
                                table-layout: fixed;
                            }
                            body {
                                overflow-x: scroll;
                            }
                        \`;
                        document.head.appendChild(style);
                        document.body.innerHTML = table.outerHTML;
                    }
                } else {
                    setTimeout(handleButtonClick, 100);
                }
            }
        }
        
        handleButtonClick();
        true;
    `;
    const customScript3 = `
    setTimeout(function() {
        const style = document.createElement('style');
        style.textContent = \`
            .sticky {
                position: sticky;
                top: 0;
                z-index: 10;
            }
            .schedule-table-container {
                position: relative; /* Needed for sticky positioning */
                overflow-x: auto; /* Allows horizontal scrolling */
            }
        \`;
        document.head.appendChild(style);

        const headers = Array.from(document.querySelectorAll('h2'));
        const targetHeader = headers.find(h => h.textContent.includes('Venkovní kurty'));
        if (targetHeader) {
            let parentDiv = targetHeader.closest('.schedule-card');
            if (parentDiv) {
                document.body.innerHTML = ''; // Clear the existing page content
                document.body.appendChild(parentDiv.cloneNode(true)); // Append only the required div
            } else {
                document.body.innerHTML = 'Target div not found';
            }
        } else {
            document.body.innerHTML = 'Header not found';
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
                    style={styles.webviewSmall}
                    onLoad={() => console.log('WebView 1 loaded!')}
                    onMessage={(event) => {
                        console.log('event 1: ', event)
                    }}
                />
                <Text style={styles.header}>Sportpark HIT</Text>
                <WebView
                    source={{ uri: 'https://memberzone.cz/sportparkhit/' }}
                    injectedJavaScript={customScript2}
                    injectedJavaScriptForMainFrameOnly={false}
                    style={styles.webviewLarge}
                  //  onLoad={() => console.log('WebView 2 loaded!')}
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
                    style={styles.webviewSmall}
                    onLoadEnd={() => console.log('WebView 3 loaded!')}
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
    webviewSmall: {
        height: 600,  // Increased height for WebView3
    },
    webviewLarge: {
        height: 300,  // Fixed height for specific adjustment
    },
    header: {
        fontSize: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default TennisCourts;
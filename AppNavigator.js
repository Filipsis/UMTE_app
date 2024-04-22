import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import MainPage from './MainPage';
import SecondPage from './SecondPage';
import ThirdPage from './ThirdPage'; // Import nové stránky

const Tab = createBottomTabNavigator();

function AppNavigator() {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Home" component={MainPage} options={{ tabBarLabel: 'Home' }} />
                <Tab.Screen name="SecondPage" component={SecondPage} options={{ tabBarLabel: 'New Page' }} />
                <Tab.Screen name="ThirdPage" component={ThirdPage} options={{ tabBarLabel: 'Third Page' }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default AppNavigator;

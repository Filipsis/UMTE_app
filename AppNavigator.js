import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MainPage from './MainPage';
import SecondPage from './SecondPage';
import TennisCourts from './TennisCourts';
import TennisHome from './TennisHome';

const Tab = createBottomTabNavigator();
const TennisStackNavigator = createStackNavigator();

function ThirdPage() {
    return (
        <TennisStackNavigator.Navigator screenOptions={{ headerShown: false }}>
            <TennisStackNavigator.Screen name="TennisHome" component={TennisHome} />
            <TennisStackNavigator.Screen name="TennisCourts" component={TennisCourts} />
        </TennisStackNavigator.Navigator>
    );
}

function AppNavigator() {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Databáze hledaných osob FBI" component={MainPage} options={{ tabBarLabel: 'Hledané osoby FBI' }} />
                <Tab.Screen name="Moje poloha a blízká místa" component={SecondPage} options={{ tabBarLabel: 'Místa' }} />
                <Tab.Screen name="Sekce tenisu" component={ThirdPage} options={{ tabBarLabel: 'Sekce Tenis' }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default AppNavigator;

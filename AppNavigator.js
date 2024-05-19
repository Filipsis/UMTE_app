import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MainPage from './MainPage';
import SecondPage from './SecondPage';
import StezeryLogin from './StezeryLogin';
import StezeryMenu from './StezeryMenu';
import TennisCourts from './TennisCourts';
import TennisHome from './TennisHome';
import StezeryCourts from './StezeryCourts';

const Tab = createBottomTabNavigator();
const TennisStackNavigator = createStackNavigator(); // Renamed to avoid naming conflict

function TennisStackScreen() { // Renamed to avoid naming conflict
    return (
        <TennisStackNavigator.Navigator screenOptions={{ headerShown: false }}>
            <TennisStackNavigator.Screen name="TennisHome" component={TennisHome} />
            <TennisStackNavigator.Screen name="StezeryLogin" component={StezeryLogin} />
            <TennisStackNavigator.Screen name="StezeryMenu" component={StezeryMenu} />
            <TennisStackNavigator.Screen name="TennisCourts" component={TennisCourts} />
            <TennisStackNavigator.Screen name="StezeryCourts" component={StezeryCourts} />
        </TennisStackNavigator.Navigator>
    );
}

function AppNavigator() {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Databáze hledaných osob FBI" component={MainPage} options={{ tabBarLabel: 'Hledané osoby FBI' }} />
                <Tab.Screen name="Moje poloha a blízká místa" component={SecondPage} options={{ tabBarLabel: 'Místa' }} />
                <Tab.Screen name="Sekce tenisu" component={TennisStackScreen} options={{ tabBarLabel: 'Sekce Tenis' }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default AppNavigator;

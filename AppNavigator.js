import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MainPage from './MainPage';
import SecondPage from './SecondPage';
import StezeryLogin from './StezeryLogin';
import ThirdPage from './ThirdPage';  // Note: This is declared but not used in your provided code.
import TennisMenu from './TennisMenu';
import TennisCourts from './TennisCourts';
import TennisHome from './TennisHome';

const Tab = createBottomTabNavigator();
const TennisStackNavigator = createStackNavigator(); // Renamed to avoid naming conflict

function TennisStackScreen() { // Renamed to avoid naming conflict
    return (
        <TennisStackNavigator.Navigator screenOptions={{ headerShown: false }}>
            <TennisStackNavigator.Screen name="TennisHome" component={TennisHome} />
            <TennisStackNavigator.Screen name="StezeryLogin" component={StezeryLogin} />
            <TennisStackNavigator.Screen name="TennisMenu" component={TennisMenu} />
            <TennisStackNavigator.Screen name="TennisCourts" component={TennisCourts} />
        </TennisStackNavigator.Navigator>
    );
}

function AppNavigator() {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Home" component={MainPage} options={{ tabBarLabel: 'Home' }} />
                <Tab.Screen name="SecondPage" component={SecondPage} options={{ tabBarLabel: 'New Page' }} />
                <Tab.Screen name="TennisHome" component={TennisStackScreen} options={{ tabBarLabel: 'Tennis Home' }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default AppNavigator;

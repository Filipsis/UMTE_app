import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import PageFBI from './PageFBI';
import PagePlaces from './PagePlaces';
import TennisCourts from './TennisCourts';
import PageTennis from './PageTennis';

const Tab = createBottomTabNavigator();
const TennisStackNavigator = createStackNavigator();

function TennisStack() {
    return (
        <TennisStackNavigator.Navigator screenOptions={{ headerShown: false }}>
            <TennisStackNavigator.Screen name="PageTennis" component={PageTennis} />
            <TennisStackNavigator.Screen name="TennisCourts" component={TennisCourts} />
        </TennisStackNavigator.Navigator>
    );
}

function AppNavigator() {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Databáze hledaných osob FBI" component={PageFBI} options={{ tabBarLabel: 'Hledané osoby' }} />
                <Tab.Screen name="Moje poloha a blízká místa" component={PagePlaces} options={{ tabBarLabel: 'Místa' }} />
                <Tab.Screen name="Sekce tenisu" component={TennisStack} options={{ tabBarLabel: 'Tenis' }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default AppNavigator;

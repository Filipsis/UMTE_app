import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MainPage from './MainPage';
import SecondPage from './SecondPage';
import TenisStezery from './TenisStezery';
import ThirdPage from './ThirdPage';
import TenisMenu from './TenisMenu';
import TenisCourts from './TenisCourts';

const Tab = createBottomTabNavigator();
const TenisStack = createStackNavigator();

function TenisStezeryStack() {
    return (
        <TenisStack.Navigator screenOptions={{ headerShown: false }}>
            <TenisStack.Screen name="TenisStezery" component={TenisStezery} />
            <TenisStack.Screen name="TenisMenu" component={TenisMenu} />
            <TenisStack.Screen name="TenisCourts" component={TenisCourts} />
        </TenisStack.Navigator>
    );
}


function AppNavigator() {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Home" component={MainPage} options={{ tabBarLabel: 'Home' }} />
                <Tab.Screen name="SecondPage" component={SecondPage} options={{ tabBarLabel: 'New Page' }} />
                <Tab.Screen name="TenisStezery" component={TenisStezeryStack} options={{ tabBarLabel: 'Tenis Stěžery' }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default AppNavigator;
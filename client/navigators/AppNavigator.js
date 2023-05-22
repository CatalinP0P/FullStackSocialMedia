import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Button, Image} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import jwtDecode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Svg, {Path} from 'react-native-svg';
import { Colors } from '../color';

import Account from '../components/Account';
import Feed from '../components/Feed';
import Home from '../components/Home';
import AccountNavigation from './AccountNavigation';
import HomeNavigation from './HomeNavigation';
import ExploreTab from '../components/ExploreTab';

export default function AppNavigator({setToken}) {
  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{headerShown: false, tabBarShowLabel: false, headerStyle: {backgroundColor: "#f8f4f4"}}}>
        <Tab.Screen
          component={HomeNavigation}
          name="HomeTab"
          options={{
            tabBarIcon: ({focused}) => {
              return (
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={32}
                  height={32}
                  fill={focused ? Colors.primary : 'grey'}
                  className="bi bi-house-fill">
                  <Path
                    d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z"
                    transform="scale(1.85)"
                  />
                  <Path
                    d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6Z"
                    transform="scale(1.85)"
                  />
                </Svg>
              );
            },
          }}></Tab.Screen>

        <Tab.Screen
          name="Explore Tab"
          component={ExploreTab}
          options={{
            tabBarIcon: ({focused}) => {
              return (
                <Svg
                  width={32}
                  height={32}
                  fill={focused ? Colors.primary : "grey"}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512">
                  <Path
                    d="M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512zm50.7-186.9-144.3 55.5c-19.4 7.5-38.5-11.6-31-31l55.5-144.3c3.3-8.5 9.9-15.1 18.4-18.4l144.3-55.5c19.4-7.5 38.5 11.6 31 31l-55.5 144.3c-3.2 8.5-9.9 15.1-18.4 18.4zM288 256a32 32 0 1 0-64 0 32 32 0 1 0 64 0z"
                    transform="scale(.9)"
                  />
                </Svg>
              );
            },
          }}></Tab.Screen>

        <Tab.Screen
          component={AccountNavigation}
          initialParams={{setToken: setToken}}
          name="AccountTab"
          options={{
            tabBarIcon: ({focused}) => {
              return (
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={32}
                  height={32}
                  fill={focused ? Colors.primary : 'grey'}>
                  <Path
                    d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                    transform="scale(2)"
                  />
                </Svg>
              );
            },
          }}
        ></Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

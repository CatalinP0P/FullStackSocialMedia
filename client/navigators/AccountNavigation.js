import React from 'react';
import {Button, View, TouchableOpacity, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Account from '../components/Account';
import NewPost from '../components/NewPost';
import {launchImageLibrary} from 'react-native-image-picker';
import EditProfile from '../components/EditProfile';

export default function AccountNavigation({route, navigation}) {
  const setToken = route.params.setToken;

  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={Account}
        name="Account"
        options={{
          headerShown: false,
        }}
        initialParams={{setToken: setToken}}></Stack.Screen>
      <Stack.Screen
        component={NewPost}
        options={{
          headerShown: true,
          headerTitle: 'New Post',
        }}
        name="NewPost"></Stack.Screen>

      <Stack.Screen
      component={EditProfile}
      name='EditProfile'
      ></Stack.Screen>
    </Stack.Navigator>
  );
}

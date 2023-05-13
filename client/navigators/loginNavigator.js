import React from 'react';
import {SERVER_ADRESS} from "@env";
import {styles} from '../styles';
import {Colors} from '../color';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Login from "../components/Login";
import Register from '../components/Register';

const Stack = createNativeStackNavigator();

export default function LoginNavigator({setToken}, props) {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          initialParams={{setToken: setToken}}
          options={{headerShown: false}}></Stack.Screen>
        <Stack.Screen
          name="Register"
          component={Register}
          options={{
            headerStyle: {backgroundColor: Colors.primary},
            headerTitleStyle: {color: 'white'},
          }}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

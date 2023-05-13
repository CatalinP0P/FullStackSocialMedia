import React from 'react';
import {View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Account from '../components/Account';
import NewPost from '../components/NewPost';

export default function AccountNavigation({route}) {
  const setToken = route.params.setToken;
  console.log(setToken);

  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          component={Account}
          name="Account"
          options={{
            headerShown: false,
          }}
          initialParams={{setToken: setToken}}></Stack.Screen>

          <Stack.Screen>
            
      </Stack.Navigator>
    </NavigationContainer>
  );
}

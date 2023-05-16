import React, {useState} from 'react';
import {View, Text, Button, TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Components
import Home from '../components/Home';
import Comments from '../components/Comments';
import Profile from '../components/Profile';

export default function HomeNavigation() {
  const Stack = createNativeStackNavigator();

  const [post, setPost] = useState();
  const [userId, setUserId] = useState();

  return (
    <Stack.Navigator>
      <Stack.Screen
        component={Home}
        name="Home"
        initialParams={{
          setPost: setPost,
          setUserId: setUserId,
        }}
        options={{
          headerShown: false,
        }}></Stack.Screen>

      <Stack.Screen
        component={Comments}
        initialParams={{
          post: post,
          setUserId: setUserId,
        }}
        name="Comments"></Stack.Screen>

      <Stack.Screen
        component={Profile}
        initialParams={{userId: userId}}
        name="Profile"></Stack.Screen>
    </Stack.Navigator>
  );
}

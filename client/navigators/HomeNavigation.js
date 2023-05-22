import React, {useState} from 'react';
import {View, Text, Button, TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Components
import Home from '../components/Home';
import Comments from '../components/Comments';
import Profile from '../components/Profile';
import Posts from '../components/Posts';
import ProfilePosts from '../components/ProfilePosts';
import ProfilesList from '../components/ProfilesList';

export default function HomeNavigation() {
  const Stack = createNativeStackNavigator();

  const [post, setPost] = useState();
  const [profiles, setProfiles] = useState();
  const [userId, setUserId] = useState();

  return (
    <Stack.Navigator
    screenOptions={{
      headerStyle: {backgroundColor: "#f8f4f4"}
    }}>
      <Stack.Screen
        component={Home}
        name="Home"
        initialParams={{
          setPost: setPost,
          setUserId: setUserId,
          setProfiles: setProfiles
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
        initialParams={{userId: userId, setProfiles: setProfiles}}
        name="Profile"></Stack.Screen>

      <Stack.Screen
        component={ProfilesList}
        name='ProfilesList'
        initialParams={{profiles: profiles}}
      ></Stack.Screen>

      <Stack.Screen
        component={ProfilePosts}
        name="ProfilePosts"
        initialParams={{
          userId: userId,
          setPost: setPost,
          setUserId: setUserId,
          setProfiles: setProfiles
        }}></Stack.Screen>
    </Stack.Navigator>
  );
}

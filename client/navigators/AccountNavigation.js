import React, {useState} from 'react';
import {Button, View, TouchableOpacity, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {launchImageLibrary} from 'react-native-image-picker';
import {useSafeAreaFrame} from 'react-native-safe-area-context';

import Account from '../components/Account';
import NewPost from '../components/NewPost';
import MyPosts from '../components/MyPosts';
import Comments from '../components/Comments';
import Profile from '../components/Profile';
import EditProfile from '../components/EditProfile';

export default function AccountNavigation({route, navigation}) {
  const setToken = route.params.setToken;

  const [post, setPost] = useState();
  const [userId, setUserId] = useState();

  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={Account}
        name="Account"
        options={{
          headerShown: false,
        }}
        initialParams={{
          setToken: setToken,
          setUeserId: setUserId,
          setPost: setPost,
        }}></Stack.Screen>
      <Stack.Screen
        component={NewPost}
        options={{
          headerShown: true,
          headerTitle: 'New Post',
        }}
        name="NewPost"></Stack.Screen>
      <Stack.Screen
        component={Comments}
        name="Comments"
        initialParams={{
          post: post,
          setUserId: setUserId,
        }}></Stack.Screen>
      <Stack.Screen
        component={Profile}
        name="Profile"
        initialParams={{userId: userId}}></Stack.Screen>
      <Stack.Screen component={MyPosts} name="MyPosts" initialParams={{setPost: setPost, setUserId}}></Stack.Screen>

      <Stack.Screen component={EditProfile} name="EditProfile"></Stack.Screen>
    </Stack.Navigator>
  );
}

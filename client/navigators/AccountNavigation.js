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
import ProfilesList from '../components/ProfilesList';
import { setTSpan } from 'react-native-svg/lib/typescript/lib/extract/extractText';

export default function AccountNavigation({route, navigation}) {
  const setToken = route.params.setToken;

  const [post, setPost] = useState();
  const [userId, setUserId] = useState();
  const [profiles, setProfiles] = useState([]);

  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: {backgroundColor: "#f8f4f4"}
    }}>
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
      <Stack.Screen 
      component={ProfilesList}
      name="ProfilesList"
      initialParams={{profiles: profiles}}
      ></Stack.Screen>
      <Stack.Screen
        component={MyPosts}
        name="MyPosts"
        initialParams={{setPost: setPost, setUserId, setProfiles: setProfiles}}></Stack.Screen>

      <Stack.Screen component={EditProfile} name="EditProfile"></Stack.Screen>
    </Stack.Navigator>
  );
}

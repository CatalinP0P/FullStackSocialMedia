import React, {useState} from 'react';
import {View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaFrameContext} from 'react-native-safe-area-context';

import SearchPeople from '../components/SearchPeople';
import Profile from './Profile';
import ProfilePosts from './ProfilePosts';
import Comments from './Comments';

const Stack = createNativeStackNavigator();

export default function ExploreTab() {
  const [userId, setUserId] = useState();
  const [post, setPost] = useState();

  return (
    <Stack.Navigator>
      <Stack.Screen
        component={SearchPeople}
        options={{headerShown: false}}
        initialParams={{setUserId: setUserId}}
        name="SearchPeople"></Stack.Screen>
      <Stack.Screen
        component={Profile}
        name="Profile"
        initialParams={{userId: userId, setUserId: setUserId, setPost: setPost}}></Stack.Screen>
      <Stack.Screen
        component={ProfilePosts}
        name="ProfilePosts"
        initialParams={{
          userId: userId,
          post: post,
          setUserId: setUserId,
          setPost: setPost,
        }}></Stack.Screen>
      <Stack.Screen
        component={Comments}
        name="Comments"
        initialParams={{post: post, setUserId: setUserId}}></Stack.Screen>
    </Stack.Navigator>
  );
}

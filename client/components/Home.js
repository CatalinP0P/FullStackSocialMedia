import {SERVER_ADRESS} from '@env';
import React, {useEffect, useState} from 'react';
import {Colors} from '../color';
import axios from 'axios';
import * as Auth from '../authServices';
import {
  Dimensions,
  SafeAreaView,
  View,
  Image,
  Button,
  Text,
  ScrollView,
  requireNativeComponent,
  Pressable,
  LogBox
} from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

import {Path, Svg} from 'react-native-svg';
import {ServerContainer} from '@react-navigation/native';

import Posts from './Posts';

export default function Home({navigation, route}) {
  const [posts, setPosts] = useState([]);

  const {setPost} = route.params;

  useEffect(() => {
    (async () => {
      const token = await Auth.getTokenAsync();

      // Getting the last 20 posts;
      const req = axios.create({
        headers: {
          authToken: 'Bearer ' + token,
        },
      });

      req
        .get(SERVER_ADRESS + 'posts/20')
        .then(async response => {
          for (var i = 0; i < response.data.length; i++) {
            const username = await Auth.getUsername(response.data[i].user_id);
            const profilepicture = await Auth.getImage(
              response.data[i].user_id,
            );
            response.data[i] = {
              ...response.data[i],
              username: username,
              profilepicture: profilepicture,
            };

            // Like Count and like state
            const token = await Auth.getTokenAsync();
            const req = axios.create({
              headers: {
                authToken: 'Bearer ' + token,
              },
            });

            var adress = SERVER_ADRESS + 'likes/count/' + response.data[i]._id;
            var res = await req.get(adress);

            response.data[i] = {...response.data[i], likes: res.data};

            adress = SERVER_ADRESS + 'likes/status/' + response.data[i]._id;
            res = await req.get(adress);

            const liked = res.data == 0 ? false : true;

            response.data[i] = {...response.data[i], liked: liked};
          }

          setPosts(response.data);
        })
        .catch(err => {
          console.error(err);
        });
    })();
  }, []);

  const {width, height} = Dimensions.get('window');

  return (
    <Posts posts={posts} setPost={setPost} navigation={navigation} setUserId={route.params.setUserId} setProfiles={route.params.setProfiles} ></Posts>
  );
}

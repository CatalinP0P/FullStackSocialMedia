import {SERVER_ADRESS} from '@env';
import React, {useEffect, useState} from 'react';
import { Colors } from '../color';
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
} from 'react-native';

export default function Home() {
  const [posts, setPosts] = useState([]);

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
    <SafeAreaView>
      <ScrollView>
        <View style={{display: 'flex', gap: 32, marginHorizontal: 4}}>
          {posts.map(post => {
            return (
              <View key={post._id}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: 8,
                      marginVertical: 8,
                    }}>
                    <Image
                      source={{
                        uri: 'data:image/png;base64,' + post.profilepicture,
                      }}
                      style={{width: 32, height: 32, borderRadius: 16}}></Image>
                    <Text style={{fontSize: 24}}>{post.username}</Text>
                  </View>
                  <View />
                </View>
                <Image
                  source={{uri: 'data:image/png;base64,' + post.image64}}
                  style={{height: width}}></Image>
                <Text
                style={{fontSize: 20, marginTop: 8, color: Colors.black25}}
                >{post.title}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

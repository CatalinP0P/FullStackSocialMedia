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
} from 'react-native';
import {Path, Svg} from 'react-native-svg';
import {ServerContainer} from '@react-navigation/native';

export default function Profile({navigation, route}) {
  const [user, setUser] = useState();
  const [posts, setPosts] = useState([]);
  const [image64, setImage64] = useState();

  useEffect(() => {
    (async () => {
      const user = await Auth.getUserById(route.params.userId);
      setUser(user);
      
      console.log(route.params.userId);
      const image = await Auth.getImage(route.params.userId); 
      setImage64(image);

      // Getting the posts
      const token = await Auth.getTokenAsync();
      const req = axios.create({
        headers: {
          authToken: "Bearer " + token ,
        }
      })

      req.get(SERVER_ADRESS + "posts/user/" + route.params.userId).then(async response =>{
        setPosts(response.data);
      }).catch(err => {
        console.error(err.response.data)
      });
    })()
  }, []);

  navigation.setOptions({
    title: user?.username,
  })

  return (
    <SafeAreaView>
      <View
        style={{
          dispaly: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 8,
          paddingVertical: 16
        }}>
        <Image
          style={{width: 96, height: 96, borderRadius: 48}}
          source={{uri: 'data:image/png;base64,' + image64}}></Image>

        <View
          style={{
            dispaly: 'flex',
            flexDirection: 'row',
            gap: 16,
            paddingHorizontal: 16,
          }}>
          <View
            style={{
              dispaly: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{fontWeight: 600}}>1</Text>
            <Text> Posts </Text>
          </View>

          <View
            style={{
              dispaly: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{fontWeight: 600}}>916</Text>
            <Text> Followers </Text>
          </View>

          <View
            style={{
              dispaly: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{fontWeight: 600}}>715</Text>
            <Text> Following </Text>
          </View>
        </View>
      </View>
      
      {/* Bio */}
      <View style={{paddingHorizontal: 8}} > 
          <Text style={{fontSize: 20, fontWeight: 700}} >{user?.name}</Text>
      </View>

      {/* Posts area */}
      <View style={{display: 'flex', flexWrap: 'wrap', flexDirection: 'row', paddingTop: 32}}>
        {posts.map(post => {
          const {width} = Dimensions.get('window');
          const size = width / 3;
          return (
            <Image
              key={post._id}
              style={{width: size, height: size}}
              source={{uri: 'data:image/png;base64,' + post.image64}}></Image>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

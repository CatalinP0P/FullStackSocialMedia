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
  LogBox,
} from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

import {Path, Svg} from 'react-native-svg';
import {ServerContainer} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

export default function Posts(props) {
  const [posts, setPosts] = useState([]);

  const navigation = props.navigation;
  const setPost = props.setPost;
  // console.log(setPost);

  const likePost = async postid => {
    const token = await Auth.getTokenAsync();
    console.log(token);
    var req = axios.create({
      headers: {
        authToken: 'Bearer ' + token,
      },
    });

    const newPosts = [...posts];
    for (var i = 0; i < newPosts.length; i++) {
      if (newPosts[i]._id == postid) {
        newPosts[i].liked = !newPosts[i].liked;
        if (newPosts[i].liked) {
          newPosts[i].likes++;
        } else newPosts[i].likes--;
      }
    }
    setPosts(newPosts);

    const response = await req.post('http://localhost:4000/likes/' + postid);
    console.log(response.data);
  };

  useEffect(() => {
    setPosts(props.posts);
  });

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{display: 'flex', gap: 8, marginHorizontal: 4}}>
          {posts.map(post => {
            return (
              <View
                key={post._id}
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: 'rgb(200,200,200)',
                  paddingBottom: 32,
                }}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Pressable
                    onPress={() => {
                      console.log('Da');
                      console.log(post.user_id);
                      const setUserId = props.setUserId;
                      setUserId(post.user_id);
                      setTimeout(() => {
                        navigation.navigate('Profile');
                      }, 10);
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
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                        }}></Image>
                      <Text style={{fontSize: 24}}>{post.username}</Text>
                    </View>
                  </Pressable>
                  <View />
                </View>
                <Image
                  source={{uri: 'data:image/png;base64,' + post.image64}}
                  style={{height: width}}></Image>

                <View
                  style={{display: 'flex', flexDirection: 'row', marginTop: 8}}>
                  <View
                    style={{display: 'flex', flexDirection: 'row', gap: 16}}>
                    <Pressable onPress={() => likePost(post._id)}>
                      {!post.liked ? (
                        <Svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                          width={24}
                          height={24}>
                          <Path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144 39.4-7.6 79.7 1.5 111.8 24.1 9 6.4 17.4 13.8 25 22.3 4.2-4.8 8.7-9.2 13.5-13.3 3.7-3.2 7.5-6.2 11.5-9 32.1-22.6 72.4-31.7 111.8-24.2C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1c-23.1-25.9-58-37.7-92-31.2-46.6 8.9-80.2 49.5-80.2 96.9v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268a102.7 102.7 0 0032.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9-34-6.5-69 5.4-92 31.2l-.1.1-.1.1-17.8 20c-.3.4-.7.7-1 1.1-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />
                        </Svg>
                      ) : (
                        <Svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={24}
                          height={24}
                          viewBox="0 0 512 512">
                          <Path d="M47.6 300.4l180.7 168.7c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9l180.7-168.7c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141-45.6-7.6-92 7.3-124.6 39.9l-12 12-12-12c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                        </Svg>
                      )}
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        setPost(post);
                        setTimeout(() => {
                          navigation.navigate('Comments');
                        }, 10);
                      }}>
                      <Svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 512 512">
                        <Path d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4 26.5 9.6 56.2 15.1 87.8 15.1 124.7 0 208-80.5 208-160S380.7 80 256 80 48 160.5 48 240c0 32 12.4 62.8 35.7 89.2 8.6 9.7 12.8 22.5 11.8 35.5-1.4 18.1-5.7 34.7-11.3 49.4 17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1 10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240 0 125.1 114.6 32 256 32s256 93.1 256 208-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9-11.9 8.7-31.3 20.6-54.3 30.6-15.1 6.6-32.3 12.6-50.1 16.1-.8.2-1.6.3-2.4.5-4.4.8-8.7 1.5-13.2 1.9-.2 0-.5.1-.7.1-5.1.5-10.2.8-15.3.8-6.5 0-12.3-3.9-14.8-9.9S0 457.4 4.5 452.8c4.1-4.2 7.8-8.7 11.3-13.5 1.7-2.3 3.3-4.6 4.8-6.9.1-.2.2-.3.3-.5z" />
                      </Svg>
                    </Pressable>
                    <Svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 576 512">
                      <Path d="M400 255.4V208c0-8.8-7.2-16-16-16h-94.5c-50.9 0-93.9 33.5-108.3 79.6-3.3-9.4-5.2-19.8-5.2-31.6 0-61.9 50.1-112 112-112h96c8.8 0 16-7.2 16-16V64.6L506 160l-106 95.4zM336 240h16v48c0 17.7 14.3 32 32 32h3.7c7.9 0 15.5-2.9 21.4-8.2l139-125.1c7.6-6.8 11.9-16.5 11.9-26.7s-4.3-19.9-11.9-26.7L409.9 8.9C403.5 3.2 395.3 0 386.7 0 367.5 0 352 15.5 352 34.7V80h-64c-88.4 0-160 71.6-160 160 0 60.4 34.6 99.1 63.9 120.9 5.9 4.4 11.5 8.1 16.7 11.2 4.4 2.7 8.5 4.9 11.9 6.6 3.4 1.7 6.2 3 8.2 3.9 2.2 1 4.6 1.4 7.1 1.4h2.5c9.8 0 17.8-8 17.8-17.8 0-7.8-5.3-14.7-11.6-19.5-.4-.3-.7-.5-1.1-.8-1.7-1.1-3.4-2.5-5-4.1-.8-.8-1.7-1.6-2.5-2.6s-1.6-1.9-2.4-2.9c-1.8-2.5-3.5-5.3-5-8.5-2.6-6-4.3-13.3-4.3-22.4 0-36.1 29.3-65.5 65.5-65.5H336zM72 32C32.2 32 0 64.2 0 104v336c0 39.8 32.2 72 72 72h336c39.8 0 72-32.2 72-72v-64c0-13.3-10.7-24-24-24s-24 10.7-24 24v64c0 13.3-10.7 24-24 24H72c-13.3 0-24-10.7-24-24V104c0-13.3 10.7-24 24-24h64c13.3 0 24-10.7 24-24s-10.7-24-24-24H72z" />
                    </Svg>
                  </View>
                </View>

                <Text style={{fontSize: 16, fontWeight: 700, marginTop: 8}}>
                  {post.likes} likes
                </Text>

                <Text
                  style={{fontSize: 16, marginTop: 8, color: Colors.black25}}>
                  <Text style={{fontWeight: 700}}>
                    {post.username.toLowerCase()}{' '}
                  </Text>
                  {post.title}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

import {SERVER_ADRESS} from '@env';
import React, {useEffect, useReducer, useState, useRef} from 'react';
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
  Touchable,
  TouchableOpacity,
} from 'react-native';
import {Path, RNSVGSymbol, Svg} from 'react-native-svg';
import {ServerContainer} from '@react-navigation/native';
import {isUriAnAndroidResourceIdentifier} from 'react-native-svg/lib/typescript/LocalSvg';

export default function Profile({navigation, route}) {
  const [user, setUser] = useState();
  const [posts, setPosts] = useState([]);
  const [image64, setImage64] = useState();
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);

  const [fol, setFol] = useState(0);

  const setProfiles = route.params.setProfiles;

  const handleFollowButton = async () => {};

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
          authToken: 'Bearer ' + token,
        },
      });

      req
        .get(SERVER_ADRESS + 'posts/user/' + route.params.userId)
        .then(async response => {
          setPosts(response.data);
        })
        .catch(err => {
          console.error(err.response.data);
        });

      var response = await req.get(
        SERVER_ADRESS + 'following/followers/' + route.params.userId,
      );
      setFollowers(response.data);

      response = await req.get(
        SERVER_ADRESS + 'following/following/' + route.params.userId,
      );
      setFollowing(response.data);

      // Checking if the person visiting if following the person
      response = await req.get(
        SERVER_ADRESS + 'following/' + route.params.userId,
      );
      setFol(response.data);
    })();
  }, []);

  navigation.setOptions({
    title: user?.username,
    headerStyle: {
      backgroundColor: '#f2f2f2',
    },
  });

  return (
    <SafeAreaView>
      <View
        style={{
          dispaly: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 8,
          paddingVertical: 16,
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
            <Text style={{fontWeight: 600}}>{[posts.length]}</Text>
            <Text> Posts </Text>
          </View>

          <View
            style={{
              dispaly: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{fontWeight: 600}}>{followers.length}</Text>
            <Text> Followers </Text>
          </View>

          <View
            style={{
              dispaly: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{fontWeight: 600}}>{following.length}</Text>
            <Text> Following </Text>
          </View>
        </View>
      </View>

      {/* Bio */}
      <View style={{paddingHorizontal: 8}}>
        <Text style={{fontSize: 20, fontWeight: 700}}>{user?.name}</Text>
      </View>

      <View
        style={{
          margin: 8,
        }}>
        <TouchableOpacity
          onPress={() => handleFollowButton()}
          style={{
            padding: 4,
            borderColor: 'rgb(200,200,200)',
            borderWidth: 1,
            borderRadius: 30,
            backgroundColor: 'rgb(240,240,240)',
          }}>
          <Text style={{fontSize: 16, textAlign: 'center', fontWeight: 700}}>
            {fol == 0 ? 'Follow' : 'Unfollow'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Posts area */}
      <View
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          flexDirection: 'row',
          marginTop: 32,
        }}>
        {posts.map(post => {
          const {width} = Dimensions.get('window');
          const size = width / 3;
          return (
            <Pressable
              onPress={() => navigation.navigate('ProfilePosts')}
              key={post._id}>
              <Image
                style={{width: size, height: size}}
                source={{uri: 'data:image/png;base64,' + post.image64}}></Image>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}


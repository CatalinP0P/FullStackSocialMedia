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
  useAnimatedValue,
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

  const followButtonRef = useRef();
  const setProfiles = route.params.setProfiles;

  const handleFollowButton = async () => {
    var authToken = await Auth.getTokenAsync();
    var req = axios.create({
      headers: {
        authToken: 'Bearer ' + authToken,
      },
    });

    if (fol == 0) {
      const adress = SERVER_ADRESS + 'following/' + user._id;
      const response = await req.post(adress).catch(err => {
        return console.log(err.response.data);
      });

      setFol(1);
      getProfileDetails();
    } else {
      const adress = SERVER_ADRESS + 'following/' + user._id;
      const repsonse = await req.delete(adress).catch(err => {
        return console.log(err.response.data);
      });

      setFol(0);
      getProfileDetails();
    }
  };

  const getProfileDetails = async () => {
    const user = await Auth.getUserById(route.params.userId);
    setUser(user);

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
    for (var i = 0; i < response.data.length; i++) {
      const follower_id = response.data[i].follower_id;
      const username = await Auth.getUsername(follower_id);
      const image64 = await Auth.getImage(follower_id);

      response.data[i] = {
        _id: follower_id,
        username: username,
        image64: image64,
      };
    }
    setFollowers(response.data);

    response = await req.get(
      SERVER_ADRESS + 'following/following/' + route.params.userId,
    );
    for (var i = 0; i < response.data.length; i++) {
      const following_id = response.data[i].following_id;
      const username = await Auth.getUsername(following_id);
      const image64 = await Auth.getImage(following_id);

      response.data[i] = {
        _id: following_id,
        username: username,
        image64: image64,
      };
    }

    setFollowing(response.data);

    // Checking if the person visiting if following the person
    response = await req.get(
      SERVER_ADRESS + 'following/' + route.params.userId,
    );
    setFol(response.data);

    const loggedUser = await Auth.getLoggedUserFromDBAsync();
    const display = loggedUser._id == route.params.userId ? 'none' : 'flex';
    followButtonRef.current.setNativeProps({
      style: {
        display: display,
      },
    });
  };

  useEffect(() => {
    getProfileDetails();
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
            <Pressable style={{alignItems: "center"}}
            onPress={() => {
              setProfiles(followers);
              setTimeout(() => {
                navigation.navigate("ProfilesList")
              }, 125); 
            }} >
              <Text style={{fontWeight: 600}}>{followers.length}</Text>
              <Text> Followers </Text>
            </Pressable>
          </View>

          <View
            style={{
              dispaly: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Pressable
              style={{alignItems: 'center'}}
              onPress={() => {
                setProfiles(following);
                setTimeout(() => {
                  navigation.navigate('ProfilesList');
                }, 125);
              }}>
              <Text style={{fontWeight: 600}}>{following.length}</Text>
              <Text> Following </Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Bio */}
      <View style={{paddingHorizontal: 8}}>
        <Text style={{fontSize: 20, fontWeight: 700}}>{user?.name}</Text>
      </View>

      <View
        ref={followButtonRef}
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

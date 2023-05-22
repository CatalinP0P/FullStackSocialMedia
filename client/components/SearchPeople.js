import {SERVER_ADRESS} from '@env';
import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import * as Auth from '../authServices';
import {
  SafeAreaView,
  ScrollView,
  Button,
  View,
  TextInput,
  Touchable,
  Text,
  Image,
  Pressable,
  Dimensions,
} from 'react-native';
import {ServerContainer} from '@react-navigation/native';

export default function SearchPeople({navigation, route}) {
  const [profilesFound, setProfilesFound] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);

  const {width, height} = Dimensions.get('window');

  const popularPostsRef = useRef();
  const profilesFoundRef = useRef();
  const cancelButtonRef = useRef();
  const textBoxRef = useRef();

  const handleTextChange = async text => {
    const q = text.trim();
    if (q.length < 1) return;

    const req = axios.create({
      headers: {
        authToken: 'Bearer ' + (await Auth.getTokenAsync()),
      },
    });

    req.get(SERVER_ADRESS + 'auth/users/q/' + q).then(async response => {
      for (var i = 0; i < response.data.length; i++) {
        var profilephoto = await Auth.getImage(response.data[i]._id);
        response.data[i] = {...response.data[i], profilephoto: profilephoto};
      }

      setProfilesFound(response.data);
    });
  };

  useEffect(() => {
    (async () => {
      var req = axios.create({
        headers: {
          authToken: 'Bearer ' + (await Auth.getTokenAsync()),
        },
      });

      req.get(SERVER_ADRESS + 'posts/popular/10').then(response => {
        let posts = [];
        response.data.forEach(res => {
          posts.push(res.post[0]);
        });

        setTimeout(() => {
          setPopularPosts(posts);
        }, 200);
      });
    })();
  }, []);

  const goToProfile = id => {
    const setUserId = route.params.setUserId;
    setUserId(id);
    setTimeout(() => {
      navigation.navigate('Profile');
    }, 250);
  };

  return (
    <SafeAreaView style={{marginTop: 32, flex:1}}>
      <View
        style={{
          padding: 8,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: 'rgb(200,200,200)',
          width: '100%',
        }}>
        <TextInput
          ref={textBoxRef}
          style={{
            flex: 1,
            padding: 8,
            paddingHorizontal: 16,
            backgroundColor: 'rgb(240,240,240)',
            borderWidth: 1,
            borderColor: 'rgb(200,200,200)',
            borderRadius: 40,
          }}
          onChangeText={text => handleTextChange(text)}
          onFocus={() => {
            profilesFoundRef.current.setNativeProps({
              style: {
                display: 'flex',
              },
            });
            cancelButtonRef.current.setNativeProps({
              style: {
                display: 'flex',
              },
            });
            popularPostsRef.current.setNativeProps({
              style: {
                display: 'none',
              },
            });
          }}
          placeholder="Search people..."></TextInput>
        <Pressable
          style={{padding: 8}}
          onPress={() => {
            textBoxRef.current.blur();
            cancelButtonRef.current.setNativeProps({
              style: {
                display: 'none',
              },
            });
            profilesFoundRef.current.setNativeProps({
              style: {
                display: 'none',
              },
            });
            popularPostsRef.current.setNativeProps({
              style: {
                display: 'flex',
              },
            });

            textBoxRef.current.clear();
            setProfilesFound([]);
          }}>
          <Text ref={cancelButtonRef} style={{color: 'black', display: 'none'}}>
            Cancel
          </Text>
        </Pressable>
      </View>

      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          paddingHorizontal: 8,
          marginTop: 16,
        }}>
        <View ref={profilesFoundRef} style={{display: 'none'}}>
          {profilesFound.map(profile => {
            return (
              <Pressable
                key={profile._id}
                onPress={() => goToProfile(profile._id)}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                  }}>
                  <Image
                    style={{width: 40, height: 40, borderRadius: 20}}
                    source={{
                      uri: 'data:image/png;base64,' + profile.profilephoto,
                    }}></Image>
                  <View
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      height: 32,
                    }}>
                    <Text style={{fontWeight: 600}}> {profile.username} </Text>
                    <Text style={{fontSize: 12, color: 'rgb(100,100,100)'}}>
                      {profile.name}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
      <ScrollView ref={popularPostsRef} style={{flex: 1}}>
        <View
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            width: width,
            flexDirection: 'row',
          }}>
          {popularPosts.map(post => {
            return (
              <Pressable key={post._id} >
                <Image
                  source={{uri: 'data:image/png;base64,' + post.image64}}
                  style={{width: width / 3, height: width / 2.75}}></Image>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

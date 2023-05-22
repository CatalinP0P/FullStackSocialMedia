import {
  View,
  Image,
  Text,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Touchable,
} from 'react-native';
import {SERVER_ADRESS} from '@env';
import React, {useEffect, useState} from 'react';
import * as Auth from '../authServices';
import axios from 'axios';
import {Colors} from '../color';
import {get} from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

export default function Comments({route, navigation}) {
  const [profilePhoto, setProfilePhoto] = useState();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);

  const post = route.params.post;

  const sendComment = async () => {
    if (newComment.trim() == '') return;

    const token = await Auth.getTokenAsync();
    var req = axios.create({
      headers: {
        authToken: 'Bearer ' + token,
      },
    });

    req
      .post(SERVER_ADRESS + 'comments/' + post._id, {
        comment: newComment.trim(),
      })
      .then(response => {
        console.log(response.data.insertedId);
        setNewComment('');
        getComments();
      })
      .catch(err => {
        console.error(err);
      });
  };

  const getComments = async () => {
    const token = await Auth.getTokenAsync();
    var req = axios.create({
      headers: {
        authToken: 'Bearer ' + token,
      },
    });

    req
      .get(SERVER_ADRESS + 'comments/' + post._id)
      .then(async response => {
        for (var i = 0; i < response.data.length; i++) {
          const username = await Auth.getUsername(response.data[i].user_id);
          const profilepicture = await Auth.getImage(response.data[i].user_id);

          response.data[i] = {
            ...response.data[i],
            username: username,
            profilepicture: profilepicture,
          };
          console.log(username, profilepicture);
        }

        setComments(response.data);
      })
      .catch(err => {
        console.error(err);
      });
  };

  useEffect(() => {
    (async () => {
      const loggedUser = await Auth.getLoggedUserAsync();
      const image = await Auth.getImage(loggedUser._id);
      setProfilePhoto(image);
    })();

    getComments();
  }, []);

  navigation.setOptions({
    headerStyle: {
      backgroundColor: "#f2f2f2",
    }
  })

  return (
    <SafeAreaView style={{display: 'flex', flexDirection: 'column', flex: 1}}>
      <ScrollView style={{flex: 1, gap: 8}}>
        <View
          style={{
            display: 'flex',
            gap: 16,
            flexDirection: 'row',
            margin: 8,
            alignItems: 'center',
            paddingBottom: 16,
            borderBottomColor: 'rgb(200,200,200)',
            borderBottomWidth: 1,
          }}>
          <Image
            style={{width: 40, height: 40, borderRadius: 20}}
            source={{
              uri: 'data:image/png;base64,' + post.profilepicture,
            }}></Image>
          <View style={{display: 'flex', flexDirection: 'column'}}>
            <Text style={{fontSize: 16, fontWeight: 700}}>{post.username}</Text>
            <Text style={{fontSize: 16}}>{post.title}</Text>
          </View>
        </View>

        {comments.map(comment => {
          return (
            <View
              key={comment._id}
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 16,
                alignItems: 'flex-start',
                margin: 8,
              }}>
              <Image
                source={{
                  uri: 'data:image/png;base64,' + comment.profilepicture,
                }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                }}></Image>

              <View style={{display: 'flex', flexDirection: 'column'}}>
                <Text style={{fontSize: 16, fontWeight: 700}}>
                  {comment.username}
                </Text>
                <Text style={{fontSize: 16, marginRight: 75}}>
                  {comment.comment}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
      <View
        style={{
          margin: 8,
          gap: 8,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <Image
          source={{uri: 'data:image/png;base64,' + profilePhoto}}
          style={{height: 40, width: 40, borderRadius: 20}}></Image>
        <TextInput
          style={{
            flex: 1,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: 'rgb(200,200,200)',
          }}
          placeholder="Add comment..."
          value={newComment}
          onChangeText={e => setNewComment(e)}></TextInput>

        <TouchableOpacity
          onPress={sendComment}
          style={{backgroundColor: Colors.primary, borderRadius: 20}}>
          <Text
            style={{
              color: 'white',
              paddingVertical: 8,
              fontSize: 20,
              paddingHorizontal: 10,
            }}>
            {' '}
            Send{' '}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

import {SERVER_ADRESS} from '@env';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Posts from './Posts';
import * as Auth from '../authServices';

export default function ProfilePosts({navigation, route}) {
    const [posts, setPosts] = useState([]);
    const [username, setUsername] = useState('');
    const setProfiles = route.params.setProfiles;
    const setPost = route.params.setPost;
    const setUserId = route.params.setUserId;
    const userId = route.params.userId;

    navigation.setOptions({
        title: `${username} Posts`
    })
  
    useEffect(() => {
      (async () => {
        const username = await Auth.getUsername(userId);
        setUsername(username);
        const token = await Auth.getTokenAsync();
        var req = axios.create({
          headers: {
            authToken: 'Bearer ' + token,
          },
        });
  
        req
          .get(SERVER_ADRESS + 'posts/user/' + userId)
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
            console.error(err.response.data);
          });
      })();
    });
  
    return (
      <Posts
        posts={posts}
        setPost={setPost}
        setUserId={setUserId}
        setProfiles={setProfiles}
        navigation={navigation}></Posts>
    );
}

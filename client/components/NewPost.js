import {SERVER_ADRESS} from '@env';
import axios from 'axios';
import React, {useState, useEffect} from 'react';
import {
  Dimensions,
  Image,
  View,
  Text,
  SafeAreaView,
  TextInput,
  useAnimatedValue,
  Touchable,
  TouchableOpacity,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {styles} from '../styles';
import {Colors} from '../color';
import * as Auth from '../authServices';
import {ServerContainer} from '@react-navigation/native';

export default function NewPost() {
  const [caption, setCaption] = useState('');

  const [image64, setImage64] = useState('');
  const {width, height} = Dimensions.get('window');

  const post = async () => {
    const token = await Auth.getTokenAsync();

    const api = axios.create({
      baseURL: SERVER_ADRESS,
      headers: {
        'Content-Type': 'application/json',
        authToken: 'Bearer ' + token,
      },
    });

    api
      .post('/posts', {title: caption, image64: image64})
      .then(response => {
        console.log(response.data);
      })
      .catch(err => {
        console.error(err);
      });
  };

  useEffect(() => {
    (async () => {
      const image = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: true,
      });
      setImage64(image.assets[0].base64);
    })();
  }, []);

  return (
    <SafeAreaView>
      <View>
        <Image
          source={{
            uri: 'data:image/png;base64,' + image64,
            height: width + width / 6,
          }}
        />
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 16,
          }}>
          <TextInput
            placeholder="Caption.."
            value={caption}
            onChangeText={e => setCaption(e)}
            style={styles.input2}></TextInput>
          <TouchableOpacity
            style={{
              paddingHorizontal: 24,
              paddingVertical: 8,
              backgroundColor: Colors.primary,
              borderRadius: 40,
              marginTop: 8,
            }}
            onPress={() => post()}>
            <Text style={{color: 'white'}}> Post </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

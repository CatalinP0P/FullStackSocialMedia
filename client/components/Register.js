import {SERVER_ADRESS} from '@env';
import React, {useEffect, useState} from 'react';
import {Colors} from '../color';
import {
  Image,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Button,
  processColor,
} from 'react-native';
import {styles} from '../styles';
import axios from 'axios';
import {launchImageLibrary} from 'react-native-image-picker';

export default function Register(props) {
  const {navigation} = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPass, setConfirmedPass] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');

  const [image64, setImage64] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const [error, setError] = useState('');


  async function launchGallery() {
    launchImageLibrary(
      {mediaType: 'photo', includeBase64: true, quality: 0.015},
      response => {
        if (!response.error && !response.didCancel) {
          setImage64(response.assets[0].base64);
          setImageUrl("data:image/png;base64," + response.assets[0].base64);
        }
      },
    );
  }

  const register = async () => {
    const adress = SERVER_ADRESS + 'auth/register';
    console.log(adress);
    const response = await axios
      .post(adress, {
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        password: password,
        firstName: firstName,
        lastName: lastName,
        image64: image64,
      })
      .catch(err => {
        if (err.response.status == 400) setError(err.response.data);
        return;
      });

    navigation.navigation('Login');
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.round}
        source={{
          uri: imageUrl,
        }}></Image>

      <TouchableOpacity
        style={{padding: 8, backgroundColor: Colors.primary}}
        onPress={launchGallery}>
        <Text style={{color: 'white'}}> Choose image </Text>
      </TouchableOpacity>

      <Text style={{color: 'red'}}>{error}</Text>
      <TextInput
        placeholder="Email"
        style={styles.input2}
        value={email}
        onChangeText={e => setEmail(e)}></TextInput>
      <TextInput
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={e => setPassword(e)}
        style={styles.input2}></TextInput>
      <TextInput
        placeholder="Confirm Password"
        secureTextEntry={true}
        value={confirmedPass}
        onChangeText={e => setConfirmedPass(e)}
        style={styles.input2}></TextInput>
      <TextInput
        placeholder="Username"
        style={styles.input2}
        value={username}
        onChangeText={e => setUsername(e)}></TextInput>
      <TextInput
        placeholder="FirstName"
        style={styles.input2}
        value={firstName}
        onChangeText={e => setFirstName(e)}></TextInput>
      <TextInput
        placeholder="LastName"
        style={styles.input2}
        value={lastName}
        onChangeText={e => setLastName(e)}></TextInput>

      <TouchableOpacity style={[styles.btn, {width: '80%'}]} onPress={register}>
        <Text style={[styles.text, {color: 'white', textAlign: 'center'}]}>
          {' '}
          Create Account{' '}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

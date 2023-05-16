import {SERVER_ADRESS} from '@env';
import React, {useState} from 'react';
import {styles} from '../styles';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import {Colors} from '../color';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSafeAreaFrame} from 'react-native-safe-area-context';
import jwtDecode from 'jwt-decode';

export default function Login({navigation, route}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const setToken = route.params.setToken;

  const login = async () => {
    const adress = SERVER_ADRESS + 'auth/login';
    const body = {email: email.toLowerCase(), password: password};
    console.log(adress);
    const response = await axios.post(adress, body).catch(err => {
      console.log(err);
      return;
    });

    const {authtoken} = response.headers;
    setToken(authtoken);
    await AsyncStorage.setItem('authToken', authtoken);
  };

  return (
    <View
      style={[
        styles.container,
        {alignItems: 'center', justifyContent: 'center'},
      ]}>
      <View style={[styles.container]}>
        <Text style={styles.h1}> Welcome to my app! </Text>
        <Text style={{color: 'red', marginTop: 64}}> {error} </Text>
        <TextInput
          placeholder="Email.."
          value={email}
          onChangeText={e => setEmail(e)}
          style={[styles.input, {width: '80%'}]}></TextInput>
        <TextInput
          placeholder="Password.."
          style={[styles.input, {width: '80%', marginBottom: 32}]}
          value={password}
          onChangeText={e => setPassword(e)}
          secureTextEntry={true}></TextInput>
        <TouchableOpacity
          onPress={() => login()}
          style={[
            styles.btn,
            {width: '80%', alignItems: 'center', marginBottom: 16},
          ]}>
          <Text style={[styles.text, {color: 'white'}]}> Login </Text>
        </TouchableOpacity>
        <Text style={styles.text}>
          {' '}
          No Account?{' '}
          <Text
            style={{color: Colors.primary, fontWeight: 700}}
            onPress={() => navigation.navigate('Register')}>
            Register Now
          </Text>
        </Text>
      </View>
    </View>
  );
}

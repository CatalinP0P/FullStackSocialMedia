import {SERVER_ADRESS} from '@env';
import React, {useEffect, useState} from 'react';
import {Colors} from './color';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  AccessibilityInfo,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {styles} from './styles';
import {NavigationContainer} from '@react-navigation/native';

import AppNavigator from './navigators/AppNavigator';
import LoginNavigator from './navigators/loginNavigator';
import jwtDecode from 'jwt-decode';

export default function App() {
  const [token, setToken] = useState(null);
  const [pageLoaded, setPageLoaded] = useState(false);

  const getToken = async () => {
    const authToken = await AsyncStorage.getItem('authToken');
    if (authToken == null) return;
    setToken(authToken);
  };

  const updateToken = data => {
    setToken(data);
  };

  useEffect(() => {
    (async () => {
      await getToken();
      setPageLoaded(true);
    })();
  }, []);

  return !pageLoaded ? null : token !== null ? (
    <AppNavigator setToken={updateToken}></AppNavigator>
  ) : (
    <LoginNavigator setToken={updateToken}></LoginNavigator>
  );
}

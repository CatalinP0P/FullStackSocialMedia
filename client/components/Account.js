import React, {useEffect, useState} from 'react';
import {
  Button,
  Image,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  StyleSheet,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Images} from '../images';
import Svg, {Path} from 'react-native-svg';
import * as Auth from '../authServices';
import {matrixTransform} from 'react-native-svg/lib/typescript/elements/Shape';

export default function Account({route}) {
  const [image64, setImage64] = useState('');
  const [user, setUser] = useState();
  const [settingsModalVisibility, setSettingsModalVisibility] = useState(false);

  const showModal = () => {
    setSettingsModalVisibility(true);
  };

  const hideModel = () => {
    setSettingsModalVisibility(false);
  };

  const setToken = route.params.setToken;

  useEffect(() => {
    (async () => {
      const usr = await Auth.getLoggedUserAsync();
      console.log(usr);
      setUser(usr);
    })();
  }, []);

  const logout = async () => {
    setToken(null);
    await Auth.logOutAsync();
  };

  return (
    <SafeAreaView>
      <View
        style={{
          dispaly: 'flex',
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 8,
        }}>
        <View>
          <Text
            style={{
              fontSize: 28,
              fontWeight: 600,
              textTransform: 'lowercase',
              paddingLeft: 8,
            }}>
            {user?.username}
          </Text>
        </View>
        <View
          style={{margin: 8, dispaly: 'flex', flexDirection: 'row', gap: 16}}>
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            fill="black"
            className="bi bi-plus-square"
            viewBox="0 0 16 16">
            <Path
              d="M14 1a1 1 0 011 1v12a1 1 0 01-1 1H2a1 1 0 01-1-1V2a1 1 0 011-1h12zM2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z"
              transform="scale(1)"
            />
            <Path
              d="M8 4a.5.5 0 01.5.5v3h3a.5.5 0 010 1h-3v3a.5.5 0 01-1 0v-3h-3a.5.5 0 010-1h3v-3A.5.5 0 018 4z"
              transform="scale(1)"
            />
          </Svg>

          <Pressable onPress={showModal}>
            <Svg
              width="24"
              height="24"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              fill="none">
              <Path
                fill="#000"
                fillRule="evenodd"
                d="M19 4a1 1 0 01-1 1H2a1 1 0 010-2h16a1 1 0 011 1zm0 6a1 1 0 01-1 1H2a1 1 0 110-2h16a1 1 0 011 1zm-1 7a1 1 0 100-2H2a1 1 0 100 2h16z"
              />
            </Svg>
          </Pressable>
        </View>
      </View>

      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          marginTop: 8,
          paddingHorizontal: 8,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: 'rgb(200,200,200)',
        }}>
        <View style={{dispaly: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Image
            style={{width: 96, height: 96, borderRadius: 48}}
            source={{uri: 'data:image/png;base64,' + user?.image64}}></Image>

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
              <Text style={{fontWeight: 600}}>1</Text>
              <Text> Posts </Text>
            </View>

            <View
              style={{
                dispaly: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{fontWeight: 600}}>916</Text>
              <Text> Followers </Text>
            </View>

            <View
              style={{
                dispaly: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{fontWeight: 600}}>715</Text>
              <Text> Following </Text>
            </View>
          </View>
        </View>

        <View style={{dispaly: 'flex', flexDirection: 'row', gap: 32, marginTop: 24}}>
          <TouchableOpacity
            style={{backgroundColor: 'rgb(230,230,230)', width: '100%', paddingVertical: 8, paddingHorizontal: 24, borderRadius: 8}}>
            <Text style={{fontSize: 14, fontWeight: 600, width: '100%', textAlign: 'center'}} > Edit Profile </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        visible={settingsModalVisibility}
        transparent
        animationType="slide">
        <Pressable style={styles.upper} onPress={hideModel} />
        <SafeAreaView style={styles.lower}>
          <View style={{padding: 16}}>
            <Pressable onPress={logout}>
              <View
                style={{
                  dispaly: 'flex',
                  flexDirection: 'row',
                  gap: 24,
                  borderBottomWidth: 1,
                  paddingBottom: 16,
                  borderBottomColor: 'rgb(200,200,200)',
                }}>
                <Svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <Path
                    d="M8.9 7.56c.31-3.6 2.16-5.07 6.21-5.07h.13c4.47 0 6.26 1.79 6.26 6.26v6.52c0 4.47-1.79 6.26-6.26 6.26h-.13c-4.02 0-5.87-1.45-6.2-4.99M15 12H3.62M5.85 8.65L2.5 12l3.35 3.35"
                    stroke="#292D32"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
                <Text>Logout</Text>
              </View>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  upper: {
    flex: 1,
  },

  lower: {
    height: 250,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: 'rgb(220,220,220)',
    marginHorizontal: 4,
  },
});

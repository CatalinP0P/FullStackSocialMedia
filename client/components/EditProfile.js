import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { SERVER_ADRESS } from "@env";
import {
  Text,
  Image,
  View,
  Button,
  SafeAreaView,
  Dimensions,
  TextInput,
  StyleSheet,
} from 'react-native';
import * as Auth from '../authServices';
import {get} from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { launchImageLibrary } from 'react-native-image-picker';

export default function EditProfile({navigation, route}) {
  const [user, setUser] = useState();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [image64, setImage64] = useState('');

  const pickImage = async () => {
    launchImageLibrary({mediaType: 'photo', includeBase64: true}).then(response => {
      if ( response.didCancel || response.errorMessage )
        return;
  
      setImage64(response.assets[0].base64);
      console.log(response.assets[0].base64);
    });
  }

  const getUser = async () => {
    var usr = await Auth.getLoggedUserFromDBAsync();
    console.log(usr._id);
    const image = await Auth.getImage(usr._id);
    usr = {...usr, image64: image};
    setUser(usr);

    setName(usr.name);
    setEmail(usr.email.toLowerCase());
    setImage64(image);
    setUsername(usr.username.toLowerCase());
  };

  const handleSaveButton = async () => {
    const token = await Auth.getTokenAsync();
    const req = axios.create({
      headers: {
        authToken: "Bearer " + token
      }
    })

    req.post(SERVER_ADRESS + "auth/user/update", {username: username.toLowerCase(), email: email.toLowerCase(), image64: image64, name: name}).then(response => {
      console.log(response.data);
      navigation.goBack();
    }).catch(err => {
      console.log(err.response.data);
    })
  }

  navigation.setOptions({
    headerRight: () => {
      return (
        <Button 
        title='Save' onPress={handleSaveButton} ></Button>
      );
    }
  })

  useEffect(() => {
    getUser();
  }, []);
  return (
    <SafeAreaView>
      <View
        style={{
          padding: 8,
          borderBottomWidth: 1,
          borderBottomColor: 'rgb(200,200,200)',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
        }}>
        <Image
          style={{width: 100, height: 100, borderRadius: 50}}
          source={{uri: 'data:image/png;base64,' + image64}}></Image>

        <Button onPress={pickImage}  title={'Change Picture'}></Button>
      </View>

      <View style={{display: 'flex', flexDirection: 'column', marginTop: 8}}>
        <View
          style={styles.row}>
          <Text style={{fontSize: 20}}>Name</Text>
          <TextInput
            style={styles.textInput} value={name} onChangeText={e => setName(e)} ></TextInput>
        </View>

        <View
          style={styles.row}>
          <Text style={{fontSize: 20}}>Username</Text>
          <TextInput
            style={styles.textInput} value={username} onChangeText={e => setUsername(e)} ></TextInput>
        </View>

        <View
          style={styles.row}>
          <Text style={{fontSize: 20}}>Email</Text>
          <TextInput
            style={styles.textInput} value={email} onChangeText={e => setEmail(e)} ></TextInput>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textInput: {
    fontSize: 20,
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(200,200,200)',
    width: '70%',
  },

  row:{ 
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  }
});


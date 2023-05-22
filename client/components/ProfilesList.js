import React, {useEffect, useState, useSyncExternalStore} from 'react';
import {View, SafeAreaView, Text, Image, ScrollView} from 'react-native';

export default function ProfilesList({navigation, route}) {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    setProfiles(route.params.profiles);
    console.log(route.params.profiles[0].user[0].username);

  }, []);

  return (
    <SafeAreaView>
      <ScrollView style={{display: 'flex', height: '100%'}} >
        {profiles.map(profile => {
          return (
          <View style={{display: "flex", flexDirection: "row", gap: 16, marginHorizontal: 4, alignItems: "center", marginTop: 8}} >
            <Image style={{width: 64, height: 64, borderRadius: 32}} source={{uri: "data:image/png;base64," + profile.photo[0].image64}} ></Image>
            <Text style={{fontSize: 24}} >{profile.user[0].username}</Text>
          </View>
          )
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

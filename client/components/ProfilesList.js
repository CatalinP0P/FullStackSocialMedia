import React, {useEffect, useState, useSyncExternalStore} from 'react';
import {View, SafeAreaView, Text, Image, ScrollView} from 'react-native';

export default function ProfilesList({navigation, route}) {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    setProfiles(route.params.profiles);
  }, []);

  return (
    <SafeAreaView>
      <ScrollView style={{display: 'flex', height: '100%'}} >
        {profiles.map(profile => {
          return (
          <View style={{display: "flex", flexDirection: "row", gap: 16, marginHorizontal: 4, alignItems: "center", marginTop: 8}} >
            <Image style={{width: 64, height: 64, borderRadius: 32}} source={{uri: "data:image/png;base64," + profile.image64}} ></Image>
            <Text style={{fontSize: 24}} >{profile.username}</Text>
          </View>
          )
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

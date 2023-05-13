import AsyncStorage from "@react-native-async-storage/async-storage";
import { SERVER_ADRESS } from "@env";
import jwtDecode from "jwt-decode";
import axios from "axios";

export const getLoggedUserAsync = async () => {
    const token = await AsyncStorage.getItem('authToken')
    const user = jwtDecode(token);
    return user;
};

export const logOutAsync = async () => {
    await AsyncStorage.removeItem('authToken');
}

export const getTokenAsync = async () => {
    const token = await AsyncStorage.getItem('authToken');
    return token;
}

export const getProfilePictureAsync = async () => {
    const user = await getLoggedUserAsync();
    return user._id;
}

export const getUsername = async (id) => {
    const token = await getTokenAsync();
    const req = axios.create({
        headers: {
            authToken: "Bearer " + token,
        }
    })

    const response = await req.get(SERVER_ADRESS + "auth/user/" + id);
    return response.data;
}

export const getImage = async (id) =>{
    const token = await getTokenAsync();
    const req = axios.create({
        headers: {
            authToken: "Bearer " + token,
        }
    })

    const response = await req.get(SERVER_ADRESS + "profilephotos/" + id)
    return response.data;
}
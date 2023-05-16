import AsyncStorage from "@react-native-async-storage/async-storage";
import { SERVER_ADRESS } from "@env";
import jwtDecode from "jwt-decode";
import axios from "axios";

export const getLoggedUserAsync = async () => {
    const token = await AsyncStorage.getItem('authToken')
    const user = jwtDecode(token);
    return user;
};

export const getLoggedUserFromDBAsync = async () => {
    const req = axios.create({
        headers: {
            authToken: "Bearer " + await getTokenAsync(),
        }
    })

    try{
        var response = await req.get(SERVER_ADRESS + "auth/user");
        return response.data;
    }
    catch(err)
    {
        return "error";
    }
}

export const logOutAsync = async () => {
    await AsyncStorage.removeItem('authToken');
}

export const getTokenAsync = async () => {
    const token = await AsyncStorage.getItem('authToken');
    return token;
}

export const getUserById = async (id) => {
    const token = await getTokenAsync();
    const req = axios.create({
        headers: {
            authToken: "Bearer " + token,
        }
    })

    const response = await req.get(SERVER_ADRESS + "auth/user/" + id);
    return response.data;
}

export const getUsername = async (id) => {
    const user = await getUserById(id);
    return user.username;
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
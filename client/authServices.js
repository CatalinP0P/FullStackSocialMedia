import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";

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
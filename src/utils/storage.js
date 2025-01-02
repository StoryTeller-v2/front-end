import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode as atob } from 'base-64';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';
const USER_ID_KEY = 'userId';

export const storeTokens = async (accessToken, refreshToken) => {
    try {
        await AsyncStorage.multiSet([
            [ACCESS_TOKEN_KEY, accessToken],
            [REFRESH_TOKEN_KEY, refreshToken],
        ]);
    } catch (e) {
        console.error('Error storing tokens:', e);
    }
};

export const storeUser = async (user) => {
    try {
        await AsyncStorage.setItem(USER_KEY, user);
    } catch (e) {
        console.error('Error storing user:', e);
    }
};

export const storeUserId = async (userId) => {
    try {
        await AsyncStorage.setItem(USER_ID_KEY, userId.toString());
    } catch (e) {
        console.error('Error storing userId:', e);
    }
};

export const getAccessToken = async () => {
    try {
        const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
        return token;
    } catch (e) {
        console.error('Error getting access token:', e);
    }
};

export const getRefreshToken = async () => {
    try {
        const token = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
        return token;
    } catch (e) {
        console.error('Error getting refresh token:', e);
    }
};

export const getUser = async () => {
    try {
        const user = await AsyncStorage.getItem(USER_KEY);
        return user;
    } catch (e) {
        console.error('Error getting user:', e);
    }
};

export const getUserId = async () => {
    try {
        const userId = await AsyncStorage.getItem(USER_ID_KEY);
        return userId ? parseInt(userId, 10) : null;
    } catch (e) {
        console.error('Error getting userId:', e);
        return null;
    }
};

export const removeTokens = async () => {
    try {
        await AsyncStorage.multiRemove([
            ACCESS_TOKEN_KEY,
            REFRESH_TOKEN_KEY,
            USER_KEY,
            USER_ID_KEY,
        ]);
    } catch (e) {
        console.error('Error removing tokens:', e);
    }
};

export const decodeBase64 = (input) => {
    return atob(input);
};

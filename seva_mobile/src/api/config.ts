import { Platform } from 'react-native';

const ENV = {
    dev: {
        ios: 'http://192.168.29.106:8080/api', // Local Network IP for iOS
        android: 'http://10.0.2.2:8080/api', // Android Emulator
    },
    prod: {
        url: 'https://api.sevamatha.com/api', // Placeholder for production URL
    }
};

const getBaseUrl = () => {
    if (__DEV__) {
        return Platform.select({
            ios: ENV.dev.ios,
            android: ENV.dev.android,
        }) || ENV.dev.android;
    }
    return ENV.prod.url;
};

export const API_URL = getBaseUrl();

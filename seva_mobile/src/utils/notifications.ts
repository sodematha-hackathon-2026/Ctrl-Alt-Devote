import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

export async function registerForPushNotificationsAsync() {
    // Check if we are in Expo Go
    const isExpoGo = Constants.appOwnership === 'expo';

    if (Platform.OS === 'android') {
        try {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        } catch (error) {
            console.warn('Error setting notification channel:', error);
        }
    }

    if (isExpoGo && Platform.OS === 'android') {
        console.warn('Remote notifications are not supported in Expo Go on Android (SDK 53+). Skipping registration.');
        return;
    }

    try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('Failed to get push token for push notification!');
            return;
        }
    } catch (error) {
        console.warn('Error requesting notification permissions:', error);
    }
}

export async function scheduleNotification(title: string, body: string, seconds: number = 1, data?: any) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            sound: true,
            data: data || {},
        },
        trigger: {
            seconds,
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        },
    });
}

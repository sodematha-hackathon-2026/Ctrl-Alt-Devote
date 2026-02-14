import React from 'react';
import '../i18n';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import TabNavigator from './TabNavigator';
import ContactUsScreen from '../screens/ContactUsScreen';
import RoomBookingScreen from '../screens/RoomBookingScreen';
import GuruDetailScreen from '../screens/GuruDetailScreen';
import LandingScreen from '../screens/LandingScreen';
import LoginScreen from '../screens/LoginScreen';
import OTPScreen from '../screens/OTPScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import TermsConditionsScreen from '../screens/TermsConditionsScreen';
import VrindavanaMapScreen from '../screens/VrindavanaMapScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
    const { user, isLoading } = useAuthStore();
    const [initialLoadComplete, setInitialLoadComplete] = React.useState(false);

    React.useEffect(() => {
        // Only show loading spinner on the very first load
        if (!isLoading && !initialLoadComplete) {
            setInitialLoadComplete(true);
        }
    }, [user, isLoading, initialLoadComplete]);

    // Only show loading spinner on initial app load, not during auth operations
    if (!initialLoadComplete && isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="Landing"
        >
            {/* Auth Screens */}
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="OTP" component={OTPScreen} />

            {/* Authenticated Screens */}
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="ContactUs" component={ContactUsScreen} />
            <Stack.Screen name="RoomBooking" component={RoomBookingScreen} />
            <Stack.Screen name="GuruDetail" component={GuruDetailScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
            <Stack.Screen name="TermsConditions" component={TermsConditionsScreen} />
            <Stack.Screen name="VrindavanaMap" component={VrindavanaMapScreen} />
        </Stack.Navigator>
    );
};

export default RootNavigator;

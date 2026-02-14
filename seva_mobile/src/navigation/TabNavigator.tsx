import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, User, BookOpen, MapPin, HandHeart, Calendar } from 'lucide-react-native';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import HomeScreen from '../screens/HomeScreen';
import ParamparaScreen from '../screens/ParamparaScreen';
import BookingScreen from '../screens/BookingScreen';
import ContactUsScreen from '../screens/ContactUsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import VolunteersScreen from '../screens/VolunteersScreen';
import { useAuthStore } from '../store/authStore';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    const theme = useTheme();
    const { t } = useTranslation();
    const { user } = useAuthStore();

    return (
        <View style={styles.container}>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: theme.colors.elevation.level2,
                        borderTopColor: theme.colors.outlineVariant,
                    },
                    tabBarActiveTintColor: theme.colors.primary,
                    tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
                }}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        tabBarLabel: t('tabs.home'),
                        tabBarIcon: ({ color, size }) => (
                            <Home color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Parampara"
                    component={ParamparaScreen}
                    options={{
                        tabBarLabel: t('tabs.parampara'),
                        tabBarIcon: ({ color, size }) => (
                            <BookOpen color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Booking"
                    component={BookingScreen}
                    options={{
                        tabBarLabel: t('tabs.bookings'),
                        tabBarIcon: ({ color, size }) => (
                            <Calendar color={color} size={size} />
                        ),
                    }}
                />
                {user?.isVolunteer && (
                    <Tab.Screen
                        name="Volunteers"
                        component={VolunteersScreen}
                        options={{
                            tabBarLabel: t('tabs.seva'),
                            tabBarIcon: ({ color, size }) => (
                                <HandHeart color={color} size={size} />
                            ),
                        }}
                    />
                )}

                <Tab.Screen
                    name="Contact"
                    component={ContactUsScreen}
                    options={{
                        tabBarLabel: t('tabs.contact'),
                        tabBarIcon: ({ color, size }) => (
                            <MapPin color={color} size={size} />
                        ),
                    }}
                />

                <Tab.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                        tabBarLabel: t('tabs.profile'),
                        tabBarIcon: ({ color, size }) => (
                            <User color={color} size={size} />
                        ),
                    }}
                />
            </Tab.Navigator>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default TabNavigator;

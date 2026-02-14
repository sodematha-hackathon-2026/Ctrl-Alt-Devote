import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import SevaScreen from './SevaScreen';
import RoomBookingScreen from './RoomBookingScreen';

const BookingScreen = () => {
    const theme = useTheme();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'sevas' | 'rooms'>('sevas');

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            <View style={styles.header}>
                <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
                    {t('bookings.title')}
                </Text>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === 'sevas' && { borderBottomColor: theme.colors.primary, borderBottomWidth: 2 }
                    ]}
                    onPress={() => setActiveTab('sevas')}
                >
                    <Text
                        variant="titleMedium"
                        style={[
                            styles.tabText,
                            activeTab === 'sevas' ? { color: theme.colors.primary, fontWeight: 'bold' } : { color: theme.colors.onSurfaceVariant }
                        ]}
                    >
                        {t('bookings.sevas')}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === 'rooms' && { borderBottomColor: theme.colors.primary, borderBottomWidth: 2 }
                    ]}
                    onPress={() => setActiveTab('rooms')}
                >
                    <Text
                        variant="titleMedium"
                        style={[
                            styles.tabText,
                            activeTab === 'rooms' ? { color: theme.colors.primary, fontWeight: 'bold' } : { color: theme.colors.onSurfaceVariant }
                        ]}
                    >
                        {t('bookings.rooms')}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {activeTab === 'sevas' ? <SevaScreen /> : <RoomBookingScreen />}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 16,
        paddingBottom: 8,
    },
    title: {
        fontWeight: 'bold',
    },
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabText: {
        textAlign: 'center',
    },
    content: {
        flex: 1,
    }
});

export default BookingScreen;

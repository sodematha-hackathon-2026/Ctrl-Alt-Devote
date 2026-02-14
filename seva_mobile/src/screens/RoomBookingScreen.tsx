import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform, Alert, Pressable } from 'react-native';
import { Text, Button, Card, Checkbox, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from 'react-i18next';
import { Calendar, CheckCircle, AlertCircle } from 'lucide-react-native';
import { API_URL } from '../api/config';

import { saveFile } from '../utils/storagePermissions';

const RoomBookingScreen = () => {
    const { getToken, user } = useAuthStore();
    const navigation = useNavigation<any>();
    const theme = useTheme();
    const { t } = useTranslation();

    const [checkInDate, setCheckInDate] = useState(new Date());
    const [checkOutDate, setCheckOutDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));

    // Date picker visibility
    const [showCheckInPicker, setShowCheckInPicker] = useState(false);
    const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);

    const [numberOfPeople, setNumberOfPeople] = useState('1');
    const [numberOfRooms, setNumberOfRooms] = useState('1');

    const [consent, setConsent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [referenceId, setReferenceId] = useState<string | null>(null);

    if (!user) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={[styles.centerContainer, { paddingTop: 40 }]}>
                    <Text variant="headlineMedium" style={[styles.headerTitle, { color: theme.colors.primary, textAlign: 'center' }]}>
                        {t('bookings.loginRequired')}
                    </Text>
                    <Text variant="bodyLarge" style={{ textAlign: 'center', marginBottom: 20, color: theme.colors.onSurfaceVariant }}>
                        {t('bookings.loginToBookRooms')}
                    </Text>
                    <Button
                        mode="contained"
                        onPress={() => navigation.navigate('Login')}
                        style={styles.button}
                    >
                        {t('bookings.loginSignup')}
                    </Button>
                </View>
            </SafeAreaView>
        );
    }

    const onCheckInChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || checkInDate;
        setShowCheckInPicker(Platform.OS === 'ios');
        setCheckInDate(currentDate);
        // Ensure checkout is at least one day after checkin
        if (checkOutDate <= currentDate) {
            const nextDay = new Date(currentDate);
            nextDay.setDate(currentDate.getDate() + 1);
            setCheckOutDate(nextDay);
        }
    };

    const onCheckOutChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || checkOutDate;
        setShowCheckOutPicker(Platform.OS === 'ios');
        if (currentDate > checkInDate) {
            setCheckOutDate(currentDate);
        } else {
            // Alert.alert("Invalid Date", "Check-out date must be after check-in date.");
            console.warn("Invalid Date: Check-out must be after check-in.");
        }
    };

    const handleSubmit = async () => {
        if (!consent) {
            // Alert.alert("Permission Required", "Please agree to data storage and processing to proceed.");
            console.warn("Permission Required: Data storage consent needed.");
            return;
        }
        if (!numberOfPeople || parseInt(numberOfPeople) <= 0) {
            // Alert.alert("Invalid Input", "Please enter a valid number of people.");
            console.warn("Invalid Input: Guests count.");
            return;
        }
        if (!numberOfRooms || parseInt(numberOfRooms) <= 0) {
            // Alert.alert("Invalid Input", "Please enter a valid number of rooms.");
            console.warn("Invalid Input: Rooms count.");
            return;
        }

        if (!user?.email) {
            if (!user?.email) {
                // Alert.alert("Email Required", ...);
                console.warn("Email Required: Redirecting to EditProfile.");
                navigation.navigate('EditProfile');
                return;
            }
            return;
        }

        setLoading(true);
        try {
            // Ensure token is fresh
            let token = await getToken();
            if (!token) {
                // Try one more time to reload user in case
                await useAuthStore.getState().loadUser();
                token = await getToken();
                if (!token) throw new Error("User not authenticated");
            }

            // Ensure User Exists in DB (for new users who haven't updated profile)
            if (!user.id) {
                try {
                    await useAuthStore.getState().updateProfile({});
                } catch (e) {
                    console.warn("Failed to ensure user existence:", e);
                    // Proceeding might fail if backend enforces FK, but we try.
                }
            }

            const response = await fetch(`${API_URL}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    checkInDate: checkInDate.toISOString().split('T')[0],
                    checkOutDate: checkOutDate.toISOString().split('T')[0],
                    numberOfGuests: parseInt(numberOfPeople),
                    numberOfRooms: parseInt(numberOfRooms),
                    consentDataStorage: consent
                })
            });

            // Check if response has content before parsing
            const contentType = response.headers.get('content-type');
            const hasJsonContent = contentType && contentType.includes('application/json');

            if (!response.ok) {
                let errorMessage = 'Booking failed';
                if (hasJsonContent) {
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.message || errorMessage;
                    } catch (e) {
                        // If JSON parsing fails, use default message
                    }
                }
                throw new Error(errorMessage);
            }

            // Parse response only if it has JSON content
            let data;
            if (hasJsonContent) {
                const text = await response.text();
                if (text && text.trim().length > 0) {
                    data = JSON.parse(text);
                } else {
                    // Empty response, create a mock reference ID
                    data = { referenceId: `BK${Date.now()}` };
                }
            } else {
                // No JSON content, create a mock reference ID
                data = { referenceId: `BK${Date.now()}` };
            }

            setReferenceId(data.referenceId);

        } catch (error: any) {
            console.error('Booking error:', error);
            // Alert.alert("Error", error.message || "Failed to submit booking request.");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveReceipt = async () => {
        if (!referenceId) return;

        const fileName = `Booking_${referenceId}.txt`;
        const content = `
Sode Vadiraja Matha - Rajadhama Room Booking Receipt
------------------------------------------
Reference ID: ${referenceId}
Date: ${new Date().toLocaleDateString()}
Check-In: ${checkInDate.toLocaleDateString()}
Check-Out: ${checkOutDate.toLocaleDateString()}
Rooms: ${numberOfRooms}
People: ${numberOfPeople}
Status: Request Received
        
Please keep this reference ID for future correspondence.
        `;

        try {
            await saveFile(fileName, content);
            await saveFile(fileName, content);
            // Alert.alert("Success", "Receipt saved successfully!");
            console.log("Success: Receipt saved.");
        } catch (error) {
            // Error is already logged in saveFile, and permission denial handled
            if (error instanceof Error && error.message === 'Storage permission denied') {
                // Alert.alert("Permission Denied", "Storage permission is required to save the receipt.");
                console.warn("Storage permission denied");
            }
        }
    };

    if (referenceId) {
        return (
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={[styles.successContainer, { backgroundColor: theme.colors.surface }]}>
                    <CheckCircle size={64} color={theme.colors.primary} />
                    <Text variant="headlineMedium" style={[styles.successTitle, { color: theme.colors.primary }]}>
                        {t('rooms.submissionSuccessful')}
                    </Text>
                    <Text variant="bodyLarge" style={styles.successText}>
                        {t('rooms.requestReceived')}
                    </Text>
                    <Card style={styles.refCard}>
                        <Card.Content>
                            <Text variant="titleMedium" style={{ textAlign: 'center' }}>Reference ID</Text>
                            <Text variant="headlineSmall" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                {referenceId}
                            </Text>
                        </Card.Content>
                    </Card>
                    <Text variant="bodyMedium" style={{ textAlign: 'center', marginTop: 20 }}>
                        {t('rooms.adminEmailSent')}
                    </Text>

                    <Button
                        mode="outlined"
                        onPress={handleSaveReceipt}
                        style={{ marginTop: 20, width: '100%' }}
                        icon="download"
                    >
                        {t('sevas.saveReceipt')}
                    </Button>

                    <Button
                        mode="contained"
                        onPress={() => navigation.goBack()}
                        style={styles.homeButton}
                    >
                        {t('rooms.returnToProfile')}
                    </Button>
                </View>
            </ScrollView>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
                {t('rooms.bookRoom')}
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
                {t('rooms.subtitle')}
            </Text>

            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.inputGroup}>
                        <Text variant="titleMedium" style={{ marginBottom: 8 }}>{t('rooms.checkIn')}</Text>
                        <Pressable onPress={() => setShowCheckInPicker(true)}>
                            <View pointerEvents="none">
                                <TextInput
                                    value={checkInDate.toLocaleDateString()}
                                    mode="outlined"
                                    style={{ backgroundColor: theme.colors.surface }}
                                    right={<TextInput.Icon icon="calendar" />}
                                    editable={false}
                                />
                            </View>
                        </Pressable>
                        {showCheckInPicker && (
                            <DateTimePicker
                                value={checkInDate}
                                mode="date"
                                display="default"
                                onChange={onCheckInChange}
                                minimumDate={new Date()}
                            />
                        )}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text variant="titleMedium" style={{ marginBottom: 8 }}>{t('rooms.checkOut')}</Text>
                        <Pressable onPress={() => setShowCheckOutPicker(true)}>
                            <View pointerEvents="none">
                                <TextInput
                                    value={checkOutDate.toLocaleDateString()}
                                    mode="outlined"
                                    style={{ backgroundColor: theme.colors.surface }}
                                    right={<TextInput.Icon icon="calendar" />}
                                    editable={false}
                                />
                            </View>
                        </Pressable>
                        {showCheckOutPicker && (
                            <DateTimePicker
                                value={checkOutDate}
                                mode="date"
                                display="default"
                                onChange={onCheckOutChange}
                                minimumDate={new Date()}
                            />
                        )}
                    </View>

                    <TextInput
                        label={t('rooms.people')}
                        value={numberOfPeople}
                        onChangeText={setNumberOfPeople}
                        mode="outlined"
                        keyboardType="numeric"
                        style={[styles.inputGroup, { backgroundColor: theme.colors.surface }]}
                    />

                    <TextInput
                        label={t('rooms.rooms')}
                        value={numberOfRooms}
                        onChangeText={setNumberOfRooms}
                        mode="outlined"
                        keyboardType="numeric"
                        style={[styles.inputGroup, { backgroundColor: theme.colors.surface }]}
                    />

                    <View style={styles.checkboxContainer}>
                        <View style={Platform.OS === 'ios' ? [styles.checkboxWrapper, { borderColor: 'black' }] : undefined}>
                            <Checkbox
                                status={consent ? 'checked' : 'unchecked'}
                                onPress={() => setConsent(!consent)}
                                color={theme.colors.primary}
                                uncheckedColor={Platform.OS === 'ios' ? 'transparent' : 'black'}
                            />
                        </View>
                        <Text style={styles.checkboxLabel} onPress={() => setConsent(!consent)}>
                            {t('rooms.consent')}
                        </Text>
                    </View>

                    <View style={styles.infoBox}>
                        <AlertCircle size={20} color={theme.colors.secondary} />
                        <Text style={[styles.infoText, { color: theme.colors.secondary }]}>
                            {t('rooms.info')}
                        </Text>
                    </View>

                    <Button
                        mode="contained"
                        onPress={handleSubmit}
                        loading={loading}
                        disabled={loading || !consent}
                        style={styles.submitButton}
                    >
                        {t('rooms.submit')}
                    </Button>
                </Card.Content>
            </Card>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        marginBottom: 20,
        color: '#666',
    },
    card: {
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkboxWrapper: {
        borderWidth: 2,
        borderRadius: 4,
        marginRight: 4,
    },
    checkboxLabel: {
        flex: 1,
        marginLeft: 8,
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e6f7ff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
    },
    infoText: {
        marginLeft: 10,
        flex: 1,
        fontSize: 12,
    },
    submitButton: {
        marginTop: 10,
    },
    successContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        margin: 20,
        borderRadius: 20,
    },
    successTitle: {
        marginTop: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    successText: {
        marginTop: 10,
        textAlign: 'center',
        marginBottom: 30,
    },
    refCard: {
        width: '100%',
        padding: 10,
        backgroundColor: '#f0f0f0',
    },
    homeButton: {
        marginTop: 40,
        width: '100%',
    },
    button: {
        borderRadius: 24,
        paddingVertical: 4,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    headerTitle: {
        fontFamily: 'PlusJakartaSans-SemiBold',
        marginBottom: 16,
        fontWeight: 'bold',
    }
});

export default RoomBookingScreen;

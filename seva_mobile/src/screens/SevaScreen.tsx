import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Platform, Pressable, Alert, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, useTheme, Card, ActivityIndicator, IconButton, RadioButton, Checkbox } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuthStore } from '../store/authStore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { sevaService, Seva } from '../api/sevaService';
import { saveFile } from '../utils/storagePermissions';
import { CheckCircle, AlertCircle, Calendar } from 'lucide-react-native';
import RazorpayCheckout from 'react-native-razorpay';
import { API_URL } from '../api/config';

const SevaScreen = () => {
    const theme = useTheme();
    const { user, getToken } = useAuthStore();
    const navigation = useNavigation<any>();
    const { t, i18n } = useTranslation();

    const [sevas, setSevas] = useState<Seva[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSeva, setSelectedSeva] = useState<Seva | null>(null);

    // Form fields
    const [devoteeName, setDevoteeName] = useState('');
    const [gothra, setGothra] = useState('');
    const [nakshatra, setNakshatra] = useState('');
    const [rashi, setRashi] = useState('');
    const [sevaDate, setSevaDate] = useState(new Date());
    const [amount, setAmount] = useState(''); // Used for receipt

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // New Features from Remote
    const [deliveryMode, setDeliveryMode] = useState<'IN_PERSON' | 'POST'>('IN_PERSON');
    const [consent, setConsent] = useState(false);
    const [referenceId, setReferenceId] = useState<string | null>(null);

    useEffect(() => {
        loadSevas();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            loadSevas();
        }, [])
    );

    const loadSevas = async () => {
        setLoading(true);
        try {
            const data = await sevaService.getAllSevas();
            // Filter active sevas if needed, or just show all
            setSevas(data);
        } catch (error) {
            console.error('Failed to load sevas', error);
            // Alert.alert('Error', 'Failed to load Sevas. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSevaSelect = (seva: Seva) => {
        setSelectedSeva(seva);
        setAmount(seva.amount.toString());
        setDevoteeName(user?.fullName || '');
        setGothra(user?.gothra || '');
        setNakshatra(user?.nakshatra || '');
        setRashi(user?.rashi || '');
    };

    const handleBack = () => {
        setSelectedSeva(null);
        setReferenceId(null);
        // Reset form
        setGothra('');
        setNakshatra('');
        setRashi('');
        setSevaDate(new Date());
        setConsent(false);
        setDeliveryMode('IN_PERSON');
    };

    const onChangeDate = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || sevaDate;
        setShowDatePicker(Platform.OS === 'ios');
        setSevaDate(currentDate);
    };

    const handlePayment = async () => {
        if (!user || !selectedSeva) return;
        if (!devoteeName || !gothra || !nakshatra || !rashi) {
            // Alert.alert('Missing Fields', 'Please fill all the details.');
            console.warn('Missing Fields: Please fill all the details.');
            return;
        }
        if (!consent) {
            // Alert.alert("Permission Required", "Please agree to data storage and processing to proceed.");
            console.warn("Permission Required: Please agree to data storage.");
            return;
        }

        setSubmitting(true);
        try {
            const token = await getToken();
            if (!token) throw new Error("No token found");

            // --- Auto-Update Profile Section ---
            const { updateProfile } = useAuthStore.getState();
            let currentUser = user;
            const updates: any = {};

            // Update fields if they are missing in the profile but present in the form
            if (!currentUser.gothra && gothra) updates.gothra = gothra;
            if (!currentUser.nakshatra && nakshatra) updates.nakshatra = nakshatra;
            if (!currentUser.rashi && rashi) updates.rashi = rashi;
            // Only update name if profile name is empty (to avoid overwriting if booking for someone else, though rare case for self-booking flow)
            if (!currentUser.fullName && devoteeName) updates.fullName = devoteeName;

            // If user ID is missing (new user) OR we have profile updates to save
            if (!currentUser.id || Object.keys(updates).length > 0) {
                try {
                    console.log("Auto-updating profile with:", updates);
                    // This will update the backend and the local store
                    await updateProfile(updates);
                    // Refresh current user from store to get the new ID and fields
                    const freshUser = useAuthStore.getState().user;
                    if (freshUser) {
                        currentUser = freshUser;
                    }
                } catch (updateErr) {
                    console.error("Failed to auto-update profile:", updateErr);
                    // Decide whether to block or proceed. 
                    // If user.id is missing, we MUST block because booking needs ID.
                    if (!currentUser.id) {
                        throw new Error("Failed to register user profile. Please update profile manually.");
                    }
                    // If just fields failed, maybe we can still proceed (though backend might want them).
                    // Let's proceed but warn? or just proceed.
                }
            }

            if (!currentUser.id) throw new Error("User ID not found even after update.");
            // -----------------------------------

            // 1. Initiate Booking
            const bookingResponse = await sevaService.initiateSevaBooking({
                seva: { id: selectedSeva.id },
                sevaDate: sevaDate.toISOString(),
                devoteeName,
                devoteeGothra: gothra,
                devoteeNakshatra: nakshatra,
                devoteeRashi: rashi,
                amountPaid: selectedSeva.amount,
                prasadaDeliveryMode: deliveryMode
            }, token, currentUser.id);

            const { id: bookingId, razorpayOrderId, amountPaid, user: bookingUser } = bookingResponse;

            if (!bookingId || !amountPaid) {
                console.error("Invalid booking response:", bookingResponse);
                throw new Error("Invalid booking response from server.");
            }

            const razorpayKey = 'rzp_test_SAqscm8ZZgbNXp'; // Should ideally come from backend config or env
            const amountInPaise = Math.floor(Number(amountPaid) * 100);

            if (isNaN(amountInPaise)) {
                throw new Error("Invalid payment amount.");
            }

            // 2. Open Razorpay Checkout
            const options = {
                description: `Seva: ${i18n.language === 'kn' && selectedSeva.titleKannada ? selectedSeva.titleKannada : selectedSeva.titleEnglish}`,
                image: 'https://sode-matha-artefacts.s3.ap-south-1.amazonaws.com/logo.png', // Optional
                currency: 'INR',
                key: razorpayKey,
                amount: amountInPaise,
                name: 'Sode Matha',
                order_id: razorpayOrderId,
                prefill: {
                    email: bookingUser?.email || currentUser.email || '',
                    contact: bookingUser?.phoneNumber || currentUser.phoneNumber || '',
                    name: bookingUser?.fullName || currentUser.fullName || ''
                },
                theme: { color: theme.colors.primary }
            };

            RazorpayCheckout.open(options).then(async (data: any) => {
                // handle success
                // data.razorpay_payment_id
                // data.razorpay_order_id
                // data.razorpay_signature

                try {
                    // 3. Complete Booking
                    const completionResponse = await sevaService.completeSevaBooking(
                        bookingId,
                        data.razorpay_payment_id,
                        data.razorpay_signature,
                        token
                    );

                    const refId = completionResponse.razorpayPaymentId || `SEVA-${Date.now()}`;
                    setReferenceId(refId);
                    // Success View is rendered automatically due to referenceId state
                } catch (err: any) {
                    // Alert.alert('Payment Verification Failed', err.message);
                    console.error('Payment Verification Failed', err.message);
                }
            }).catch((error: any) => {
                // handle failure
                console.log('Payment Error', error);
                // Alert.alert('Payment Failed', error.description || 'Payment was cancelled or failed.');
            });

        } catch (error: any) {
            console.error('Booking Initiation failed', error);
            // Alert.alert('Booking Failed', error.message || 'Something went wrong.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSaveReceipt = async () => {
        if (!referenceId || !selectedSeva) return;

        const fileName = `Seva_Receipt_${referenceId}.txt`;
        const content = `
Sode Vadiraja Matha - Seva Booking Receipt
------------------------------------------
Reference ID: ${referenceId}
Date: ${new Date().toLocaleDateString()}
Seva: ${i18n.language === 'kn' && selectedSeva.titleKannada ? selectedSeva.titleKannada : selectedSeva.titleEnglish}
Amount: ₹${selectedSeva.amount}
Devotee: ${devoteeName}
Date of Seva: ${sevaDate.toLocaleDateString()}
Delivery Mode: ${deliveryMode === 'POST' ? 'By Post' : 'In Person'}

Status: Request Received
        
Please keep this reference ID for future correspondence.
        `;

        try {
            await saveFile(fileName, content);
            Alert.alert("Success", "Receipt saved successfully!");
        } catch (error) {
            if (error instanceof Error && error.message === 'Storage permission denied') {
                // Alert.alert("Permission Denied", "Storage permission is required to save the receipt.");
                console.warn("Permission Denied: Storage permission is required.");
            } else {
                // Alert.alert("Error", "Failed to save receipt.");
                console.error("Error: Failed to save receipt.");
            }
        }
    };

    if (!user) {
        return (
            <View style={[styles.centerContainer, { paddingTop: 40 }]}>
                <Text variant="headlineMedium" style={[styles.headerTitle, { color: theme.colors.primary, textAlign: 'center' }]}>
                    {t('bookings.loginRequired')}
                </Text>
                <Text variant="bodyLarge" style={{ textAlign: 'center', marginBottom: 20, color: theme.colors.onSurfaceVariant }}>
                    {t('bookings.loginToBookSevas')}
                </Text>
                <Button
                    mode="contained"
                    onPress={() => navigation.navigate('Login')}
                    style={styles.button}
                >
                    {t('bookings.loginSignup')}
                </Button>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    // Success View
    if (referenceId && selectedSeva) {
        return (
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={[styles.successContainer, { backgroundColor: theme.colors.surface }]}>
                    <CheckCircle size={64} color={theme.colors.primary} />
                    <Text variant="headlineMedium" style={[styles.successTitle, { color: theme.colors.primary }]}>
                        {t('sevas.bookingSuccessful')}
                    </Text>
                    <Text variant="bodyLarge" style={styles.successText}>
                        {t('sevas.bookingReceived')}
                    </Text>
                    <Card style={styles.refCard}>
                        <Card.Content>
                            <Text variant="titleMedium" style={{ textAlign: 'center' }}>{t('sevas.referenceId')}</Text>
                            <Text variant="headlineSmall" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                {referenceId}
                            </Text>
                        </Card.Content>
                    </Card>
                    <Text variant="bodyMedium" style={{ textAlign: 'center', marginTop: 20 }}>
                        {deliveryMode === 'POST' ? t('sevas.prasadaByPost') : t('sevas.prasadaCollectInPerson')}.
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
                        onPress={handleBack}
                        style={styles.homeButton}
                    >
                        {t('sevas.bookAnother')}
                    </Button>
                </View>
            </ScrollView>
        );
    }

    // Booking Form View
    if (selectedSeva) {
        return (
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={styles.headerRow}>
                    <IconButton icon="arrow-left" onPress={handleBack} iconColor={theme.colors.primary} />
                    <Text variant="titleLarge" style={{ flex: 1, color: theme.colors.primary, fontWeight: 'bold' }}>
                        {t('sevas.bookSeva', { title: i18n.language === 'kn' && selectedSeva.titleKannada ? selectedSeva.titleKannada : selectedSeva.titleEnglish })}
                    </Text>
                </View>

                <Card style={[styles.card, { marginBottom: 20 }]}>
                    <Card.Content>
                        <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{t('sevas.details')}</Text>
                        <Text variant="bodyMedium">{selectedSeva.description}</Text>
                        <Text variant="headlineSmall" style={{ marginTop: 8, color: theme.colors.primary, fontWeight: 'bold' }}>
                            ₹{selectedSeva.amount}
                        </Text>
                    </Card.Content>
                </Card>

                <View style={styles.form}>
                    <Pressable onPress={() => setShowDatePicker(true)}>
                        <View pointerEvents="none">
                            <TextInput
                                label={t('sevas.sevaDate')}
                                value={sevaDate.toLocaleDateString()}
                                mode="outlined"
                                style={[styles.input, { backgroundColor: theme.colors.surface }]}
                                outlineStyle={{ borderRadius: 12 }}
                                right={<TextInput.Icon icon={() => <Calendar size={20} />} />}
                                editable={false}
                            />
                        </View>
                    </Pressable>

                    {showDatePicker && (
                        <DateTimePicker
                            value={sevaDate}
                            mode="date"
                            display="default"
                            onChange={onChangeDate}
                            minimumDate={new Date()}
                        />
                    )}

                    <TextInput
                        label={t('sevas.devoteeName')}
                        value={devoteeName}
                        onChangeText={setDevoteeName}
                        mode="outlined"
                        style={[styles.input, { backgroundColor: theme.colors.surface }]}
                        outlineStyle={{ borderRadius: 12 }}
                    />

                    <TextInput
                        label={t('sevas.gothra')}
                        value={gothra}
                        onChangeText={setGothra}
                        mode="outlined"
                        style={[styles.input, { backgroundColor: theme.colors.surface }]}
                        outlineStyle={{ borderRadius: 12 }}
                    />

                    <TextInput
                        label={t('sevas.nakshatra')}
                        value={nakshatra}
                        onChangeText={setNakshatra}
                        mode="outlined"
                        style={[styles.input, { backgroundColor: theme.colors.surface }]}
                        outlineStyle={{ borderRadius: 12 }}
                    />

                    <TextInput
                        label={t('sevas.rashi')}
                        value={rashi}
                        onChangeText={setRashi}
                        mode="outlined"
                        style={[styles.input, { backgroundColor: theme.colors.surface }]}
                        outlineStyle={{ borderRadius: 12 }}
                    />

                    {/* Delivery Mode */}
                    <View style={styles.radioGroup}>
                        <Text variant="titleMedium" style={{ marginBottom: 8 }}>{t('sevas.prasadaDelivery')}</Text>
                        <RadioButton.Group onValueChange={value => setDeliveryMode(value as 'IN_PERSON' | 'POST')} value={deliveryMode}>
                            <View style={styles.radioRow}>
                                <RadioButton value="IN_PERSON" color={theme.colors.primary} />
                                <Text onPress={() => setDeliveryMode('IN_PERSON')}>{t('sevas.inPerson')}</Text>
                            </View>
                            <View style={styles.radioRow}>
                                <RadioButton value="POST" color={theme.colors.primary} />
                                <Text onPress={() => setDeliveryMode('POST')}>{t('sevas.byPost')}</Text>
                            </View>
                        </RadioButton.Group>
                    </View>

                    {/* Disclaimer / Info */}
                    <View style={styles.infoBox}>
                        <AlertCircle size={20} color={theme.colors.secondary} />
                        <Text style={[styles.infoText, { color: theme.colors.secondary }]}>
                            {t('sevas.sevaInfo')}
                        </Text>
                    </View>

                    {/* Consent */}
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
                            {t('sevas.consent')}
                        </Text>
                    </View>

                    <Button
                        mode="contained"
                        onPress={handlePayment}
                        loading={submitting}
                        disabled={submitting || !consent}
                        style={[styles.button, { backgroundColor: theme.colors.primary, marginTop: 24 }]}
                        labelStyle={styles.buttonLabel}
                    >
                        {t('sevas.proceedToPayment', { amount: selectedSeva.amount })}
                    </Button>
                </View>
            </ScrollView>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text variant="headlineMedium" style={[styles.headerTitle, { color: theme.colors.primary }]}>
                {t('sevas.availableSevas')}
            </Text>

            {sevas.length === 0 ? (
                <Text style={{ textAlign: 'center', marginTop: 20, color: theme.colors.secondary }}>
                    {t('sevas.noSevas')}
                </Text>
            ) : (
                sevas.map((seva) => (
                    <TouchableOpacity key={seva.id} onPress={() => handleSevaSelect(seva)}>
                        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                            {seva.imageUrl ? <Card.Cover source={{ uri: seva.imageUrl }} /> : null}
                            <Card.Title
                                title={i18n.language === 'kn' && seva.titleKannada ? seva.titleKannada : seva.titleEnglish}
                                subtitle={`₹${seva.amount}`}
                                titleStyle={{ fontWeight: 'bold' }}
                                subtitleStyle={{ color: theme.colors.primary, fontWeight: 'bold' }}
                            />
                            {seva.description ? (
                                <Card.Content>
                                    <Text variant="bodyMedium" numberOfLines={2} style={{ color: theme.colors.onSurfaceVariant }}>
                                        {seva.description}
                                    </Text>
                                </Card.Content>
                            ) : null}
                        </Card>
                    </TouchableOpacity>
                ))
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    headerTitle: {
        fontFamily: 'PlusJakartaSans-SemiBold',
        marginBottom: 16,
        fontWeight: 'bold',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    form: {
        gap: 12,
    },
    input: {
        fontSize: 16,
    },
    button: {
        borderRadius: 24,
        paddingVertical: 4,
    },
    buttonLabel: {
        fontSize: 16,
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontWeight: 'bold',
    },
    card: {
        marginBottom: 16,
        elevation: 2,
        borderRadius: 12,
    },
    // New Styles
    radioGroup: {
        marginTop: 8,
    },
    radioRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
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
        marginVertical: 8,
    },
    infoText: {
        marginLeft: 10,
        flex: 1,
        fontSize: 12,
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
    confirmRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        alignItems: 'center',
    },
    confirmLabel: {
        opacity: 0.7,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 12,
        opacity: 0.5,
    }
});

export default SevaScreen;

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Text, TextInput, Button, HelperText, useTheme, Checkbox } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';

const LoginScreen = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isAgreed, setIsAgreed] = useState(false);
    const { sendOtp, error, isLoading } = useAuthStore();
    const navigation = useNavigation<any>();
    const theme = useTheme();
    const insets = useSafeAreaInsets();

    const handleSendOTP = async () => {
        if (!phoneNumber) return;
        try {
            await sendOtp(phoneNumber);
            navigation.navigate('OTP', { phoneNumber });
        } catch (err: any) {
            // Error is handled in store
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
            <View style={styles.content}>
                <Text variant="headlineMedium" style={styles.title}>Welcome Back</Text>
                <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
                    Enter your mobile number to continue
                </Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        label="Phone Number"
                        placeholder="+91 9876543210"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType="phone-pad"
                        mode="outlined"
                        left={<TextInput.Icon icon="phone" />}
                    />
                    {error && <HelperText type="error">{error}</HelperText>}
                </View>

                <View style={styles.agreementContainer}>
                    <View style={Platform.OS === 'ios' ? [styles.checkboxWrapper, { borderColor: 'black' }] : undefined}>
                        <Checkbox
                            status={isAgreed ? 'checked' : 'unchecked'}
                            onPress={() => setIsAgreed(!isAgreed)}
                            color={theme.colors.primary}
                            uncheckedColor={Platform.OS === 'ios' ? 'transparent' : 'black'}
                        />
                    </View>
                    <View style={styles.agreementTextContainer}>
                        <Text variant="bodySmall">I agree to the </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
                            <Text variant="bodySmall" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                                Privacy Policy
                            </Text>
                        </TouchableOpacity>
                        <Text variant="bodySmall"> and </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('TermsConditions')}>
                            <Text variant="bodySmall" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                                Terms & Conditions
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Button
                    mode="contained"
                    onPress={handleSendOTP}
                    loading={isLoading}
                    disabled={isLoading || !phoneNumber || !isAgreed}
                    style={styles.button}
                >
                    Send Verification Code
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    title: {
        marginBottom: 8,
        fontFamily: 'PlusJakartaSans-SemiBold',
    },
    subtitle: {
        marginBottom: 32,
    },
    inputContainer: {
        marginBottom: 24,
    },
    button: {
        marginTop: 8,
    },
    agreementContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    checkboxWrapper: {
        borderWidth: 2,
        borderRadius: 4,
        marginRight: 8,
    },
    agreementTextContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        flex: 1,
    },
});

export default LoginScreen;

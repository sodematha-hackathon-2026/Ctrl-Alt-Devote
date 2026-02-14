import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button, HelperText, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';

const OTPScreen = ({ route }: any) => {
    const { phoneNumber } = route.params;
    const [code, setCode] = useState('');
    const { verifyOtp, error, isLoading, user } = useAuthStore();
    const theme = useTheme();
    const navigation = useNavigation<any>();

    // Redirect to MainTabs when user is authenticated
    useEffect(() => {
        if (user) {
            // Check if user has completed profile (at least name)
            if (!user.fullName) {
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'EditProfile', params: { isOnboarding: true } }],
                    })
                );
            } else {
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'MainTabs' }],
                    })
                );
            }
        }
    }, [user, navigation]);

    const handleVerify = async () => {
        if (!code) return;
        try {
            await verifyOtp(phoneNumber, code);
            // Navigation handled by useEffect when user state updates
        } catch (err) {
            // Error handled in store
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.content}>
                <Text variant="headlineMedium" style={styles.title}>Verify Code</Text>
                <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
                    Enter the code sent to {phoneNumber}
                </Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        label="Verification Code"
                        value={code}
                        onChangeText={setCode}
                        keyboardType="number-pad"
                        mode="outlined"
                        maxLength={6}
                        left={<TextInput.Icon icon="message-processing" />}
                    />
                    {error && <HelperText type="error">{error}</HelperText>}
                </View>

                <Button
                    mode="contained"
                    onPress={handleVerify}
                    loading={isLoading}
                    disabled={isLoading || code.length < 6}
                    style={styles.button}
                >
                    Verify & Proceed
                </Button>
            </View>
        </SafeAreaView>
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
    }
});

export default OTPScreen;

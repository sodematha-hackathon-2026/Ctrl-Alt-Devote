import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Appbar, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PrivacyPolicyScreen = () => {
    const navigation = useNavigation();
    const theme = useTheme();
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Privacy Policy" />
            </Appbar.Header>
            <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}>
                <Text variant="bodyLarge" style={styles.text}>
                    Privacy Policy Placeholder
                </Text>
                <Text variant="bodyMedium" style={styles.text}>
                    This is a placeholder for the Privacy Policy.
                    Please replace this content with the actual privacy policy text.
                </Text>
                <Text variant="bodyMedium" style={styles.text}>
                    1. Data Collection
                    We collect your phone number for authentication purposes.
                </Text>
                <Text variant="bodyMedium" style={styles.text}>
                    2. Data Usage
                    Your data is used to provide access to the application and its features.
                </Text>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
    },
    text: {
        marginBottom: 16,
    },
});

export default PrivacyPolicyScreen;

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Appbar, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TermsConditionsScreen = () => {
    const navigation = useNavigation();
    const theme = useTheme();
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Terms & Conditions" />
            </Appbar.Header>
            <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}>
                <Text variant="bodyLarge" style={styles.text}>
                    Terms and Conditions Placeholder
                </Text>
                <Text variant="bodyMedium" style={styles.text}>
                    This is a placeholder for the Terms & Conditions.
                    Please replace this content with the actual terms text.
                </Text>
                <Text variant="bodyMedium" style={styles.text}>
                    1. Acceptance of Terms
                    By using this application, you agree to these terms.
                </Text>
                <Text variant="bodyMedium" style={styles.text}>
                    2. Usage Rules
                    You agree to use the app responsibly and in accordance with local laws.
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

export default TermsConditionsScreen;

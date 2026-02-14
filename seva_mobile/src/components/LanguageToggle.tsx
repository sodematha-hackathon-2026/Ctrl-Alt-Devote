import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

const LanguageToggle = () => {
    const { i18n } = useTranslation();
    const theme = useTheme();

    const toggleLanguage = () => {
        const currentLang = i18n.language;
        const nextLang = currentLang === 'en' ? 'kn' : 'en';
        i18n.changeLanguage(nextLang);
    };

    return (
        <TouchableOpacity onPress={toggleLanguage} style={[styles.container, { borderColor: theme.colors.outline }]}>
            <Text variant="labelLarge" style={{ color: i18n.language === 'en' ? theme.colors.primary : theme.colors.onSurfaceVariant, fontWeight: i18n.language === 'en' ? 'bold' : 'normal' }}>EN</Text>
            <Text variant="labelLarge" style={{ color: theme.colors.outline }}> | </Text>
            <Text variant="labelLarge" style={{ color: i18n.language === 'kn' ? theme.colors.primary : theme.colors.onSurfaceVariant, fontWeight: i18n.language === 'kn' ? 'bold' : 'normal' }}>ಕನ್ನಡ</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
});

export default LanguageToggle;

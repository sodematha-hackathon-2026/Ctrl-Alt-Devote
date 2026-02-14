import { Platform } from 'react-native';

const fontConfig = {
    displayMedium: {
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: 45,
        lineHeight: 52,
        letterSpacing: 0,
    },
    displaySmall: {
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: 36,
        lineHeight: 44,
        letterSpacing: 0,
    },
    headlineMedium: {
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: 28,
        lineHeight: 36,
        letterSpacing: 0,
    },
    bodyLarge: {
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: 0.15,
    },
    bodyMedium: {
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.25,
    },
    labelLarge: {
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.1,
    },
    // Add other variants as needed, mapping them to the font families
};

export const typography = {
    ...fontConfig,
};

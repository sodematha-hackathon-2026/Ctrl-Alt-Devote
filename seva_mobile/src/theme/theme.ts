import { MD3LightTheme, configureFonts } from 'react-native-paper';
import { colors } from './colors';
import { spacing } from './spacing';
import { shadows } from './shadows';
import { typography } from './typography';

const fontConfig = {
  fontFamily: 'PlusJakartaSans-Regular',
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    background: colors.background,
    surface: colors.surface,
    outline: colors.border,
    onPrimary: colors.onPrimary,
    onSurface: colors.onSurface,
    // Add other color overrides
  },
  fonts: configureFonts({ config: typography }),
  roundness: 2, // Default roundness multiplier? Paper uses 4px * roundness usually.
  // Custom tokens
  spacing,
  shadows,
  radius: {
    card: 24,
    input: 12,
  },
};

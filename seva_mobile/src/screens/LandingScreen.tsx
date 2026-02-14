import { View, StyleSheet, ImageBackground, Image } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import LanguageToggle from '../components/LanguageToggle';

const LandingScreen = () => {
    const theme = useTheme();
    const navigation = useNavigation<any>();
    const { t } = useTranslation();

    return (
        <ImageBackground
            style={[styles.container, { backgroundColor: theme.colors.background }]}
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.content}>
                    <View style={styles.topBar}>
                        <LanguageToggle />
                    </View>
                    <View style={styles.headerContainer}>
                        <Image
                            source={require('../../assets/logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text variant="displaySmall" style={[styles.title, { color: theme.colors.primary }]}>
                            {t('landing.title')}
                        </Text>
                        <Text variant="bodyLarge" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
                            {t('landing.subtitle')}
                        </Text>
                    </View>

                    <View style={styles.footerContainer}>
                        <Button
                            mode="contained"
                            onPress={() => navigation.navigate('MainTabs')}
                            style={styles.button}
                            contentStyle={styles.buttonContent}
                        >
                            {t('landing.getStarted')}
                        </Button>
                    </View>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'space-between',
    },
    topBar: {
        alignItems: 'flex-end',
        marginBottom: 20,
    },
    headerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 60,
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 24,
    },
    title: {
        fontFamily: 'PlusJakartaSans-SemiBold',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        textAlign: 'center',
        maxWidth: '80%',
        opacity: 0.8,
    },
    footerContainer: {
        paddingBottom: 32,
        width: '100%',
    },
    button: {
        borderRadius: 50,
    },
    buttonContent: {
        height: 56,
    }
});

export default LandingScreen;

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions, Linking, Platform, RefreshControl } from 'react-native';
import { Text, useTheme, Button, IconButton, List, Divider, Chip, ActivityIndicator, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useParamparaStore, Guru } from '../store/paramparaStore';
import { MapPin, Calendar, BookOpen, User } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const GuruDetailScreen = () => {
    const theme = useTheme();
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { t } = useTranslation();
    const { guruId } = route.params;

    // Map specific guru IDs to local assets
    const localGuruImages: { [key: number]: any } = {
        20: require('../../assets/Vadiraja_Tirtha.png'),
        33: require('../../assets/Vishwendratirtha.jpg'),
        34: require('../../assets/Vishwadhishatirtha.jpg'),
        35: require('../../assets/Vishwotham1.png'),
        36: require('../../assets/Vishwavallabha1.png'),
    };

    const { gurus, fetchGurus, loading, error } = useParamparaStore();
    const [refreshing, setRefreshing] = useState(false);
    const [guru, setGuru] = useState<Guru | null>(null);
    const [startX, setStartX] = useState<number | null>(null);
    const [hasRefreshed, setHasRefreshed] = useState(false);
    const [ashramaGuru, setAshramaGuru] = useState<Guru | null>(null);
    const [ashramaShishya, setAshramaShishya] = useState<Guru | null>(null);

    // Accordion states
    const [lifeExpanded, setLifeExpanded] = useState(true);
    const [aaradhaneExpanded, setAaradhaneExpanded] = useState(true);
    const [detailsExpanded, setDetailsExpanded] = useState(false);

    // Load all gurus first
    useEffect(() => {
        if (gurus.length === 0) {
            fetchGurus();
        }
    }, [fetchGurus, gurus.length]);

    useEffect(() => {
        // Convert guruId to number to ensure proper comparison
        const numericGuruId = typeof guruId === 'string' ? parseInt(guruId, 10) : guruId;

        const currentGuru = gurus.find(g => g.id === numericGuruId);

        if (currentGuru) {
            setGuru(currentGuru);
            if ((!currentGuru.description && !currentGuru.bio) && !hasRefreshed && !loading) {
                console.log('[PARAMPARA] Description missing, triggering auto-refresh...');
                setHasRefreshed(true);
                fetchGurus();
            }

            // Resolve Ashrama Guru/Shishya
            if (currentGuru.ashramaGuruId) {
                setAshramaGuru(gurus.find(g => g.id === currentGuru.ashramaGuruId) || null);
            } else if (currentGuru.ashramaGuru) {
                // Fallback to name search if ID not present
                setAshramaGuru(gurus.find(g => g.name === currentGuru.ashramaGuru) || null);
            }

            if (currentGuru.ashramaShishyaId) {
                setAshramaShishya(gurus.find(g => g.id === currentGuru.ashramaShishyaId) || null);
            } else if (currentGuru.ashramaShishya) {
                setAshramaShishya(gurus.find(g => g.name === currentGuru.ashramaShishya) || null);
            }
        }
    }, [guruId, gurus]);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        try {
            await fetchGurus();
        } finally {
            setRefreshing(false);
        }
    }, [fetchGurus]);

    const handleSwipe = (direction: 'left' | 'right') => {
        if (!guru) return;
        const currentIndex = gurus.findIndex(g => g.id === guru.id);
        if (currentIndex === -1) return;

        if (direction === 'left') {
            // Next Guru
            const nextIndex = currentIndex + 1;
            if (nextIndex < gurus.length) {
                const nextGuru = gurus[nextIndex];
                navigation.replace('GuruDetail', { guruId: nextGuru.id });
            }
        } else {
            // Previous Guru
            const prevIndex = currentIndex - 1;
            if (prevIndex >= 0) {
                const prevGuru = gurus[prevIndex];
                navigation.replace('GuruDetail', { guruId: prevGuru.id });
            }
        }
    };

    const onTouchStart = (e: any) => {
        setStartX(e.nativeEvent.pageX);
    };

    const onTouchEnd = (e: any) => {
        if (startX === null) return;
        const endX = e.nativeEvent.pageX;
        const diff = startX - endX;

        if (Math.abs(diff) > gurus.length) {
            if (diff > 0) {
                handleSwipe('left');
            } else {
                handleSwipe('right');
            }
        }
        setStartX(null);
    };

    if (!guru && gurus.length === 0 && !loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" />
                <Text style={{ marginTop: 16 }}>Loading gurus...</Text>
            </View>
        );
    }

    if (!guru) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>Guru not found</Text>
                <Text style={{ marginTop: 8, opacity: 0.6 }}>ID: {guruId}</Text>
                <Button mode="contained" onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
                    Go Back
                </Button>
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
            >
                {/* Header Image */}
                <View style={styles.imageContainer}>
                    {localGuruImages[guru.id] ? (
                        <Image source={localGuruImages[guru.id]} style={styles.guruImage} resizeMode="contain" />
                    ) : guru.photoURL ? (
                        <Image source={{ uri: guru.photoURL }} style={styles.guruImage} resizeMode="contain" />
                    ) : (
                        <View style={[styles.placeholderImage, { backgroundColor: theme.colors.surfaceVariant }]}>
                            <Text variant="displayLarge" style={{ color: theme.colors.onSurfaceVariant }}>
                                {guru.name.charAt(0)}
                            </Text>
                        </View>
                    )}
                    <IconButton
                        icon="arrow-left"
                        size={24}
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    />
                </View>

                <View style={styles.contentContainer}>
                    <Text variant="headlineMedium" style={styles.name}>{guru.name}</Text>
                    <Text variant="titleMedium" style={{ color: theme.colors.secondary, marginBottom: 8, textAlign: 'center' }}>
                        {guru.startYear && guru.endYear ? `${guru.startYear} – ${guru.endYear}` : guru.period}
                    </Text>

                    {guru.shortHighlight && (
                        <Text variant="bodyLarge" style={[styles.highlight, { backgroundColor: theme.colors.secondaryContainer, color: theme.colors.onSecondaryContainer }]}>
                            {guru.shortHighlight}
                        </Text>
                    )}


                    {/* Parampara Navigation Links */}
                    <View style={styles.navLinks}>
                        {ashramaGuru && (
                            <Chip
                                icon="account-arrow-left"
                                onPress={() => navigation.push('GuruDetail', { guruId: ashramaGuru.id })}
                                style={styles.navChip}
                            >
                                {t('guruDetail.guru')}: {ashramaGuru.name}
                            </Chip>
                        )}
                        {ashramaShishya && (
                            <Chip
                                icon="account-arrow-right"
                                onPress={() => navigation.push('GuruDetail', { guruId: ashramaShishya.id })}
                                style={styles.navChip}
                            >
                                {t('guruDetail.shishya')}: {ashramaShishya.name}
                            </Chip>
                        )}
                    </View>

                    <Divider style={{ marginVertical: 16 }} />

                    {/* About */}
                    <List.Accordion
                        title={t('guruDetail.about')}
                        left={props => <List.Icon {...props} icon="book-open-page-variant" />}
                        expanded={lifeExpanded}
                        onPress={() => setLifeExpanded(!lifeExpanded)}
                    >
                        <View style={styles.sectionContent}>
                            <Text variant="bodyMedium" style={styles.bioText}>
                                {guru.description || guru.bio || "Detailed biography not available."}
                            </Text>
                            {guru.keyWorks && (
                                <View style={{ marginTop: 12 }}>
                                    <Text variant="titleSmall" style={{ fontWeight: 'bold' }}>{t('guruDetail.keyWorks')}:</Text>
                                    <Text variant="bodyMedium" style={{ textAlign: 'justify' }}>{guru.keyWorks}</Text>
                                </View>
                            )}
                        </View>
                    </List.Accordion>

                    <Divider />

                    {/* Aaradhane & Vrindavana */}
                    <List.Accordion
                        title={t('guruDetail.aaradhane')}
                        left={props => <List.Icon {...props} icon="flower" />}
                        expanded={aaradhaneExpanded}
                        onPress={() => setAaradhaneExpanded(!aaradhaneExpanded)}
                    >
                        <View style={styles.sectionContent}>
                            <View style={styles.row}>
                                <Calendar size={20} color={theme.colors.primary} />
                                <Text style={{ marginLeft: 8 }}>{guru.aaradhane || "N/A"}</Text>
                            </View>
                            <View style={[styles.row, { marginTop: 12 }]}>
                                <MapPin size={20} color={theme.colors.primary} />
                                <Text style={{ marginLeft: 8, flex: 1 }}>{guru.vrindavanaLocation || "Location N/A"}</Text>
                            </View>
                        </View>
                    </List.Accordion>
                </View>
            </ScrollView>
            <Snackbar
                visible={!!error}
                onDismiss={() => { }}
                action={{
                    label: 'Retry',
                    onPress: fetchGurus,
                }}>
                {error}
            </Snackbar>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    imageContainer: {
        height: 340,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    guruImage: {
        width: '100%',
        height: '100%',
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: Platform.OS === 'android' ? 44 : 50,
        left: 16,
        backgroundColor: 'rgba(255,255,255,0.7)',
    },
    contentContainer: {
        padding: 20,
    },
    name: {
        fontFamily: 'PlusJakartaSans-Bold',
        textAlign: 'center',
        marginBottom: 4,
    },
    highlight: {
        padding: 12,
        borderRadius: 8,
        marginTop: 12,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    navLinks: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 16,
        gap: 8,
    },
    navChip: {
        margin: 4,
    },
    sectionContent: {
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 0,
        paddingBottom: 16,
    },
    bioText: {
        lineHeight: 22,
        textAlign: 'justify',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButtons: {
        flexDirection: 'row',
        marginTop: 16,
    },
    detailRow: {
        marginBottom: 8,
    }
});

export default GuruDetailScreen;

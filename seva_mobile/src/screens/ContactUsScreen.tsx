import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Linking, TouchableOpacity, ScrollView, Platform, FlatList } from 'react-native';

import { Text, Button, Card, Title, Paragraph, ActivityIndicator, IconButton, useTheme, Avatar, Modal, Portal } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Branch, getBranches } from '../api/branchService';
import { Phone, MapPin, Navigation, X } from 'lucide-react-native';
import MapComponent from '../components/MapComponent';
import { useTranslation } from 'react-i18next';

const ContactUsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const { t } = useTranslation();
    const { branch: paramBranch } = route.params || {};

    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
    const theme = useTheme();

    useEffect(() => {
        loadData();
    }, []);

    // Handle Deep Linking / Navigation Params
    useEffect(() => {
        // If a branch object is passed directly, use it
        if (paramBranch && !loading) {
            setSelectedBranch(paramBranch);
        }
    }, [loading, branches, paramBranch]);

    const loadData = async () => {
        try {
            const branchData = await getBranches();
            setBranches(branchData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCall = (phone: string) => {
        if (phone && phone !== 'N/A') {
            Linking.openURL(`tel:${phone.split(',')[0].trim()}`);
        }
    };

    const handleNavigate = (link: string, lat?: number, lng?: number) => {
        if (link) {
            Linking.openURL(link);
        } else if (lat && lng) {
            const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
            const latLng = `${lat},${lng}`;
            const label = 'Sode Matha Branch';
            const url = Platform.select({
                ios: `${scheme}${label}@${latLng}`,
                android: `${scheme}${latLng}(${label})`
            });
            if (url) Linking.openURL(url);
        }
    };

    const renderBranchCard = ({ item }: { item: Branch }) => (
        <Card
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
            onPress={() => setSelectedBranch(item)}
            elevation={2}
        >
            <Card.Content style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Avatar.Icon
                    size={48}
                    icon="map-marker"
                    style={{ backgroundColor: theme.colors.primaryContainer, marginRight: 16 }}
                    color={theme.colors.onPrimaryContainer}
                />
                <View style={{ flex: 1 }}>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{item.name}</Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.secondary }}>{item.city}, {item.state}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                        <Text variant="bodySmall" numberOfLines={1} style={{ flex: 1 }}>{item.address}</Text>
                    </View>
                </View>
                <IconButton icon="chevron-right" size={24} iconColor={theme.colors.outline} />
            </Card.Content>
        </Card>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }


    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            <View style={[styles.header, { backgroundColor: theme.colors.background, borderBottomColor: theme.colors.outlineVariant }]}>
                <View style={{ flex: 1 }}>
                    <Text variant="headlineMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>{t('contact.title')}</Text>
                    <Text variant="bodyMedium">{t('contact.subtitle')}</Text>
                </View>
            </View>

            <FlatList
                data={branches}
                renderItem={renderBranchCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
            />

            {/* Modal for Map and Details */}
            <Portal>
                <Modal
                    visible={!!selectedBranch}
                    onDismiss={() => setSelectedBranch(null)}
                    contentContainerStyle={styles.modalContent}
                >
                    {selectedBranch && (
                        <View style={[styles.modalInner, { backgroundColor: theme.colors.surface }]}>
                            <View style={styles.modalHeader}>
                                <Text variant="titleLarge" style={{ flex: 1, fontWeight: 'bold' }}>{selectedBranch.name}</Text>
                                <IconButton
                                    icon="close"
                                    onPress={() => setSelectedBranch(null)}
                                />
                            </View>

                            <View style={styles.mapContainer}>
                                <MapComponent
                                    key={selectedBranch.id} // Force re-render on branch change
                                    initialRegion={{
                                        latitude: selectedBranch.latitude,
                                        longitude: selectedBranch.longitude,
                                        latitudeDelta: 0.01,
                                        longitudeDelta: 0.01,
                                    }}
                                    branches={[selectedBranch]}
                                    gurus={[]}
                                    onSelectBranch={() => { }}
                                    onSelectGuru={() => { }}
                                />
                            </View>
                            <View style={styles.modalDetails}>
                                <View style={styles.infoRow}>
                                    <MapPin size={20} color={theme.colors.primary} />
                                    <Text style={[styles.infoText, { color: theme.colors.onSurface }]}>
                                        {selectedBranch.address}, {selectedBranch.city}, {selectedBranch.state} - {selectedBranch.pincode}
                                    </Text>
                                </View>

                                {selectedBranch.phone && selectedBranch.phone !== 'N/A' && (
                                    <TouchableOpacity onPress={() => handleCall(selectedBranch.phone)} style={styles.infoRow}>
                                        <Phone size={20} color={theme.colors.primary} />
                                        <Text style={[styles.infoText, { color: theme.colors.primary, textDecorationLine: 'underline' }]}>
                                            {selectedBranch.phone}
                                        </Text>
                                    </TouchableOpacity>
                                )}

                                <Button
                                    mode="contained"
                                    onPress={() => handleNavigate(selectedBranch.mapLink, selectedBranch.latitude, selectedBranch.longitude)}
                                    icon={() => <Navigation size={20} color={theme.colors.onPrimary} />}
                                    style={styles.directionsButton}
                                    contentStyle={{ height: 48 }}
                                >
                                    {t('common.getDirections')}
                                </Button>
                            </View>
                        </View>
                    )}
                </Modal>
            </Portal >
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 16,
    },
    card: {
        marginBottom: 12,
        borderRadius: 12,
    },
    modalContent: {
        padding: 20,
        justifyContent: 'center',
    },
    modalInner: {
        borderRadius: 16,
        overflow: 'hidden',
        // maxHeight: '80%', // Allow scrolling if needed, but fixed layout is better
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    mapContainer: {
        height: 250,
        width: '100%',
    },
    modalDetails: {
        padding: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    infoText: {
        marginLeft: 12,
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
    },
    directionsButton: {
        marginTop: 8,
        borderRadius: 24,
    }
});

export default ContactUsScreen;

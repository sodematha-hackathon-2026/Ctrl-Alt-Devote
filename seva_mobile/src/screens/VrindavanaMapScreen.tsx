import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { Text, IconButton, useTheme, Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Swamiji } from '../data/guruParampara';
import { guruService } from '../api/guruService';
import { Navigation, X } from 'lucide-react-native';
import MapComponent from '../components/MapComponent';

const VrindavanaMapScreen = () => {
    const navigation = useNavigation();
    const [gurus, setGurus] = useState<Swamiji[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedGurus, setSelectedGurus] = useState<Swamiji[]>([]);
    const theme = useTheme();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const guruData = await guruService.getAllGurus();
            // Filter gurus who have vrindavana coordinates
            const gurusWithMapLinks = guruData.filter(g => g.vrindavanaLat && g.vrindavanaLong);
            setGurus(gurusWithMapLinks);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleNavigate = (link: string) => {
        if (link) {
            const { Linking } = require('react-native');
            Linking.openURL(link);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    // Default region (centering on Karnataka/South India)
    const initialRegion = {
        latitude: 13.5,
        longitude: 75.5,
        latitudeDelta: 4.0,
        longitudeDelta: 4.0,
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
                <IconButton
                    icon="arrow-left"
                    size={24}
                    onPress={() => navigation.goBack()}
                />
                <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text variant="headlineMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>Vrindavana Map</Text>
                    <Text variant="bodyMedium">Locate guru vrindavanas</Text>
                </View>
            </View>

            <View style={styles.mapContainer}>
                <MapComponent
                    initialRegion={initialRegion}
                    branches={[]}
                    gurus={gurus}
                    onSelectBranch={() => { }}
                    onSelectGuru={(guru) => {
                        // Find all gurus at the same coordinates
                        const gurusAtLocation = gurus.filter(g =>
                            g.vrindavanaLat === guru.vrindavanaLat &&
                            g.vrindavanaLong === guru.vrindavanaLong
                        );
                        setSelectedGurus(gurusAtLocation);
                    }}
                />
            </View>

            {/* Selection Details Overlay */}
            {selectedGurus.length > 0 && (
                <View style={[styles.detailsOverlay, { backgroundColor: theme.colors.surface }]}>
                    <View style={styles.detailsHeader}>
                        <Title style={{ flex: 1 }}>
                            {selectedGurus.length === 1
                                ? selectedGurus[0].name
                                : `${selectedGurus.length} Gurus at this location`}
                        </Title>
                        <IconButton
                            icon={({ size, color }) => <X size={size} color={color} />}
                            onPress={() => setSelectedGurus([])}
                        />
                    </View>

                    <ScrollView style={{ maxHeight: 400 }} showsVerticalScrollIndicator={true}>
                        <Card.Content>
                            {selectedGurus.map((guru, index) => (
                                <View key={guru.id}>
                                    {index > 0 && <View style={{ height: 12 }} />}
                                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{guru.name}</Text>
                                    <Paragraph style={{ marginTop: 4 }}>
                                        Vrindavana: {guru.vrindavanaLocation}
                                    </Paragraph>
                                    {guru.aaradhane && (
                                        <Paragraph style={{ marginTop: 4, fontSize: 12, opacity: 0.7 }}>
                                            Aaradhane: {guru.aaradhane}
                                        </Paragraph>
                                    )}
                                </View>
                            ))}
                        </Card.Content>
                    </ScrollView>

                    <Card.Actions style={styles.actions}>
                        <TouchableOpacity
                            onPress={() => {
                                if (selectedGurus[0]?.vrindavanaMapLink) {
                                    handleNavigate(selectedGurus[0].vrindavanaMapLink);
                                }
                            }}
                            style={[styles.navButton, { backgroundColor: theme.colors.primary }]}
                        >
                            <Navigation size={20} color="#fff" />
                            <Text style={{ color: '#fff', marginLeft: 8, fontWeight: 'bold' }}>Get Directions</Text>
                        </TouchableOpacity>
                    </Card.Actions>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapContainer: {
        flex: 1,
    },
    detailsOverlay: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        borderRadius: 16,
        padding: 16,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    detailsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    actions: {
        marginTop: 8,
    },
    navButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
    },
});

export default VrindavanaMapScreen;

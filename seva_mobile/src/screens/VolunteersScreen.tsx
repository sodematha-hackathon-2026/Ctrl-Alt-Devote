import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Button, useTheme, Chip, ActivityIndicator, IconButton } from 'react-native-paper';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';

import { API_URL } from '../api/config';

const fetchOpportunities = async () => {
    try {
        const response = await fetch(`${API_URL}/volunteer-opportunities`);
        if (!response.ok) {
            throw new Error('Failed to fetch opportunities');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching opportunities:', error);
        return [];
    }
};

const fetchMyApplications = async (token: string) => {
    try {
        const response = await fetch(`${API_URL}/volunteer-opportunities/my-applications`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        console.error('Error fetching applications:', error);
        return [];
    }
};

const VolunteersScreen = () => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const { user, getToken } = useAuthStore();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [opportunities, setOpportunities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const token = await getToken();
            const [opsData, appsData] = await Promise.all([
                fetchOpportunities(),
                token ? fetchMyApplications(token) : Promise.resolve([])
            ]);

            const merged = opsData.map((op: any) => {
                const app = appsData.find((a: any) => a.opportunity.id === op.id);
                return {
                    ...op,
                    // If applied, use the status from application (PENDING, APPROVED, REJECTED)
                    applicationStatus: app ? app.status : null,
                    applied: !!app
                };
            });

            setOpportunities(merged);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            loadData();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    const handleApply = async (id: string) => {
        // Optimistic update
        setOpportunities(prev => prev.map(op =>
            op.id === id ? { ...op, applied: true, applicationStatus: 'PENDING', applicationCount: (op.applicationCount || 0) + 1 } : op
        ));

        try {
            const token = await getToken();
            if (!token) throw new Error("No token found");

            const response = await fetch(`${API_URL}/volunteer-opportunities/${id}/apply`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to apply: ${response.status} ${errorText}`);
            }

            // Refresh data to ensure sync
            loadData();

        } catch (error) {
            console.error("Error applying for opportunity:", error);
            // Revert optimistic update
            setOpportunities(prev => prev.map(op =>
                op.id === id ? { ...op, applied: false, applicationStatus: null, applicationCount: (op.applicationCount || 0) - 1 } : op
            ));
            // Show toast or alert here if needed
        }
    };

    if (!user?.isVolunteer) {
        if (user?.volunteerRequest) {
            return (
                <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
                    <View style={styles.centerContainer}>
                        <Text variant="headlineSmall" style={{ textAlign: 'center', marginBottom: 10 }}>{t('volunteer.pendingApproval')}</Text>
                        <Text variant="bodyMedium" style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
                            {t('volunteer.pendingSubtitle')}
                        </Text>
                    </View>
                </SafeAreaView>
            );
        }

        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
                <View style={styles.centerContainer}>
                    <Text variant="headlineSmall" style={{ textAlign: 'center', marginBottom: 10 }}>{t('volunteer.accessRestricted')}</Text>
                    <Text variant="bodyMedium" style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
                        {t('volunteer.restrictedSubtitle')}
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    const getStatusLabel = (item: any) => {
        if (item.applicationStatus === 'APPROVED') return 'Approved';
        if (item.applicationStatus === 'REJECTED') return 'Rejected';
        if (item.applied) return 'Applied';
        return 'Apply Now';
    };

    const isButtonDisabled = (item: any) => {
        if (item.status !== 'OPEN') return true;
        // Disable if applied (PENDING or APPROVED)
        // Assuming we don't allow re-applying if Rejected immediately, or maybe we do? 
        // For now, disable if any application exists
        return item.applied;
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            <View style={[styles.header, { borderBottomColor: theme.colors.outlineVariant }]}>
                <View style={{ flex: 1 }}>
                    <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>{t('volunteer.title')}</Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                        {t('volunteer.subtitle')}
                    </Text>
                </View>
            </View>

            {loading && !refreshing ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                >
                    {opportunities.length === 0 ? (
                        <View style={{ padding: 20, alignItems: 'center' }}>
                            <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>{t('volunteer.noOpportunities')}</Text>
                        </View>
                    ) : (
                        opportunities.map((item) => (
                            <Card key={item.id} style={styles.card}>
                                <Card.Content>
                                    <Text variant="titleLarge" style={styles.cardTitle}>{item.title}</Text>
                                    <Text variant="bodyMedium" style={styles.cardDesc}>{item.description}</Text>

                                    <View style={styles.metaContainer}>
                                        <View>
                                            <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>Required Skills</Text>
                                            <Text variant="bodySmall">{item.requiredSkills}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.statsRow}>
                                        <Chip icon="account-group" compact style={{ marginRight: 8 }}>
                                            Applied: {item.applicationCount || 0}
                                        </Chip>
                                        {item.status === 'OPEN' ? (
                                            <Chip icon="check-circle" compact mode="outlined" style={{ borderColor: theme.colors.primary }}>Open</Chip>
                                        ) : (
                                            <Chip icon="close-circle" compact mode="outlined">Closed</Chip>
                                        )}
                                        {item.applicationStatus === 'APPROVED' && (
                                            <Chip icon="check-decagram" compact mode="flat" style={{ backgroundColor: '#e6fffa', marginLeft: 8 }} textStyle={{ color: '#00695c' }}>Approved</Chip>
                                        )}
                                    </View>
                                </Card.Content>
                                {item.applicationStatus !== 'APPROVED' && (
                                    <Card.Actions>
                                        <Button
                                            mode="contained"
                                            onPress={() => handleApply(item.id)}
                                            disabled={isButtonDisabled(item)}
                                            style={{ flex: 1, backgroundColor: item.applicationStatus === 'APPROVED' ? '#4caf50' : theme.colors.primary }}
                                        >
                                            {getStatusLabel(item)}
                                        </Button>
                                    </Card.Actions>
                                )}
                            </Card>
                        ))
                    )}
                </ScrollView>
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
        padding: 16,
        borderBottomWidth: 1,
    },
    title: {
        fontWeight: 'bold',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: 16,
    },
    card: {
        marginBottom: 16,
        borderRadius: 12,
    },
    cardTitle: {
        fontWeight: 'bold',
        marginBottom: 8,
    },
    cardDesc: {
        marginBottom: 16,
    },
    metaContainer: {
        marginBottom: 16,
        padding: 8,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
    },
    statsRow: {
        flexDirection: 'row',
        marginBottom: 8,
    }
});

export default VolunteersScreen;

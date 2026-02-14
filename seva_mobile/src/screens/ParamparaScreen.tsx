import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, useTheme, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import MathaHistoryScreen from './MathaHistoryScreen';
import GuruListScreen from './GuruListScreen';

import BhootarajaruScreen from './BhootarajaruScreen';

const ParamparaScreen = () => {
    const theme = useTheme();
    const navigation = useNavigation<any>();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'history' | 'parampara' | 'bhootarajaru'>('history');

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            <View style={styles.header}>
                <View style={{ flex: 1 }}>
                    <Text variant="headlineMedium" style={[styles.headerTitle, { color: theme.colors.primary }]}>
                        {t('tabs.parampara')}
                    </Text>
                </View>
                <IconButton
                    icon="map-marker"
                    size={28}
                    iconColor={theme.colors.primary}
                    onPress={() => navigation.navigate('VrindavanaMap')}
                />
            </View>

            <View style={styles.tabContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                    <TouchableOpacity
                        style={[
                            styles.tab,
                            activeTab === 'history' && { borderBottomColor: theme.colors.primary, borderBottomWidth: 2 }
                        ]}
                        onPress={() => setActiveTab('history')}
                    >
                        <Text
                            variant="titleMedium"
                            style={[
                                styles.tabText,
                                activeTab === 'history' ? { color: theme.colors.primary, fontWeight: 'bold' } : { color: theme.colors.onSurfaceVariant }
                            ]}
                        >
                            {t('parampara.history')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.tab,
                            activeTab === 'parampara' && { borderBottomColor: theme.colors.primary, borderBottomWidth: 2 }
                        ]}
                        onPress={() => setActiveTab('parampara')}
                    >
                        <Text
                            variant="titleMedium"
                            style={[
                                styles.tabText,
                                activeTab === 'parampara' ? { color: theme.colors.primary, fontWeight: 'bold' } : { color: theme.colors.onSurfaceVariant }
                            ]}
                        >
                            {t('parampara.lineage')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.tab,
                            activeTab === 'bhootarajaru' && { borderBottomColor: theme.colors.primary, borderBottomWidth: 2 }
                        ]}
                        onPress={() => setActiveTab('bhootarajaru')}
                    >
                        <Text
                            variant="titleMedium"
                            style={[
                                styles.tabText,
                                activeTab === 'bhootarajaru' ? { color: theme.colors.primary, fontWeight: 'bold' } : { color: theme.colors.onSurfaceVariant }
                            ]}
                        >
                            {t('parampara.bhootarajaru')}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            <View style={styles.content}>
                {activeTab === 'history' ? <MathaHistoryScreen /> : activeTab === 'parampara' ? <GuruListScreen /> : <BhootarajaruScreen />}
            </View>
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
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    headerTitle: {
        fontWeight: 'bold',
    },
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabText: {
        textAlign: 'center',
    },
    content: {
        flex: 1,
    }
});

export default ParamparaScreen;

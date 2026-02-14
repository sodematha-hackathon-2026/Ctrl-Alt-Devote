import React from 'react';
import { StyleSheet, View, Text, Linking } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { Branch } from '../api/branchService';
import { Swamiji } from '../data/guruParampara';

interface MapComponentProps {
    branches: Branch[];
    gurus: Swamiji[];
    onSelectBranch: (branch: Branch) => void;
    onSelectGuru: (guru: Swamiji) => void;
    initialRegion: any;
}

const MapComponent: React.FC<MapComponentProps> = ({
    branches,
    gurus
}) => {
    const theme = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Text style={[styles.text, { color: theme.colors.onSurfaceVariant }]}>
                Interactive Map is available on the mobile app.
            </Text>
            <Button
                mode="text"
                onPress={() => Linking.openURL('https://www.google.com/maps/search/Sode+Vadiraja+Matha')}
            >
                Open Google Maps
            </Button>

            <View style={styles.listContainer}>
                <Text style={[styles.subText, { color: theme.colors.onSurface }]}>
                    {branches.length} Branches & {gurus.length} Vrindavanas listed
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    text: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
    },
    subText: {
        fontSize: 14,
        marginTop: 8,
    },
    listContainer: {
        marginTop: 24,
    }
});

export default MapComponent;

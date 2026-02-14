import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Branch } from '../api/branchService';
import { Swamiji } from '../data/guruParampara';

interface MapComponentProps {
    branches: Branch[];
    gurus: Swamiji[];
    onSelectBranch: (branch: Branch) => void;
    onSelectGuru: (guru: Swamiji) => void;
    initialRegion: {
        latitude: number;
        longitude: number;
        latitudeDelta: number;
        longitudeDelta: number;
    };
}

const MapComponent: React.FC<MapComponentProps> = ({
    branches,
    gurus,
    onSelectBranch,
    onSelectGuru,
    initialRegion
}) => {
    return (
        <MapView
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
            style={styles.map}
            initialRegion={initialRegion}
        >
            {/* Branch markers */}
            {branches.map((branch) => (
                <Marker
                    key={`branch-${branch.id}`}
                    coordinate={{ latitude: branch.latitude, longitude: branch.longitude }}
                    title={branch.name}
                    description={branch.city}
                    onPress={() => onSelectBranch(branch)}
                />
            ))}
            {/* Guru vrindavana markers */}
            {gurus.map((guru) => {
                // Use the vrindavanaLat and vrindavanaLong fields directly
                if (!guru.vrindavanaLat || !guru.vrindavanaLong) return null;
                return (
                    <Marker
                        key={`guru-${guru.id}`}
                        coordinate={{ latitude: guru.vrindavanaLat, longitude: guru.vrindavanaLong }}
                        title={`${guru.name} Vrindavana`}
                        description={guru.vrindavanaLocation || ''}
                        pinColor="purple"
                        onPress={() => onSelectGuru(guru)}
                    />
                );
            })}
        </MapView>
    );
};

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default MapComponent;

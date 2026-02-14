import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { IconButton, ActivityIndicator, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface StoryViewerProps {
    visible: boolean;
    imageUrl: string | null;
    onClose: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ visible, imageUrl, onClose }) => {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (visible) {
            setLoading(true);
        }
    }, [visible]);

    if (!imageUrl) return null;

    return (
        <Modal
            visible={visible}
            transparent={false}
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <View style={[styles.container, { backgroundColor: 'black' }]}>
                <SafeAreaView style={styles.header}>
                    <View style={{ flex: 1 }} />
                    {/* Progress bar could go here */}
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <X size={28} color="white" />
                    </TouchableOpacity>
                </SafeAreaView>

                <View style={styles.imageContainer}>
                    {loading && (
                        <View style={StyleSheet.absoluteFillObject}>
                            <ActivityIndicator size="large" color="white" style={{ flex: 1 }} />
                        </View>
                    )}
                    <Image
                        source={{ uri: imageUrl }}
                        style={styles.image}
                        resizeMode="contain"
                        onLoadEnd={() => setLoading(false)}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: 16
    },
    closeButton: {
        padding: 8,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: width,
        height: height,
    },
});

export default StoryViewer;

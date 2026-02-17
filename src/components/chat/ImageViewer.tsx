import React from 'react';
import { View, StyleSheet, Modal, Image, TouchableOpacity, Dimensions } from 'react-native';
import { theme } from '../../theme';
import { Feather } from '@expo/vector-icons';
import { Text } from '../common/Text';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface ImageViewerProps {
    visible: boolean;
    imageUrl: string | null;
    onClose: () => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ visible, imageUrl, onClose }) => {
    if (!imageUrl) return null;

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Feather name="x" size={30} color={theme.colors.white} />
                </TouchableOpacity>
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                    resizeMode="contain"
                />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.95)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
        padding: 10,
    },
    image: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT * 0.8,
    },
});

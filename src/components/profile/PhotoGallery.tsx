import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { theme } from '../../theme';
import { Feather } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_WIDTH = (SCREEN_WIDTH - theme.spacing[4] * 2 - 10 * 2) / 3;

export interface PhotoGalleryProps {
    photos: string[];
    onAddPhoto?: () => void;
    onRemovePhoto?: (index: number) => void;
    editable?: boolean;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
    photos,
    onAddPhoto,
    onRemovePhoto,
    editable = false,
}) => {
    const renderItem = ({ item, index }: { item: string; index: number }) => (
        <View style={styles.photoContainer}>
            <Image source={{ uri: item }} style={styles.photo} />
            {editable && (
                <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => onRemovePhoto?.(index)}
                >
                    <View style={styles.removeIcon}>
                        <Feather name="x" size={12} color={theme.colors.white} />
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={photos}
                renderItem={renderItem}
                keyExtractor={(_, index) => index.toString()}
                numColumns={3}
                columnWrapperStyle={styles.columnWrapper}
                scrollEnabled={false}
                ListFooterComponent={
                    editable && photos.length < 9 ? (
                        <TouchableOpacity style={styles.addButton} onPress={onAddPhoto}>
                            <Feather name="plus" size={32} color={theme.colors.primary[500]} />
                        </TouchableOpacity>
                    ) : null
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    columnWrapper: {
        justifyContent: 'flex-start',
    },
    photoContainer: {
        width: COLUMN_WIDTH,
        height: COLUMN_WIDTH * 1.3, // Aspect ratio
        margin: 3,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: theme.colors.gray[100],
    },
    photo: {
        width: '100%',
        height: '100%',
    },
    removeButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        zIndex: 1,
    },
    removeIcon: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButton: {
        width: COLUMN_WIDTH,
        height: COLUMN_WIDTH * 1.3,
        margin: 3,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: theme.colors.primary[100],
        borderStyle: 'dashed',
        backgroundColor: theme.colors.primary[50],
        justifyContent: 'center',
        alignItems: 'center',
    },
});

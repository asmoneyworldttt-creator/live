import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, ProgressBar, Toast } from '../../components/common';
import { PhotoGallery } from '../../components/profile';
import { theme } from '../../theme';
import { useAuth } from '../../hooks';
import * as ImagePicker from 'expo-image-picker';

export default function PhotoUploadScreen({ navigation }: any) {
    const { updateProfile } = useAuth();
    const [photos, setPhotos] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAddPhoto = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
            allowsEditing: true,
            aspect: [3, 4],
        });

        if (!result.canceled && result.assets[0].uri) {
            setPhotos([...photos, result.assets[0].uri]);
        }
    };

    const handleRemovePhoto = (index: number) => {
        const newPhotos = [...photos];
        newPhotos.splice(index, 1);
        setPhotos(newPhotos);
    };

    const handleFinish = async () => {
        if (photos.length === 0) {
            setError('Please upload at least one photo');
            return;
        }

        setIsLoading(true);
        try {
            // In a real app, photos would be uploaded to storage (Supabase Bucket)
            // For now, we update the profile with local URIs for demonstration
            await updateProfile({
                avatar_url: photos[0],
                // photos: photos, // If we had this field
            });
            // Final step - navigation to home will be handled by auth listener
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <ProgressBar progress={1.0} color={theme.colors.success[500]} />
                <View style={styles.headerText}>
                    <Text variant="2xl" weight="bold">Upload Your Photos</Text>
                    <Text color={theme.colors.gray[500]}>Add at least 2 photos to stand out</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <PhotoGallery
                    photos={photos}
                    editable
                    onAddPhoto={handleAddPhoto}
                    onRemovePhoto={handleRemovePhoto}
                />

                <View style={styles.tipsContainer}>
                    <Text variant="sm" weight="bold" color={theme.colors.gray[800]}>💡 Pro Tips:</Text>
                    <Text variant="xs" color={theme.colors.gray[600]} style={styles.tip}>
                        • Use high-quality, bright photos
                    </Text>
                    <Text variant="xs" color={theme.colors.gray[600]} style={styles.tip}>
                        • Avoid group photos as your first picture
                    </Text>
                    <Text variant="xs" color={theme.colors.gray[600]} style={styles.tip}>
                        • Smile! Friendly faces get more matches
                    </Text>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title="Finish & Start Matching"
                    onPress={handleFinish}
                    loading={isLoading}
                    disabled={photos.length === 0}
                />
            </View>

            <Toast
                message={error || ''}
                visible={!!error}
                type="error"
                onHide={() => setError(null)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    header: {
        paddingHorizontal: theme.spacing[6],
        paddingTop: theme.spacing[2],
    },
    headerText: {
        marginTop: theme.spacing[6],
        marginBottom: theme.spacing[4],
    },
    content: {
        paddingHorizontal: theme.spacing[6],
        paddingBottom: theme.spacing[10],
    },
    tipsContainer: {
        marginTop: theme.spacing[8],
        padding: theme.spacing[4],
        backgroundColor: theme.colors.gray[50],
        borderRadius: 16,
    },
    tip: {
        marginTop: 4,
        lineHeight: 18,
    },
    footer: {
        padding: theme.spacing[6],
        borderTopWidth: 1,
        borderTopColor: theme.colors.gray[100],
    },
});

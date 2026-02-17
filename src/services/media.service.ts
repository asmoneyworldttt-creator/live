import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../api/supabase';
import * as FileSystem from 'expo-file-system';

export const mediaService = {
    /**
     * Request media library permissions
     */
    requestPermissions: async (): Promise<boolean> => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                console.warn('Media library permission denied');
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error requesting media permissions:', error);
            return false;
        }
    },

    /**
     * Pick image from library
     */
    pickImage: async (options?: {
        allowsMultiple?: boolean;
        quality?: number;
    }): Promise<ImagePicker.ImagePickerAsset[] | null> => {
        try {
            const hasPermission = await mediaService.requestPermissions();
            if (!hasPermission) return null;

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: options?.allowsMultiple || false,
                quality: options?.quality || 0.8,
                allowsEditing: !options?.allowsMultiple,
                aspect: [1, 1],
            });

            if (result.canceled) return null;

            return result.assets;
        } catch (error) {
            console.error('Error picking image:', error);
            return null;
        }
    },

    /**
     * Upload image to Supabase Storage
     */
    uploadImage: async (
        uri: string,
        bucket: string = 'avatars',
        folder?: string
    ): Promise<string | null> => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            // Read file as base64
            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: 'base64',
            });

            // Generate unique filename
            const fileExt = uri.split('.').pop() || 'jpg';
            const fileName = `${user.id}/${folder ? folder + '/' : ''}${Date.now()}.${fileExt}`;

            // Convert base64 to blob
            const blob = base64ToBlob(base64, `image/${fileExt}`);

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(fileName, blob, {
                    contentType: `image/${fileExt}`,
                    upsert: true,
                });

            if (error) throw error;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(data.path);

            console.log('✅ Image uploaded:', publicUrl);
            return publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
        }
    },

    /**
     * Upload avatar and update user profile
     */
    uploadAvatar: async (uri: string): Promise<string | null> => {
        try {
            const avatarUrl = await mediaService.uploadImage(uri, 'avatars');
            if (!avatarUrl) return null;

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return null;

            // Update user profile
            const { error } = await supabase
                .from('users')
                .update({ avatar_url: avatarUrl })
                .eq('id', user.id);

            if (error) throw error;

            console.log('✅ Avatar updated');
            return avatarUrl;
        } catch (error) {
            console.error('Error uploading avatar:', error);
            return null;
        }
    },

    /**
     * Upload multiple images to gallery
     */
    uploadGalleryImages: async (uris: string[]): Promise<string[]> => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];

            const uploadPromises = uris.map((uri, index) =>
                mediaService.uploadImage(uri, 'gallery', 'media')
            );

            const urls = await Promise.all(uploadPromises);
            const validUrls = urls.filter((url): url is string => url !== null);

            // Save to user_media table
            const mediaRecords = validUrls.map((url, index) => ({
                user_id: user.id,
                media_url: url,
                media_type: 'image',
                sort_order: index,
            }));

            const { error } = await supabase
                .from('user_media')
                .insert(mediaRecords);

            if (error) throw error;

            console.log(`✅ Uploaded ${validUrls.length} images to gallery`);
            return validUrls;
        } catch (error) {
            console.error('Error uploading gallery images:', error);
            return [];
        }
    },

    /**
     * Get user gallery images
     */
    getGalleryImages: async (userId: string): Promise<any[]> => {
        try {
            const { data, error } = await supabase
                .from('user_media')
                .select('*')
                .eq('user_id', userId)
                .order('sort_order', { ascending: true });

            if (error) throw error;

            return data || [];
        } catch (error) {
            console.error('Error fetching gallery images:', error);
            return [];
        }
    },

    /**
     * Delete image from gallery
     */
    deleteGalleryImage: async (imageId: string): Promise<boolean> => {
        try {
            const { error } = await supabase
                .from('user_media')
                .delete()
                .eq('id', imageId);

            if (error) throw error;

            console.log('✅ Image deleted from gallery');
            return true;
        } catch (error) {
            console.error('Error deleting image:', error);
            return false;
        }
    },
};

/**
 * Helper: Convert base64 to Blob
 */
function base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
}

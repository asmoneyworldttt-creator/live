import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../api/supabase';
import { mediaService } from '../../services/media.service';

export default function EditProfileScreen({ navigation, route }: any) {
    const { profile } = route.params || {};
    const [fullName, setFullName] = useState(profile?.full_name || '');
    const [bio, setBio] = useState(profile?.bio || '');
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user logged in');

            const { error } = await supabase
                .from('users')
                .update({ full_name: fullName, bio: bio })
                .eq('id', user.id);

            if (error) throw error;

            Alert.alert('Success', 'Profile updated!');
            navigation.goBack();
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePhoto = async () => {
        try {
            const images = await mediaService.pickImage({ allowsMultiple: false });
            if (!images || images.length === 0) return;

            setLoading(true);
            const newAvatarUrl = await mediaService.uploadAvatar(images[0].uri);

            if (newAvatarUrl) {
                setAvatarUrl(newAvatarUrl);
                Alert.alert('Success', 'Profile photo updated!');
            } else {
                Alert.alert('Error', 'Failed to upload photo');
            }
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={handleSave} disabled={loading}>
                    <Text style={styles.saveText}>{loading ? 'Saving...' : 'Save'}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={{ uri: avatarUrl || 'https://via.placeholder.com/150' }}
                        style={styles.avatar}
                    />
                    <TouchableOpacity style={styles.changePhotoBtn} onPress={handleChangePhoto}>
                        <Text style={styles.changePhotoText}>Change Photo</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={styles.input}
                        value={fullName}
                        onChangeText={setFullName}
                        placeholder="Your Name"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Bio</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={bio}
                        onChangeText={setBio}
                        placeholder="Tell us about yourself..."
                        multiline
                        numberOfLines={4}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    cancelText: {
        fontSize: 16,
        color: '#666',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    saveText: {
        fontSize: 16,
        color: '#7c3aed',
        fontWeight: 'bold',
    },
    content: {
        padding: 24,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 8,
    },
    changePhotoBtn: {
        padding: 8,
    },
    changePhotoText: {
        color: '#7c3aed',
        fontSize: 14,
        fontWeight: '600',
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
});

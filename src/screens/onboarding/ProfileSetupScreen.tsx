import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Input, Button, Chip, ProgressBar } from '../../components/common';
import { theme } from '../../theme';
import { useAuth } from '../../hooks';
import { Feather } from '@expo/vector-icons';

const INTERESTS = [
    'Music', 'Travel', 'Reading', 'Gaming', 'Fitness',
    'Cooking', 'Art', 'Photography', 'Movies', 'Dancing',
    'Technology', 'Nature', 'Fashion', 'Sports', 'Yoga'
];

export default function ProfileSetupScreen({ navigation }: any) {
    const { userProfile, updateProfile } = useAuth();
    const [fullName, setFullName] = useState(userProfile?.full_name || '');
    const [gender, setGender] = useState<'male' | 'female' | 'other' | null>(null);
    const [bio, setBio] = useState('');
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const toggleInterest = (interest: string) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter(i => i !== interest));
        } else {
            if (selectedInterests.length < 5) {
                setSelectedInterests([...selectedInterests, interest]);
            }
        }
    };

    const handleNext = async () => {
        if (!fullName || !gender || !bio || selectedInterests.length === 0) {
            return; // In a real app, show error
        }

        setIsLoading(true);
        try {
            await updateProfile({
                full_name: fullName,
                bio,
                interests: selectedInterests,
                // In a real app, gender would be saved to DB too
            });
            navigation.navigate('PhotoUpload');
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <ProgressBar progress={0.5} color={theme.colors.primary[500]} />
                <View style={styles.headerText}>
                    <Text variant="2xl" weight="bold">Create Your Profile</Text>
                    <Text color={theme.colors.gray[500]}>Tell us a bit about yourself</Text>
                </View>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.section}>
                        <Input
                            label="Full Name"
                            placeholder="John Doe"
                            value={fullName}
                            onChangeText={setFullName}
                        />
                    </View>

                    <View style={styles.section}>
                        <Text variant="sm" weight="bold" color={theme.colors.gray[700]} style={styles.sectionLabel}>
                            I am a...
                        </Text>
                        <View style={styles.genderRow}>
                            <TouchableOpacity
                                style={[styles.genderButton, gender === 'male' && styles.genderButtonActive]}
                                onPress={() => setGender('male')}
                            >
                                <Feather name="user" size={24} color={gender === 'male' ? theme.colors.white : theme.colors.gray[500]} />
                                <Text weight="semibold" color={gender === 'male' ? theme.colors.white : theme.colors.gray[500]}>Male</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.genderButton, gender === 'female' && styles.genderButtonActive]}
                                onPress={() => setGender('female')}
                            >
                                <Feather name="user" size={24} color={gender === 'female' ? theme.colors.white : theme.colors.gray[500]} />
                                <Text weight="semibold" color={gender === 'female' ? theme.colors.white : theme.colors.gray[500]}>Female</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.genderButton, gender === 'other' && styles.genderButtonActive]}
                                onPress={() => setGender('other')}
                            >
                                <Feather name="user" size={24} color={gender === 'other' ? theme.colors.white : theme.colors.gray[500]} />
                                <Text weight="semibold" color={gender === 'other' ? theme.colors.white : theme.colors.gray[500]}>Other</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Input
                            label="Bio"
                            placeholder="Tell others about yourself..."
                            value={bio}
                            onChangeText={setBio}
                            multiline
                            numberOfLines={4}
                        />
                    </View>

                    <View style={styles.section}>
                        <Text variant="sm" weight="bold" color={theme.colors.gray[700]} style={styles.sectionLabel}>
                            Interests (Select up to 5)
                        </Text>
                        <View style={styles.interestsGrid}>
                            {INTERESTS.map((interest) => (
                                <View key={interest} style={styles.chipWrapper}>
                                    <Chip
                                        label={interest}
                                        active={selectedInterests.includes(interest)}
                                        onPress={() => toggleInterest(interest)}
                                    />
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <View style={styles.footer}>
                <Button
                    title="Continue"
                    onPress={handleNext}
                    loading={isLoading}
                    disabled={!fullName || !gender || !bio || selectedInterests.length === 0}
                />
            </View>
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
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: theme.spacing[6],
        paddingBottom: theme.spacing[10],
    },
    section: {
        marginBottom: theme.spacing[6],
    },
    sectionLabel: {
        marginBottom: theme.spacing[2],
    },
    genderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    genderButton: {
        width: '31%',
        height: 100,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.colors.gray[200],
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.gray[50],
    },
    genderButtonActive: {
        backgroundColor: theme.colors.primary[500],
        borderColor: theme.colors.primary[500],
        ...theme.shadows.md,
    },
    interestsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -4,
    },
    chipWrapper: {
        margin: 4,
    },
    footer: {
        padding: theme.spacing[6],
        borderTopWidth: 1,
        borderTopColor: theme.colors.gray[100],
    },
});

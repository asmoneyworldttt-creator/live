import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Avatar } from '../../components/common';
import { theme } from '../../theme';
import { useAuth } from '../../hooks';
import { Feather } from '@expo/vector-icons';

export default function SettingsScreen({ navigation }: any) {
    const { profile, logout, deleteAccount } = useAuth();
    const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
    const [privacyMode, setPrivacyMode] = React.useState(false);

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                    }
                }
            ]
        );
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'This action is permanent and cannot be undone. All your data, matches, and coins will be lost.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete Permanently',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteAccount();
                        } catch (error: any) {
                            Alert.alert('Error', error.message);
                        }
                    }
                }
            ]
        );
    };

    const renderSettingItem = ({ icon, label, onPress, value, type = 'chevron', color = theme.colors.gray[900] }: any) => (
        <TouchableOpacity
            style={styles.settingItem}
            onPress={onPress}
            disabled={type === 'switch'}
        >
            <View style={styles.settingLeft}>
                <View style={[styles.iconBox, { backgroundColor: color + '10' }]}>
                    <Feather name={icon} size={18} color={color} />
                </View>
                <Text color={color} weight="medium">{label}</Text>
            </View>

            {type === 'chevron' && (
                <Feather name="chevron-right" size={20} color={theme.colors.gray[300]} />
            )}

            {type === 'switch' && (
                <Switch
                    value={value}
                    onValueChange={onPress}
                    trackColor={{ false: theme.colors.gray[200], true: theme.colors.primary[300] }}
                    thumbColor={value ? theme.colors.primary[500] : theme.colors.gray[400]}
                />
            )}

            {type === 'text' && (
                <Text color={theme.colors.gray[400]} variant="sm">{value}</Text>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.header} edges={['top']}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Feather name="chevron-left" size={28} color={theme.colors.gray[900]} />
                    </TouchableOpacity>
                    <Text variant="xl" weight="bold">Settings</Text>
                    <View style={{ width: 44 }} />
                </View>
            </SafeAreaView>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Account Section */}
                <View style={styles.section}>
                    <Text variant="xs" weight="bold" color={theme.colors.gray[400]} style={styles.sectionTitle}>
                        ACCOUNT
                    </Text>
                    <View style={styles.settingsGroup}>
                        {renderSettingItem({
                            icon: 'user',
                            label: 'Edit Profile',
                            onPress: () => navigation.navigate('EditProfile')
                        })}
                        {renderSettingItem({
                            icon: 'phone',
                            label: 'Phone Number',
                            type: 'text',
                            value: profile?.phone || 'Not set'
                        })}
                        {renderSettingItem({
                            icon: 'mail',
                            label: 'Email',
                            type: 'text',
                            value: profile?.email || 'Not set'
                        })}
                        {renderSettingItem({
                            icon: 'shield',
                            label: 'Verification Status',
                            type: 'text',
                            value: profile?.is_verified ? 'Verified' : 'Unverified',
                            color: profile?.is_verified ? theme.colors.success[600] : theme.colors.warning[600]
                        })}
                    </View>
                </View>

                {/* Notifications & Privacy */}
                <View style={styles.section}>
                    <Text variant="xs" weight="bold" color={theme.colors.gray[400]} style={styles.sectionTitle}>
                        PREFERENCES
                    </Text>
                    <View style={styles.settingsGroup}>
                        {renderSettingItem({
                            icon: 'bell',
                            label: 'Push Notifications',
                            type: 'switch',
                            value: notificationsEnabled,
                            onPress: (val: boolean) => setNotificationsEnabled(val)
                        })}
                        {renderSettingItem({
                            icon: 'eye-off',
                            label: 'Private Mode',
                            type: 'switch',
                            value: privacyMode,
                            onPress: (val: boolean) => setPrivacyMode(val)
                        })}
                        {renderSettingItem({
                            icon: 'globe',
                            label: 'Language',
                            type: 'text',
                            value: 'English (US)'
                        })}
                    </View>
                </View>

                {/* More Section */}
                <View style={styles.section}>
                    <Text variant="xs" weight="bold" color={theme.colors.gray[400]} style={styles.sectionTitle}>
                        SUPPORT & LEGAL
                    </Text>
                    <View style={styles.settingsGroup}>
                        {renderSettingItem({
                            icon: 'help-circle',
                            label: 'Help Center',
                            onPress: () => Linking.openURL('https://soulmatch.app/help')
                        })}
                        {renderSettingItem({
                            icon: 'book',
                            label: 'Terms of Service',
                            onPress: () => Linking.openURL('https://soulmatch.app/terms')
                        })}
                        {renderSettingItem({
                            icon: 'lock',
                            label: 'Privacy Policy',
                            onPress: () => Linking.openURL('https://soulmatch.app/privacy')
                        })}
                        {renderSettingItem({
                            icon: 'info',
                            label: 'About SoulMatch',
                            type: 'text',
                            value: 'v1.0.0'
                        })}
                    </View>
                </View>

                {/* Actions Section */}
                <View style={styles.section}>
                    <View style={styles.settingsGroup}>
                        {renderSettingItem({
                            icon: 'log-out',
                            label: 'Log Out',
                            color: theme.colors.error[500],
                            onPress: handleLogout
                        })}
                        {renderSettingItem({
                            icon: 'trash-2',
                            label: 'Delete Account',
                            color: theme.colors.error[600],
                            onPress: handleDeleteAccount
                        })}
                    </View>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.gray[50], // Faint background for contrast
    },
    header: {
        backgroundColor: theme.colors.white,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray[100],
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing[4],
        height: 56,
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
    },
    scrollContent: {
        paddingVertical: theme.spacing[4],
    },
    section: {
        marginBottom: theme.spacing[6],
    },
    sectionTitle: {
        paddingHorizontal: theme.spacing[6],
        marginBottom: theme.spacing[2],
        letterSpacing: 1,
    },
    settingsGroup: {
        backgroundColor: theme.colors.white,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: theme.colors.gray[100],
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: theme.spacing[4],
        paddingHorizontal: theme.spacing[6],
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray[50],
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing[4],
    },
});

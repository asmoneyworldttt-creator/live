import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Input, Avatar, Button } from '../../components/common';
import { theme } from '../../theme';
import { useChat, useDiscovery } from '../../hooks';
import { Feather } from '@expo/vector-icons';
import { supabase } from '../../api/supabase';

export default function CreateGroupScreen({ navigation }: any) {
    const { createGroup, isLoading: isCreating } = useChat();
    const [groupName, setGroupName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [matches, setMatches] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMatches = async () => {
        setIsLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch users with whom we have a mutual match
            // This is a simplified check for the demo
            const { data, error } = await supabase
                .from('connections')
                .select(`
                    id,
                    from_user_id,
                    to_user_id,
                    from_user:from_user_id(id, full_name, avatar_url),
                    to_user:to_user_id(id, full_name, avatar_url)
                `)
                .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
                .eq('status', 'accepted');

            if (error) throw error;

            const formattedMatches = data.map((match: any) => {
                const otherUser = match.from_user_id === user.id ? match.to_user : match.from_user;
                return otherUser;
            });

            setMatches(formattedMatches);
        } catch (error: any) {
            console.error('Error fetching matches:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMatches();
    }, []);

    const toggleUser = (userId: string) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
    };

    const handleCreateGroup = async () => {
        if (!groupName.trim()) {
            Alert.alert('Error', 'Please enter a group name');
            return;
        }
        if (selectedUsers.length < 2) {
            Alert.alert('Error', 'Please select at least 2 members');
            return;
        }

        try {
            const group = await createGroup(groupName, selectedUsers);
            navigation.replace('ChatDetail', { conversationId: group.id, isGroup: true, groupName: group.group_name });
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    const renderUserItem = ({ item }: { item: any }) => {
        const isSelected = selectedUsers.includes(item.id);
        return (
            <TouchableOpacity
                style={[styles.userItem, isSelected && styles.userItemActive]}
                onPress={() => toggleUser(item.id)}
            >
                <Avatar source={item.avatar_url} name={item.full_name} size="md" />
                <View style={styles.userInfo}>
                    <Text weight="semibold">{item.full_name}</Text>
                </View>
                <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                    {isSelected && <Feather name="check" size={14} color={theme.colors.white} />}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.header} edges={['top']}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Feather name="chevron-left" size={28} color={theme.colors.gray[900]} />
                    </TouchableOpacity>
                    <Text variant="xl" weight="bold">New Group</Text>
                    <TouchableOpacity
                        onPress={handleCreateGroup}
                        disabled={selectedUsers.length < 2 || !groupName || isCreating}
                    >
                        <Text
                            weight="bold"
                            color={selectedUsers.length >= 2 && groupName ? theme.colors.primary[500] : theme.colors.gray[300]}
                        >
                            Create
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <View style={styles.content}>
                <View style={styles.inputSection}>
                    <Input
                        placeholder="Group Name"
                        value={groupName}
                        onChangeText={setGroupName}
                        style={styles.nameInput}
                    />
                    <Text variant="xs" color={theme.colors.gray[400]} style={styles.selectionCount}>
                        {selectedUsers.length} members selected
                    </Text>
                </View>

                {isLoading ? (
                    <ActivityIndicator size="large" color={theme.colors.primary[500]} style={{ marginTop: 50 }} />
                ) : (
                    <FlatList
                        data={matches}
                        renderItem={renderUserItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <Text color={theme.colors.gray[400]}>No matches available to add</Text>
                            </View>
                        }
                    />
                )}
            </View>

            {isCreating && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={theme.colors.white} />
                    <Text color={theme.colors.white} weight="bold" style={{ marginTop: 10 }}>Creating Group...</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    header: {
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
    content: {
        flex: 1,
    },
    inputSection: {
        padding: theme.spacing[6],
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray[100],
    },
    nameInput: {
        fontSize: 18,
        borderBottomWidth: 0,
    },
    selectionCount: {
        marginTop: 8,
    },
    listContent: {
        paddingVertical: theme.spacing[2],
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing[6],
        paddingVertical: theme.spacing[3],
    },
    userItemActive: {
        backgroundColor: theme.colors.primary[50],
    },
    userInfo: {
        flex: 1,
        marginLeft: theme.spacing[4],
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: theme.colors.gray[300],
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxActive: {
        backgroundColor: theme.colors.primary[500],
        borderColor: theme.colors.primary[500],
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 50,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    }
});

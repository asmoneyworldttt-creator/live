import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Input, Avatar, Badge, Loader } from '../../components/common';
import { theme } from '../../theme';
import { useChat } from '../../hooks';
import { Feather } from '@expo/vector-icons';
import { formatRelativeTime } from '../../utils/dateUtils';

export default function ChatListScreen({ navigation }: any) {
    const { conversations, isLoading, loadConversations } = useChat();

    useEffect(() => {
        loadConversations();
    }, []);

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.conversationItem}
            onPress={() => navigation.navigate('ChatDetail', { conversationId: item.id, user: item.recipient })}
        >
            <Avatar
                source={item.recipient.avatar_url}
                name={item.recipient.full_name}
                size="lg"
                showStatus
                isOnline={item.recipient.is_online}
            />
            <View style={styles.conversationContent}>
                <View style={styles.conversationHeader}>
                    <Text weight="bold" variant="lg" numberOfLines={1}>
                        {item.recipient.full_name}
                    </Text>
                    <Text variant="xs" color={theme.colors.gray[400]}>
                        {formatRelativeTime(item.last_message_at)}
                    </Text>
                </View>
                <View style={styles.conversationFooter}>
                    <Text
                        variant="sm"
                        color={item.unread_count > 0 ? theme.colors.gray[900] : theme.colors.gray[500]}
                        weight={item.unread_count > 0 ? 'semibold' : 'normal'}
                        numberOfLines={1}
                        style={styles.lastMessage}
                    >
                        {item.last_message}
                    </Text>
                    {item.unread_count > 0 && (
                        <Badge count={item.unread_count} variant="primary" size="sm" />
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text variant="3xl" weight="bold">Messages</Text>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => navigation.navigate('CreateGroup')}
                >
                    <Feather name="edit" size={20} color={theme.colors.gray[600]} />
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <Input
                    placeholder="Search messages..."
                    leftIcon="search"
                    style={styles.searchInput}
                />
            </View>

            {isLoading && conversations.length === 0 ? (
                <Loader />
            ) : (
                <FlatList
                    data={conversations}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={loadConversations} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <View style={styles.emptyIcon}>
                                <Feather name="message-square" size={48} color={theme.colors.gray[300]} />
                            </View>
                            <Text variant="lg" weight="bold" color={theme.colors.gray[600]}>
                                No messages yet
                            </Text>
                            <Text color={theme.colors.gray[400]} style={styles.emptySub}>
                                When you match with someone,{'\n'}you can start a conversation here.
                            </Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing[6],
        paddingVertical: theme.spacing[4],
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.gray[50],
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchContainer: {
        paddingHorizontal: theme.spacing[6],
        marginBottom: theme.spacing[4],
    },
    searchInput: {
        height: 45,
    },
    listContent: {
        paddingBottom: theme.spacing[10],
    },
    conversationItem: {
        flexDirection: 'row',
        paddingHorizontal: theme.spacing[6],
        paddingVertical: theme.spacing[3],
        alignItems: 'center',
    },
    conversationContent: {
        flex: 1,
        marginLeft: theme.spacing[4],
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray[100],
        paddingBottom: theme.spacing[3],
    },
    conversationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    conversationFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    lastMessage: {
        flex: 1,
        marginRight: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
        paddingHorizontal: 40,
    },
    emptyIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: theme.colors.gray[50],
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptySub: {
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 20,
    },
});

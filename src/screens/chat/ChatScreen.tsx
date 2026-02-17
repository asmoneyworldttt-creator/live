import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Avatar, Loader, Button } from '../../components/common';
import { MessageBubble, ChatInput, TypingIndicator } from '../../components/chat';
import { theme } from '../../theme';
import { useChat, useAuth, useCall } from '../../hooks';
import { Feather } from '@expo/vector-icons';

export default function ChatScreen({ route, navigation }: any) {
    const { conversationId, user } = route.params;
    const {
        messages,
        isLoading,
        isSending,
        isTyping,
        send,
        sendMedia,
        markAsRead,
        setTyping,
        setActiveConversation,
        loadMessages
    } = useChat(conversationId);

    const { user: currentUser } = useAuth();
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        if (conversationId) {
            loadMessages(conversationId);
            markAsRead(conversationId);
        }
    }, [conversationId]);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages]);

    const handleSend = (text: string) => {
        send(text);
    };

    const handleSendImage = (uri: string) => {
        sendMedia(uri, 'image');
    };

    const handleTypingStart = () => {
        if (conversationId) setTyping(conversationId, true);
    };

    const handleTypingEnd = () => {
        if (conversationId) setTyping(conversationId, false);
    };

    const { startCall } = useCall();

    const handleCall = async (type: 'audio' | 'video') => {
        await startCall(user, type);
        navigation.navigate('VideoCall');
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Feather name="chevron-left" size={28} color={theme.colors.gray[900]} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.userInfo}
                    onPress={() => navigation.navigate('OtherProfile', { userId: user.id })}
                >
                    <Avatar
                        source={user.avatar_url}
                        name={user.full_name}
                        size="md"
                        showStatus
                        isOnline={user.is_online}
                    />
                    <View style={styles.nameContainer}>
                        <Text weight="bold" variant="lg">{user.full_name}</Text>
                        <Text variant="xs" color={user.is_online ? theme.colors.success[500] : theme.colors.gray[400]}>
                            {user.is_online ? 'Online' : 'Offline'}
                        </Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.actions}>
                    <TouchableOpacity onPress={() => handleCall('audio')} style={styles.iconButton}>
                        <Feather name="phone" size={20} color={theme.colors.gray[700]} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleCall('video')} style={styles.iconButton}>
                        <Feather name="video" size={20} color={theme.colors.gray[700]} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Messages */}
            <View style={styles.messageContainer}>
                {isLoading && messages.length === 0 ? (
                    <Loader />
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={({ item }) => (
                            <MessageBubble
                                message={item}
                                isMine={item.sender_id === currentUser?.id}
                            />
                        )}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        ListFooterComponent={
                            isTyping ? <TypingIndicator /> : null
                        }
                    />
                )}
            </View>

            {/* Input */}
            <ChatInput
                onSendMessage={handleSend}
                onSendImage={handleSendImage}
                onSendVoice={(uri) => sendMedia(uri, 'voice')}
                onTypingStart={handleTypingStart}
                onTypingEnd={handleTypingEnd}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.gray[50],
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing[4],
        paddingVertical: theme.spacing[3],
        backgroundColor: theme.colors.white,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray[100],
    },
    backButton: {
        padding: 4,
    },
    userInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
    },
    nameContainer: {
        marginLeft: 12,
    },
    actions: {
        flexDirection: 'row',
    },
    iconButton: {
        padding: 8,
        marginLeft: 4,
    },
    messageContainer: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: theme.spacing[4],
        paddingVertical: theme.spacing[4],
    },
});

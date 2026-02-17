import { useEffect, useCallback } from 'react';
import { useChatStore, Conversation } from '../store';

/**
 * Hook for chat functionality
 */
export const useChat = (conversationId?: string) => {
    const {
        conversations,
        activeConversation,
        messages,
        isLoading,
        isSending,
        isTyping,
        error,
        loadConversations,
        loadMessages,
        sendMessage,
        markAsRead,
        setActiveConversation,
        deleteConversation,
        setTyping,
        createConversation,
        createGroup,
        subscribeToMessages,
        unsubscribeFromMessages,
    } = useChatStore();

    // Load conversations on mount
    useEffect(() => {
        loadConversations();
    }, []);

    // Subscribe to messages for active conversation
    useEffect(() => {
        if (conversationId) {
            subscribeToMessages(conversationId);
            return () => unsubscribeFromMessages();
        }
    }, [conversationId]);

    // Get messages for current conversation
    const currentMessages = conversationId ? messages[conversationId] || [] : [];

    // Send text message
    const send = useCallback(
        async (content: string) => {
            if (!conversationId) return;
            await sendMessage(conversationId, content);
        },
        [conversationId, sendMessage]
    );

    // Send media message
    const sendMedia = useCallback(
        async (mediaUrl: string, type: 'image' | 'video' | 'voice') => {
            if (!conversationId) return;
            await sendMessage(conversationId, '', type, mediaUrl);
        },
        [conversationId, sendMessage]
    );

    // Start new conversation
    const startConversation = useCallback(
        async (userId: string): Promise<Conversation> => {
            const conversation = await createConversation(userId);
            setActiveConversation(conversation);
            return conversation;
        },
        [createConversation, setActiveConversation]
    );

    // Get unread count
    const unreadCount = conversations.reduce((sum, conv) => sum + conv.unread_count, 0);

    return {
        // State
        conversations,
        activeConversation,
        messages: currentMessages,
        isLoading,
        isSending,
        isTyping: conversationId ? isTyping[conversationId] : false,
        error,
        unreadCount,

        // Actions
        loadConversations,
        loadMessages,
        send,
        sendMedia,
        markAsRead,
        setActiveConversation,
        deleteConversation,
        setTyping,
        startConversation,
        createGroup,
    };
};

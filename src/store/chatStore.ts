import { create } from 'zustand';
import { supabase } from '../api/supabase';

export interface Message {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    message_type: 'text' | 'image' | 'video' | 'voice' | 'gif' | 'sticker';
    media_url?: string;
    is_read: boolean;
    created_at: string;
    sender?: {
        id: string;
        full_name: string;
        avatar_url?: string;
    };
}

export interface Conversation {
    id: string;
    participant_ids: string[];
    last_message?: Message;
    unread_count: number;
    is_group: boolean;
    group_name?: string;
    group_avatar?: string;
    created_at: string;
    updated_at: string;
    other_user?: {
        id: string;
        full_name: string;
        avatar_url?: string;
        is_online: boolean;
    };
}

interface ChatState {
    // State
    conversations: Conversation[];
    activeConversation: Conversation | null;
    messages: Record<string, Message[]>;
    isLoading: boolean;
    isSending: boolean;
    isTyping: Record<string, boolean>;
    error: string | null;

    // Actions
    loadConversations: () => Promise<void>;
    loadMessages: (conversationId: string) => Promise<void>;
    sendMessage: (conversationId: string, content: string, type?: Message['message_type'], mediaUrl?: string) => Promise<void>;
    markAsRead: (conversationId: string) => Promise<void>;
    setActiveConversation: (conversation: Conversation | null) => void;
    deleteConversation: (conversationId: string) => Promise<void>;
    setTyping: (conversationId: string, isTyping: boolean) => void;
    createConversation: (userId: string) => Promise<Conversation>;
    createGroup: (name: string, participantIds: string[], avatarUrl?: string) => Promise<Conversation>;
    subscribeToMessages: (conversationId: string) => void;
    unsubscribeFromMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    // Initial state
    conversations: [],
    activeConversation: null,
    messages: {},
    isLoading: false,
    isSending: false,
    isTyping: {},
    error: null,

    // Load conversations
    loadConversations: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('conversations')
                .select(`
                    *,
                    messages:messages(*, sender:users(*)),
                    participants:conversation_participants(user:users(*))
                `)
                .contains('participant_ids', [user.id])
                .order('updated_at', { ascending: false });

            if (error) throw error;

            // Process conversations
            const conversations = data.map((conv: any) => ({
                ...conv,
                last_message: conv.messages?.[0],
                other_user: conv.participants?.find((p: any) => p.user.id !== user.id)?.user,
            }));

            set({ conversations });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    // Load messages for a conversation
    loadMessages: async (conversationId) => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*, sender:users(*)')
                .eq('conversation_id', conversationId)
                .order('created_at', { ascending: true });

            if (error) throw error;

            set((state) => ({
                messages: {
                    ...state.messages,
                    [conversationId]: data,
                },
            }));
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    // Send message
    sendMessage: async (conversationId, content, type = 'text', mediaUrl) => {
        set({ isSending: true, error: null });
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('messages')
                .insert({
                    conversation_id: conversationId,
                    sender_id: user.id,
                    content,
                    message_type: type,
                    media_url: mediaUrl,
                })
                .select('*, sender:users(*)')
                .single();

            if (error) throw error;

            // Add message to local state
            set((state) => ({
                messages: {
                    ...state.messages,
                    [conversationId]: [
                        ...(state.messages[conversationId] || []),
                        data,
                    ],
                },
            }));

            // Update conversation's updated_at
            await supabase
                .from('conversations')
                .update({ updated_at: new Date().toISOString() })
                .eq('id', conversationId);

        } catch (error: any) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ isSending: false });
        }
    },

    // Mark conversation as read
    markAsRead: async (conversationId) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            await supabase
                .from('messages')
                .update({ is_read: true })
                .eq('conversation_id', conversationId)
                .neq('sender_id', user.id);

            // Update local state
            set((state) => ({
                conversations: state.conversations.map((conv) =>
                    conv.id === conversationId
                        ? { ...conv, unread_count: 0 }
                        : conv
                ),
            }));
        } catch (error: any) {
            console.error('Error marking as read:', error);
        }
    },

    // Set active conversation
    setActiveConversation: (conversation) => {
        set({ activeConversation: conversation });
        if (conversation) {
            get().loadMessages(conversation.id);
            get().markAsRead(conversation.id);
        }
    },

    // Delete conversation
    deleteConversation: async (conversationId) => {
        try {
            const { error } = await supabase
                .from('conversations')
                .delete()
                .eq('id', conversationId);

            if (error) throw error;

            set((state) => ({
                conversations: state.conversations.filter((c) => c.id !== conversationId),
                activeConversation: state.activeConversation?.id === conversationId
                    ? null
                    : state.activeConversation,
            }));
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        }
    },

    // Set typing indicator
    setTyping: (conversationId, isTyping) => {
        set((state) => ({
            isTyping: {
                ...state.isTyping,
                [conversationId]: isTyping,
            },
        }));
    },

    // Create new conversation
    createConversation: async (userId) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            // Check if conversation already exists
            const { data: existing } = await supabase
                .from('conversations')
                .select('*')
                .contains('participant_ids', [user.id, userId])
                .eq('is_group', false)
                .single();

            if (existing) return existing;

            // Create new conversation
            const { data, error } = await supabase
                .from('conversations')
                .insert({
                    participant_ids: [user.id, userId],
                    is_group: false,
                })
                .select()
                .single();

            if (error) throw error;

            return data;
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        }
    },

    // Create group conversation
    createGroup: async (name, participantIds, avatarUrl) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            // Include current user in participants
            const finalParticipants = [...new Set([user.id, ...participantIds])];

            const { data, error } = await supabase
                .from('conversations')
                .insert({
                    group_name: name,
                    group_avatar: avatarUrl,
                    participant_ids: finalParticipants,
                    is_group: true,
                    created_by: user.id
                })
                .select()
                .single();

            if (error) throw error;

            // Add to local state
            set((state) => ({
                conversations: [data, ...state.conversations]
            }));

            return data;
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        }
    },

    // Subscribe to real-time messages
    subscribeToMessages: (conversationId) => {
        supabase
            .channel(`messages:${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`,
                },
                (payload) => {
                    set((state) => ({
                        messages: {
                            ...state.messages,
                            [conversationId]: [
                                ...(state.messages[conversationId] || []),
                                payload.new as Message,
                            ],
                        },
                    }));
                }
            )
            .subscribe();
    },

    // Unsubscribe from messages
    unsubscribeFromMessages: () => {
        supabase.removeAllChannels();
    },
}));

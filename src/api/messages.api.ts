import { supabase } from './supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export const messagesApi = {
    // Send a message
    sendMessage: async (conversationId: string, payload: {
        messageType: 'text' | 'image' | 'voice' | 'video' | 'gift';
        content: string;
        mediaUrl?: string;
        isViewOnce?: boolean;
        selfDestructAt?: string;
    }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase.from('messages').insert({
            conversation_id: conversationId,
            sender_id: user.id,
            message_type: payload.messageType,
            content_encrypted: payload.content,
            media_url: payload.mediaUrl,
            is_view_once: payload.isViewOnce || false,
            self_destruct_at: payload.selfDestructAt
        }).select().single();

        if (error) throw error;

        // Update conversation last activity
        await supabase.from('conversations')
            .update({ last_message_id: data.id, last_activity: new Date().toISOString() })
            .eq('id', conversationId);

        return data;
    },

    // Subscribe to real-time messages
    subscribeToConversation: (
        conversationId: string,
        callback: (payload: any) => void
    ) => {
        return supabase
            .channel(`chat:${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`,
                },
                (payload: any) => callback(payload)
            )
            .subscribe();
    },

    // Mark message as viewed
    markViewOnceViewed: async (messageId: string) => {
        const { error } = await supabase.from('messages')
            .update({ viewed_at: new Date().toISOString() })
            .eq('id', messageId)
            .is('viewed_at', null);
        if (error) throw error;
    }
};

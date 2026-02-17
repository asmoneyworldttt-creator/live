import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { supabaseAdmin } from '../config/supabase';
import { AppError } from '../middleware/error.middleware';

export const chatController = {
    // GET /chats
    getConversations: async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user?.id;
            const { data, error } = await supabaseAdmin
                .from('conversations')
                .select(`
                    *,
                    last_message:messages!last_message_id(*)
                `)
                .contains('participant_ids', [userId])
                .order('updated_at', { ascending: false });

            if (error) throw new AppError(error.message, 400);
            res.status(200).json(data);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },

    // GET /chats/:id/messages
    getMessages: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const { data, error } = await supabaseAdmin
                .from('messages')
                .select('*')
                .eq('conversation_id', id)
                .order('created_at', { ascending: true });

            if (error) throw new AppError(error.message, 400);
            res.status(200).json(data);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },

    // POST /chats/:id/messages
    sendMessage: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const { content, message_type, metadata } = req.body;
            const userId = req.user?.id;

            const { data, error } = await supabaseAdmin
                .from('messages')
                .insert({
                    conversation_id: id,
                    sender_id: userId,
                    content,
                    message_type,
                    metadata
                })
                .select()
                .single();

            if (error) throw new AppError(error.message, 400);

            // Update conversation last message
            await supabaseAdmin
                .from('conversations')
                .update({
                    last_message_id: data.id,
                    updated_at: new Date()
                })
                .eq('id', id);

            res.status(201).json(data);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },

    // POST /chats/group
    createGroup: async (req: AuthRequest, res: Response) => {
        try {
            const { name, participant_ids, avatar_url } = req.body;
            const userId = req.user?.id;

            const finalParticipants = [...new Set([userId, ...participant_ids])];

            const { data, error } = await supabaseAdmin
                .from('conversations')
                .insert({
                    group_name: name,
                    group_avatar: avatar_url,
                    participant_ids: finalParticipants,
                    is_group: true,
                    created_by: userId
                })
                .select()
                .single();

            if (error) throw new AppError(error.message, 400);
            res.status(201).json(data);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
};

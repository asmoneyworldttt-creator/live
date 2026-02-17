import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { supabaseAdmin } from '../config/supabase';
import { AppError } from '../middleware/error.middleware';

export const usersController = {
    // GET /users/me
    getMe: async (req: AuthRequest, res: Response) => {
        try {
            const { data, error } = await supabaseAdmin
                .from('users')
                .select('*, user_media(*)')
                .eq('id', req.user?.id)
                .single();

            if (error) throw new AppError(error.message, 400);
            res.status(200).json(data);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },

    // PUT /users/me
    updateProfile: async (req: AuthRequest, res: Response) => {
        try {
            const updates = req.body;
            delete updates.id; // Prevent ID change
            delete updates.email; // Email should be handled via auth service

            const { data, error } = await supabaseAdmin
                .from('users')
                .update(updates)
                .eq('id', req.user?.id)
                .select()
                .single();

            if (error) throw new AppError(error.message, 400);
            res.status(200).json(data);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },

    // GET /users/:id
    getUserProfile: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const { data, error } = await supabaseAdmin
                .from('users')
                .select('*, user_media(*)')
                .eq('id', id)
                .single();

            if (error) throw new AppError('User not found', 404);
            res.status(200).json(data);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },

    // POST /users/verify
    requestVerification: async (req: AuthRequest, res: Response) => {
        try {
            const { data, error } = await supabaseAdmin
                .from('verification_requests')
                .insert({
                    user_id: req.user?.id,
                    status: 'pending'
                })
                .select()
                .single();

            if (error) throw new AppError(error.message, 400);
            res.status(201).json({ message: 'Verification request submitted', data });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },

    // POST /users/report
    reportUser: async (req: AuthRequest, res: Response) => {
        try {
            const { reported_user_id, reason, description } = req.body;
            const { error } = await supabaseAdmin
                .from('reports')
                .insert({
                    reporter_id: req.user?.id,
                    reported_user_id,
                    reason,
                    description,
                    status: 'pending'
                });

            if (error) throw new AppError(error.message, 400);
            res.status(201).json({ message: 'Report submitted successfully' });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },

    // POST /users/block
    blockUser: async (req: AuthRequest, res: Response) => {
        try {
            const { blocked_user_id } = req.body;
            const { error } = await supabaseAdmin
                .from('blocks')
                .insert({
                    blocker_id: req.user?.id,
                    blocked_user_id
                });

            if (error) throw new AppError(error.message, 400);
            res.status(201).json({ message: 'User blocked successfully' });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
};

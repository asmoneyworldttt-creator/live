import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { supabaseAdmin } from '../config/supabase';
import { AppError } from '../middleware/error.middleware';

export const adminController = {
    // GET /admin/users
    getAllUsers: async (req: AuthRequest, res: Response) => {
        try {
            const { data, error } = await supabaseAdmin
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw new AppError(error.message, 400);
            res.status(200).json(data);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },

    // PUT /admin/users/:id/verify
    verifyUser: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const { is_verified } = req.body;

            const { data, error } = await supabaseAdmin
                .from('users')
                .update({ is_verified })
                .eq('id', id)
                .select()
                .single();

            if (error) throw new AppError(error.message, 400);
            res.status(200).json(data);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },

    // GET /admin/reports
    getReports: async (req: AuthRequest, res: Response) => {
        try {
            const { data, error } = await supabaseAdmin
                .from('reports')
                .select(`
                    *,
                    reporter:users!reporter_id(full_name),
                    reported:users!reported_user_id(full_name)
                `)
                .order('created_at', { ascending: false });

            if (error) throw new AppError(error.message, 400);
            res.status(200).json(data);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },

    // GET /admin/withdrawals
    getWithdrawals: async (req: AuthRequest, res: Response) => {
        try {
            const { data, error } = await supabaseAdmin
                .from('withdrawals')
                .select(`
                    *,
                    user:users(full_name, email)
                `)
                .order('created_at', { ascending: false });

            if (error) throw new AppError(error.message, 400);
            res.status(200).json(data);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },

    // PUT /admin/withdrawals/:id/approve
    approveWithdrawal: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const { status } = req.body; // 'approved' or 'rejected'

            const { data: withdrawal } = await supabaseAdmin.from('withdrawals').select('*').eq('id', id).single();
            if (!withdrawal) throw new AppError('Withdrawal not found', 404);

            const { data, error } = await supabaseAdmin
                .from('withdrawals')
                .update({ status, processed_at: new Date() })
                .eq('id', id)
                .select()
                .single();

            if (error) throw new AppError(error.message, 400);

            // If rejected, increment balance back? (Depends on business logic)
            // If approved, we assume funds are sent.

            res.status(200).json(data);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
};

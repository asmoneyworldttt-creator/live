import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { supabaseAdmin } from '../config/supabase';
import { AppError } from '../middleware/error.middleware';

export const premiumController = {
    // GET /premium/plans
    getPlans: async (req: AuthRequest, res: Response) => {
        try {
            const { data, error } = await supabaseAdmin
                .from('premium_plans')
                .select('*')
                .eq('is_active', true);

            if (error) throw new AppError(error.message, 400);
            res.status(200).json(data);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },

    // GET /premium/status
    getStatus: async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user?.id;
            const { data, error } = await supabaseAdmin
                .from('user_subscriptions')
                .select('*, premium_plans(*)')
                .eq('user_id', userId)
                .eq('status', 'active')
                .single();

            if (error && error.code !== 'PGRST116') throw new AppError(error.message, 400);

            res.status(200).json({
                is_premium: !!data,
                subscription: data || null
            });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },

    // POST /premium/subscribe
    subscribe: async (req: AuthRequest, res: Response) => {
        try {
            const { plan_id, payment_method_id } = req.body;
            const userId = req.user?.id;

            // Mock subscription logic
            const { data: plan } = await supabaseAdmin.from('premium_plans').select('*').eq('id', plan_id).single();
            if (!plan) throw new AppError('Invalid plan', 400);

            const expiryDate = new Date();
            expiryDate.setMonth(expiryDate.getMonth() + 1);

            const { data, error } = await supabaseAdmin
                .from('user_subscriptions')
                .insert({
                    user_id: userId,
                    plan_id,
                    status: 'active',
                    current_period_end: expiryDate
                })
                .select()
                .single();

            if (error) throw new AppError(error.message, 400);

            // Update user record premium flag
            await supabaseAdmin.from('users').update({ is_premium: true }).eq('id', userId);

            res.status(201).json(data);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
};

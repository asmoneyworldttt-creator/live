import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { supabaseAdmin } from '../config/supabase';
import { AppError } from '../middleware/error.middleware';

export const walletController = {
    // GET /wallet/balance
    getBalance: async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user?.id;
            const { data, error } = await supabaseAdmin
                .from('wallets')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error) throw new AppError(error.message, 400);
            res.status(200).json(data);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },

    // GET /wallet/transactions
    getTransactions: async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user?.id;
            const { data, error } = await supabaseAdmin
                .from('transactions')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw new AppError(error.message, 400);
            res.status(200).json(data);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },

    // POST /wallet/withdraw
    requestWithdrawal: async (req: AuthRequest, res: Response) => {
        try {
            const { amount, method, destination } = req.body;
            const userId = req.user?.id;

            // 1. Check Creator Profile balance
            const { data: creator } = await supabaseAdmin
                .from('creator_profiles')
                .select('withdrawable_balance')
                .eq('user_id', userId)
                .single();

            if (!creator || creator.withdrawable_balance < amount) {
                throw new AppError('Insufficient withdrawable balance', 400);
            }

            // 2. Create withdrawal record
            const { data: withdrawal, error } = await supabaseAdmin
                .from('withdrawals')
                .insert({
                    user_id: userId,
                    amount,
                    method,
                    destination,
                    status: 'pending'
                })
                .select()
                .single();

            if (error) throw new AppError(error.message, 400);

            // 3. Deduct from pending withdrawal (backend RPC logic handled via DB usually, but we track here)
            await supabaseAdmin.rpc('increment_pending_withdrawal', {
                target_user_id: userId,
                dec_amount: -amount
            });

            res.status(201).json({ message: 'Withdrawal request submitted', withdrawal });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
};

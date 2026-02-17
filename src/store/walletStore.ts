import { create } from 'zustand';
import { supabase } from '../api/supabase';

export interface Transaction {
    id: string;
    user_id: string;
    amount: number;
    type: 'purchase' | 'earned' | 'spent' | 'bonus' | 'withdrawal';
    description: string;
    balance_after: number;
    created_at: string;
}

export interface CoinPackage {
    id: string;
    name: string;
    coins: number;
    price: string;
    bonus?: string;
    is_popular?: boolean;
}

interface WalletState {
    balance: number;
    withdrawableBalance: number;
    transactions: Transaction[];
    isLoading: boolean;
    error: string | null;

    // Actions
    loadWalletData: () => Promise<void>;
    purchasePackage: (pkg: CoinPackage) => Promise<void>;
    requestWithdrawal: (amount: number, method: string, details: string) => Promise<void>;
}

export const useWalletStore = create<WalletState>((set, get) => ({
    balance: 0,
    withdrawableBalance: 0,
    transactions: [],
    isLoading: false,
    error: null,

    loadWalletData: async () => {
        set({ isLoading: true });
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            // 1. Get Balances
            const { data: balanceData, error: balanceError } = await supabase.rpc('get_user_balance', {
                user_id: user.id
            });
            if (balanceError) throw balanceError;

            // 2. Get Transactions
            const { data: txData, error: txError } = await supabase.rpc('get_coin_transactions', {
                user_id: user.id,
                limit_count: 50
            });
            if (txError) throw txError;

            set({
                balance: balanceData[0]?.coin_balance || 0,
                withdrawableBalance: balanceData[0]?.withdrawable_balance || 0,
                transactions: txData || [],
                error: null
            });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    purchasePackage: async (pkg) => {
        set({ isLoading: true });
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            // In a real app, you'd integrate Stripe/Apple Pay here
            // This MOCK adds coins directly via the RPC
            const { error } = await supabase.rpc('add_coins', {
                user_id: user.id,
                amount: pkg.coins,
                description: `Purchase: ${pkg.name} (${pkg.coins} coins)`
            });

            if (error) throw error;

            await get().loadWalletData();
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    requestWithdrawal: async (amount, method, details) => {
        set({ isLoading: true });
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            // Insert withdrawal request
            const { error } = await supabase.from('withdrawal_requests').insert({
                user_id: user.id,
                amount_usd: amount,
                method,
                account_details: { details },
                status: 'pending'
            });

            if (error) throw error;

            // Optional: The deductible logic for withdrawable_balance should be handled by a trigger/RPC on the backend
            // For now, refreshed manually or via backend state change
            await get().loadWalletData();
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    }
}));

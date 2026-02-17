import { supabase } from './supabase';

export interface CoinPackage {
    id: string;
    coins: number;
    price: string;
    label?: string;
}

export interface Transaction {
    id: string;
    type: 'purchase' | 'earned' | 'spent' | 'bonus' | 'withdrawal';
    amount: number;
    description: string;
    created_at: string;
}

export const PACKAGES: CoinPackage[] = [
    { id: 'p1', coins: 100, price: '$0.99' },
    { id: 'p2', coins: 550, price: '$4.99', label: 'Popular' },
    { id: 'p3', coins: 1200, price: '$9.99' },
    { id: 'p4', coins: 3000, price: '$24.99', label: 'Best Value' },
];

export const walletApi = {
    getBalance: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('users')
            .select('coin_balance')
            .eq('id', user.id)
            .single();

        if (error) throw error;
        return data.coin_balance;
    },

    getTransactions: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('coin_transactions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) throw error;
        return data as Transaction[];
    },

    purchasePackage: async (packageId: string) => {
        // MOCK PURCHASE - In production, verify IAP receipt here
        const pkg = PACKAGES.find(p => p.id === packageId);
        if (!pkg) throw new Error('Invalid package');

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        try {
            // Call RPC to add coins safely (atomic transaction)
            const { error } = await supabase.rpc('add_coins', {
                user_id: user.id,
                amount: pkg.coins,
                description: `Purchased ${pkg.coins} coins for ${pkg.price}`
            });

            if (error) throw error;

            console.log(`✅ Successfully purchased ${pkg.coins} coins`);
            return { success: true, coins: pkg.coins };
        } catch (error) {
            console.error('Purchase error:', error);
            throw new Error('Failed to process purchase. Please try again.');
        }
    }
};

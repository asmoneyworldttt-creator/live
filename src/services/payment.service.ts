import { supabase } from '../api/supabase';

// Stripe configuration
const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3000';

export const paymentService = {
    /**
     * Create payment intent for coin purchase
     */
    createPaymentIntent: async (packageId: string, amount: number): Promise<{
        clientSecret: string;
        paymentIntentId: string;
    } | null> => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const response = await fetch(`${BACKEND_URL}/api/payments/create-intent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    packageId,
                    amount,
                }),
            });

            if (!response.ok) throw new Error('Failed to create payment intent');

            const data = await response.json();
            return {
                clientSecret: data.clientSecret,
                paymentIntentId: data.paymentIntentId,
            };
        } catch (error) {
            console.error('Error creating payment intent:', error);
            return null;
        }
    },

    /**
     * Confirm payment (called after successful payment)
     */
    confirmPayment: async (paymentIntentId: string, packageId: string): Promise<boolean> => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const response = await fetch(`${BACKEND_URL}/api/payments/confirm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    paymentIntentId,
                    packageId,
                }),
            });

            if (!response.ok) throw new Error('Failed to confirm payment');

            const data = await response.json();
            return data.success;
        } catch (error) {
            console.error('Error confirming payment:', error);
            return false;
        }
    },

    /**
     * Process withdrawal (for creators)
     */
    processWithdrawal: async (
        amount: number,
        method: string,
        accountDetails: any
    ): Promise<boolean> => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const response = await fetch(`${BACKEND_URL}/api/payments/withdraw`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    amount,
                    method,
                    accountDetails,
                }),
            });

            if (!response.ok) throw new Error('Failed to process withdrawal');

            const data = await response.json();
            return data.success;
        } catch (error) {
            console.error('Error processing withdrawal:', error);
            return false;
        }
    },

    /**
     * Get payment history
     */
    getPaymentHistory: async (): Promise<any[]> => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('coin_transactions')
                .select('*')
                .eq('user_id', user.id)
                .eq('type', 'purchase')
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;

            return data || [];
        } catch (error) {
            console.error('Error fetching payment history:', error);
            return [];
        }
    },
};

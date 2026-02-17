import { create } from 'zustand';
import { supabase } from '../api/supabase';

export interface SubscriptionPlan {
    id: string;
    name: string;
    price: number;
    interval: 'monthly' | 'yearly';
    features: string[];
    is_popular?: boolean;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
    {
        id: 'premium_monthly',
        name: 'Monthly',
        price: 9.99,
        interval: 'monthly',
        features: [
            'Unlimited Likes',
            'See who liked you',
            'Rewind last swipe',
            '5 Super Likes per day',
            '1 Profile Boost per month',
            'No Ads'
        ]
    },
    {
        id: 'premium_yearly',
        name: 'Yearly',
        price: 59.99,
        interval: 'yearly',
        is_popular: true,
        features: [
            'All Monthly features',
            'Save 50% compared to monthly',
            'Priority Support',
            'Exclusive Premium Badge'
        ]
    }
];

interface PremiumState {
    subscription: any | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchSubscription: () => Promise<void>;
    subscribe: (planId: string) => Promise<void>;
    cancelSubscription: () => Promise<void>;
}

export const usePremiumStore = create<PremiumState>((set) => ({
    subscription: null,
    isLoading: false,
    error: null,

    fetchSubscription: async () => {
        set({ isLoading: true });
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', user.id)
                .eq('is_active', true)
                .maybeSingle();

            if (error) throw error;
            set({ subscription: data, error: null });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    subscribe: async (planId: string) => {
        set({ isLoading: true });
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
            if (!plan) throw new Error('Invalid plan');

            // In a real app, this would involve Stripe/Apple Pay checkout
            // MOCK: Directly create a subscription record
            const expiresAt = new Date();
            if (plan.interval === 'monthly') expiresAt.setMonth(expiresAt.getMonth() + 1);
            else expiresAt.setFullYear(expiresAt.getFullYear() + 1);

            const { error } = await supabase
                .from('subscriptions')
                .insert({
                    user_id: user.id,
                    plan: planId,
                    price_paid: plan.price,
                    expires_at: expiresAt.toISOString(),
                    is_active: true
                });

            if (error) throw error;

            // Also update the user's is_premium status
            const { error: userError } = await supabase
                .from('users')
                .update({ is_premium: true, premium_expires_at: expiresAt.toISOString() })
                .eq('id', user.id);

            if (userError) throw userError;

            await usePremiumStore.getState().fetchSubscription();
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    cancelSubscription: async () => {
        set({ isLoading: true });
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { error } = await supabase
                .from('subscriptions')
                .update({ auto_renew: false })
                .eq('user_id', user.id)
                .eq('is_active', true);

            if (error) throw error;
            await usePremiumStore.getState().fetchSubscription();
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    }
}));

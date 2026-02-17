import { useCallback } from 'react';
import { usePremiumStore, SUBSCRIPTION_PLANS, SubscriptionPlan } from '../store/premiumStore';

export const usePremium = () => {
    const {
        subscription,
        isLoading,
        error,
        fetchSubscription,
        subscribe,
        cancelSubscription,
    } = usePremiumStore();

    const loadPremium = useCallback(async () => {
        await fetchSubscription();
    }, [fetchSubscription]);

    const buyPremium = useCallback(async (planId: string) => {
        return await subscribe(planId);
    }, [subscribe]);

    const stopAutoRenew = useCallback(async () => {
        await cancelSubscription();
    }, [cancelSubscription]);

    return {
        isPremium: !!subscription,
        subscription,
        plans: SUBSCRIPTION_PLANS,
        isLoading,
        error,
        loadPremium,
        buyPremium,
        stopAutoRenew,
    };
};

import { useCallback } from 'react';
import { useWalletStore, CoinPackage } from '../store/walletStore';

export const useWallet = () => {
    const {
        balance,
        withdrawableBalance,
        transactions,
        isLoading,
        error,
        loadWalletData,
        purchasePackage,
        requestWithdrawal,
    } = useWalletStore();

    const fetchWallet = useCallback(async () => {
        await loadWalletData();
    }, [loadWalletData]);

    const buyCoins = useCallback(async (pkg: CoinPackage) => {
        return await purchasePackage(pkg);
    }, [purchasePackage]);

    const withdraw = useCallback(async (amount: number, method: string, details: string) => {
        return await requestWithdrawal(amount, method, details);
    }, [requestWithdrawal]);

    return {
        balance,
        withdrawableBalance,
        transactions,
        isLoading,
        error,
        fetchWallet,
        buyCoins,
        withdraw,
    };
};

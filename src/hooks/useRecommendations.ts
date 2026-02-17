import { useCallback } from 'react';
import { useRecommendationStore } from '../store/recommendationStore';

export const useRecommendations = () => {
    const {
        topMatches,
        smartMatch,
        isLoading,
        error,
        loadRecommendations,
        loadSmartMatch,
    } = useRecommendationStore();

    const getTopMatches = useCallback(async () => {
        await loadRecommendations();
    }, [loadRecommendations]);

    const getSmartMatch = useCallback(async () => {
        await loadSmartMatch();
    }, [loadSmartMatch]);

    return {
        topMatches,
        smartMatch,
        isLoading,
        error,
        getTopMatches,
        getSmartMatch,
    };
};

import { useCallback } from 'react';
import { useExploreStore } from '../store/exploreStore';

export const useExplore = () => {
    const {
        searchResults,
        trendingUsers,
        recentSearches,
        isSearching,
        isLoadingTrending,
        error,
        searchUsers,
        loadTrending,
        addRecentSearch,
        clearResults,
    } = useExploreStore();

    const search = useCallback(async (query: string) => {
        await searchUsers(query);
    }, [searchUsers]);

    const getTrending = useCallback(async () => {
        await loadTrending();
    }, [loadTrending]);

    return {
        searchResults,
        trendingUsers,
        recentSearches,
        isSearching,
        isLoadingTrending,
        error,
        search,
        getTrending,
        addRecentSearch,
        clearResults,
    };
};

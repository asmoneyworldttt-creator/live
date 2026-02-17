import { useEffect, useCallback } from 'react';
import { useDiscoveryStore } from '../store';

/**
 * Hook for discovery/swiping functionality
 */
export const useDiscovery = () => {
    const {
        users,
        currentIndex,
        matches,
        likesReceived,
        filters,
        isLoading,
        error,
        lastSwipe,
        lastMatch,
        loadUsers,
        loadMatches,
        loadLikesReceived,
        swipeRight,
        swipeLeft,
        superLike,
        undoSwipe,
        updateFilters,
        nextUser,
        clearMatch,
        resetDiscovery,
    } = useDiscoveryStore();

    // Load users on mount
    useEffect(() => {
        loadUsers();
        loadMatches();
        loadLikesReceived();
    }, []);

    // Get current user
    const currentUser = users[currentIndex];
    const hasMoreUsers = currentIndex < users.length;

    // Swipe right (like)
    const like = useCallback(async () => {
        if (!currentUser) return false;

        const isMatch = await swipeRight(currentUser.id);
        nextUser();
        return isMatch;
    }, [currentUser, swipeRight, nextUser]);

    // Swipe left (nope)
    const nope = useCallback(async () => {
        if (!currentUser) return;

        await swipeLeft(currentUser.id);
        nextUser();
    }, [currentUser, swipeLeft, nextUser]);

    // Super like
    const sendSuperLike = useCallback(async () => {
        if (!currentUser) return false;

        const isMatch = await superLike(currentUser.id);
        nextUser();
        return isMatch;
    }, [currentUser, superLike, nextUser]);

    // Undo last swipe
    const undo = useCallback(async () => {
        if (!lastSwipe) return;
        await undoSwipe();
    }, [lastSwipe, undoSwipe]);

    // Update filters and reload
    const setFilters = useCallback(
        (newFilters: Partial<typeof filters>) => {
            updateFilters(newFilters);
        },
        [updateFilters]
    );

    // Get new matches count
    const newMatchesCount = matches.filter(m => m.is_new).length;

    return {
        // State
        currentUser,
        users,
        currentIndex,
        matches,
        likesReceived,
        filters,
        isLoading,
        error,
        hasMoreUsers,
        canUndo: !!lastSwipe,
        newMatchesCount,

        // Actions
        lastMatch,
        like,
        nope,
        undo,
        setFilters,
        clearMatch,
        resetDiscovery,
        loadMatches,
        loadLikesReceived,
        loadUsers,
        swipeRight,
        swipeLeft,
        superLike,
    };
};

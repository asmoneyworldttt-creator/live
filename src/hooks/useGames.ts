import { useCallback } from 'react';
import { useGameStore, Game } from '../store/gameStore';

export const useGames = () => {
    const {
        games,
        activeSession,
        isLoading,
        error,
        fetchGames,
        startSession,
        endSession,
    } = useGameStore();

    const loadGames = useCallback(async () => {
        await fetchGames();
    }, [fetchGames]);

    const playWithMatch = useCallback(async (gameId: string, matchId: string) => {
        await startSession(gameId, matchId);
    }, [startSession]);

    const playSolo = useCallback(async (gameId: string) => {
        await startSession(gameId);
    }, [startSession]);

    return {
        games,
        activeSession,
        isLoading,
        error,
        loadGames,
        playWithMatch,
        playSolo,
        endSession,
    };
};

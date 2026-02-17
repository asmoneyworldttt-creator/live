import { create } from 'zustand';
import { supabase } from '../api/supabase';

export interface Game {
    id: string;
    name: string;
    description: string;
    icon: string;
    image: string;
    entryFee: number;
    prizePool: string;
    category: 'Casual' | 'Social' | 'Competitive';
    playersOnline: number;
}

export const AVAILABLE_GAMES: Game[] = [
    {
        id: 'spin_wheel',
        name: 'Spin & Win',
        description: 'Spin the magic wheel to win coins and special badges!',
        icon: 'target',
        image: 'https://images.unsplash.com/photo-1596838132731-bcbc366967e8?q=80&w=400&auto=format&fit=crop',
        entryFee: 10,
        prizePool: '1,000+',
        category: 'Casual',
        playersOnline: 245
    },
    {
        id: 'truth_dare',
        name: 'Truth or Dare',
        description: 'Get to know your matches better with fun and spicy questions.',
        icon: 'message-circle',
        image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=400&auto=format&fit=crop',
        entryFee: 0,
        prizePool: 'Bonds',
        category: 'Social',
        playersOnline: 1205
    },
    {
        id: 'ludo',
        name: 'Super Ludo',
        description: 'The classic board game, now with real coin stakes.',
        icon: 'grid',
        image: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?q=80&w=400&auto=format&fit=crop',
        entryFee: 50,
        prizePool: '5,000+',
        category: 'Competitive',
        playersOnline: 87
    },
    {
        id: 'slots',
        name: 'Lucky Slots',
        description: 'Test your luck and hit the jackpot today.',
        icon: 'cpu',
        image: 'https://images.unsplash.com/photo-1518893063132-36e46dbe2428?q=80&w=400&auto=format&fit=crop',
        entryFee: 20,
        prizePool: '10,000+',
        category: 'Casual',
        playersOnline: 432
    }
];

interface GameState {
    games: Game[];
    activeSession: any | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchGames: () => Promise<void>;
    startSession: (gameId: string, partnerId?: string) => Promise<void>;
    endSession: (sessionId: string) => Promise<void>;
}

export const useGameStore = create<GameState>((set) => ({
    games: AVAILABLE_GAMES,
    activeSession: null,
    isLoading: false,
    error: null,

    fetchGames: async () => {
        // Mocking real-time player counts
        const updatedGames = AVAILABLE_GAMES.map(g => ({
            ...g,
            playersOnline: g.playersOnline + Math.floor(Math.random() * 10)
        }));
        set({ games: updatedGames });
    },

    startSession: async (gameId, partnerId) => {
        set({ isLoading: true });
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const participants = [user.id];
            if (partnerId) participants.push(partnerId);

            const { data, error } = await supabase
                .from('game_sessions')
                .insert({
                    game_type: gameId,
                    participant_ids: participants,
                    status: 'active'
                })
                .select()
                .single();

            if (error) throw error;
            set({ activeSession: data, error: null });
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    endSession: async (sessionId) => {
        try {
            await supabase
                .from('game_sessions')
                .update({ status: 'completed' })
                .eq('id', sessionId);
            set({ activeSession: null });
        } catch (error: any) {
            console.error('Error ending session:', error);
        }
    }
}));

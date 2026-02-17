import { create } from 'zustand';
import { supabase } from '../api/supabase';

export interface DiscoveryUser {
    id: string;
    full_name: string;
    age: number;
    avatar_url?: string;
    bio?: string;
    location?: {
        city?: string;
        distance?: number;
    };
    interests?: string[];
    photos: string[];
    is_verified: boolean;
    is_online: boolean;
    last_active?: string;
}

export interface Match {
    id: string;
    user: DiscoveryUser;
    matched_at: string;
    is_new: boolean;
}

interface Filters {
    minAge: number;
    maxAge: number;
    maxDistance: number;
    gender?: 'male' | 'female' | 'other';
    interests?: string[];
    verifiedOnly: boolean;
    onlineOnly: boolean;
}

interface DiscoveryState {
    // State
    users: DiscoveryUser[];
    currentIndex: number;
    matches: Match[];
    likesReceived: DiscoveryUser[];
    filters: Filters;
    isLoading: boolean;
    error: string | null;
    lastSwipe: {
        user: DiscoveryUser;
        action: 'like' | 'nope';
    } | null;
    lastMatch: DiscoveryUser | null;

    // Actions
    loadUsers: () => Promise<void>;
    loadMatches: () => Promise<void>;
    loadLikesReceived: () => Promise<void>;
    swipeRight: (userId: string) => Promise<boolean>; // Returns true if match
    swipeLeft: (userId: string) => Promise<void>;
    superLike: (userId: string) => Promise<boolean>;
    undoSwipe: () => Promise<void>;
    updateFilters: (filters: Partial<Filters>) => void;
    nextUser: () => void;
    clearMatch: () => void;
    resetDiscovery: () => void;
}

const DEFAULT_FILTERS: Filters = {
    minAge: 18,
    maxAge: 99,
    maxDistance: 100,
    verifiedOnly: false,
    onlineOnly: false,
};

export const useDiscoveryStore = create<DiscoveryState>((set, get) => ({
    // Initial state
    users: [],
    currentIndex: 0,
    matches: [],
    likesReceived: [],
    filters: DEFAULT_FILTERS,
    isLoading: false,
    error: null,
    lastSwipe: null,
    lastMatch: null,

    // Load discovery users
    loadUsers: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { filters } = get();

            // Build query
            let query = supabase
                .from('users')
                .select(`
                    *,
                    user_media(media_url)
                `)
                .neq('id', user.id);

            // Apply filters
            if (filters.gender) {
                query = query.eq('gender', filters.gender);
            }

            if (filters.verifiedOnly) {
                query = query.eq('is_verified', true);
            }

            if (filters.onlineOnly) {
                query = query.eq('is_online', true);
            }

            const { data, error } = await query.limit(50);

            if (error) throw error;

            // Process users
            const users = data.map((u: any) => ({
                ...u,
                age: calculateAge(u.date_of_birth),
                photos: u.user_media?.map((m: any) => m.media_url) || [],
            }));

            set({ users, currentIndex: 0 });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    // Load matches
    loadMatches: async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('matches')
                .select(`
                    *,
                    user:users(*)
                `)
                .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const matches = data.map((m: any) => ({
                id: m.id,
                user: m.user1_id === user.id ? m.user2 : m.user1,
                matched_at: m.created_at,
                is_new: !m.is_viewed,
            }));

            set({ matches });
        } catch (error: any) {
            console.error('Error loading matches:', error);
        }
    },

    // Load likes received
    loadLikesReceived: async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('likes')
                .select(`
                    *,
                    liker:users(*)
                `)
                .eq('liked_user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            set({ likesReceived: data.map((l: any) => l.liker) });
        } catch (error: any) {
            console.error('Error loading likes:', error);
        }
    },

    // Swipe right (like)
    swipeRight: async (userId) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            // Record like
            const { error: likeError } = await supabase
                .from('likes')
                .insert({
                    liker_id: user.id,
                    liked_user_id: userId,
                });

            if (likeError) throw likeError;

            // Check if other user liked us
            const { data: mutualLike } = await supabase
                .from('likes')
                .select('*')
                .eq('liker_id', userId)
                .eq('liked_user_id', user.id)
                .single();

            // If mutual like, create match
            if (mutualLike) {
                const { error: matchError } = await supabase
                    .from('matches')
                    .insert({
                        user1_id: user.id,
                        user2_id: userId,
                    });

                if (matchError) throw matchError;

                // Reload matches
                await get().loadMatches();

                // Set last match for animation
                const matchedUser = get().users.find(u => u.id === userId);
                if (matchedUser) {
                    set({ lastMatch: matchedUser });
                }

                return true; // It's a match!
            }

            return false;
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        }
    },

    // Swipe left (nope)
    swipeLeft: async (userId) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Record nope
            await supabase
                .from('nopes')
                .insert({
                    user_id: user.id,
                    noped_user_id: userId,
                });
        } catch (error: any) {
            console.error('Error recording nope:', error);
        }
    },

    // Super like
    superLike: async (userId) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            // Record super like
            const { error } = await supabase
                .from('likes')
                .insert({
                    liker_id: user.id,
                    liked_user_id: userId,
                    is_super_like: true,
                });

            if (error) throw error;

            // Check for match (same as swipe right)
            return await get().swipeRight(userId);
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        }
    },

    // Undo last swipe
    undoSwipe: async () => {
        const { lastSwipe } = get();
        if (!lastSwipe) return;

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            if (lastSwipe.action === 'like') {
                await supabase
                    .from('likes')
                    .delete()
                    .eq('liker_id', user.id)
                    .eq('liked_user_id', lastSwipe.user.id);
            } else {
                await supabase
                    .from('nopes')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('noped_user_id', lastSwipe.user.id);
            }

            // Move back one user
            set((state) => ({
                currentIndex: Math.max(0, state.currentIndex - 1),
                lastSwipe: null,
            }));
        } catch (error: any) {
            console.error('Error undoing swipe:', error);
        }
    },

    // Update filters
    updateFilters: (newFilters) => {
        set((state) => ({
            filters: { ...state.filters, ...newFilters },
        }));
        // Reload users with new filters
        get().loadUsers();
    },

    // Move to next user
    nextUser: () => {
        set((state) => ({
            currentIndex: state.currentIndex + 1,
        }));
    },

    // Clear last match
    clearMatch: () => {
        set({ lastMatch: null });
    },

    // Reset discovery
    resetDiscovery: () => {
        set({
            users: [],
            currentIndex: 0,
            lastSwipe: null,
            lastMatch: null,
        });
        get().loadUsers();
    },
}));

// Helper function
function calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

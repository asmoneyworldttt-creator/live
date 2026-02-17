import { create } from 'zustand';
import { supabase } from '../api/supabase';
import { DiscoveryUser } from './discoveryStore';

interface ExploreState {
    searchResults: DiscoveryUser[];
    trendingUsers: DiscoveryUser[];
    recentSearches: string[];
    isSearching: boolean;
    isLoadingTrending: boolean;
    error: string | null;

    // Actions
    searchUsers: (query: string) => Promise<void>;
    loadTrending: () => Promise<void>;
    addRecentSearch: (query: string) => void;
    clearResults: () => void;
}

export const useExploreStore = create<ExploreState>((set, get) => ({
    searchResults: [],
    trendingUsers: [],
    recentSearches: [],
    isSearching: false,
    isLoadingTrending: false,
    error: null,

    searchUsers: async (query: string) => {
        if (!query.trim()) {
            set({ searchResults: [], isSearching: false });
            return;
        }

        set({ isSearching: true, error: null });
        try {
            const { data, error } = await supabase
                .from('users')
                .select(`
                    *,
                    user_media(media_url)
                `)
                .or(`full_name.ilike.%${query}%,username.ilike.%${query}%`)
                .limit(20);

            if (error) throw error;

            const results = data.map((u: any) => ({
                ...u,
                age: calculateAge(u.date_of_birth),
                photos: u.user_media?.map((m: any) => m.media_url) || [],
            }));

            set({ searchResults: results });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isSearching: false });
        }
    },

    loadTrending: async () => {
        set({ isLoadingTrending: true, error: null });
        try {
            // "Trending" mocked as users with highest rating/activity or just verified ones first
            const { data, error } = await supabase
                .from('users')
                .select(`
                    *,
                    user_media(media_url)
                `)
                .eq('is_verified', true)
                .order('last_seen', { ascending: false })
                .limit(10);

            if (error) throw error;

            const trending = data.map((u: any) => ({
                ...u,
                age: calculateAge(u.date_of_birth),
                photos: u.user_media?.map((m: any) => m.media_url) || [],
            }));

            set({ trendingUsers: trending });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoadingTrending: false });
        }
    },

    addRecentSearch: (query: string) => {
        set((state) => ({
            recentSearches: [
                query,
                ...state.recentSearches.filter((s) => s !== query)
            ].slice(0, 5),
        }));
    },

    clearResults: () => {
        set({ searchResults: [], isSearching: false });
    },
}));

// Helper function (duplicated from discoveryStore for now, ideally in dateUtils)
function calculateAge(dateOfBirth: string): number {
    if (!dateOfBirth) return 24;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

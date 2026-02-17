import { create } from 'zustand';
import { supabase } from '../api/supabase';
import { DiscoveryUser } from './discoveryStore';

export interface AIRecommendation extends DiscoveryUser {
    username?: string;
    compatibility_score: number;
    compatibility_breakdown: {
        interests: number;
        personality: number;
        lifestyle: number;
        goals: number;
    };
    reason: string;
}

interface RecommendationState {
    topMatches: AIRecommendation[];
    smartMatch: AIRecommendation | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    loadRecommendations: () => Promise<void>;
    loadSmartMatch: () => Promise<void>;
}

export const useRecommendationStore = create<RecommendationState>((set) => ({
    topMatches: [],
    smartMatch: null,
    isLoading: false,
    error: null,

    loadRecommendations: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('compatibility_scores')
                .select(`
                    score,
                    breakdown,
                    users!user_b_id (
                        id,
                        full_name,
                        username,
                        date_of_birth,
                        bio,
                        is_verified,
                        status,
                        user_media (
                            media_url
                        )
                    )
                `)
                .eq('user_a_id', authUser.id)
                .order('score', { ascending: false })
                .limit(10);

            if (error) throw error;

            const recommendations: AIRecommendation[] = (data || []).map((item: any) => {
                const u = item.users;
                if (!u) return null;
                const rec: AIRecommendation = {
                    id: u.id,
                    full_name: u.full_name,
                    username: u.username,
                    age: calculateAge(u.date_of_birth),
                    bio: u.bio,
                    is_verified: u.is_verified,
                    is_online: u.status === 'online',
                    photos: u.user_media?.map((m: any) => m.media_url) || [],
                    compatibility_score: item.score,
                    compatibility_breakdown: item.breakdown || {
                        interests: 85,
                        personality: 90,
                        lifestyle: 75,
                        goals: 80
                    },
                    reason: "You both love creative arts and deep conversations."
                };
                return rec;
            }).filter((r): r is AIRecommendation => r !== null);

            set({ topMatches: recommendations });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    loadSmartMatch: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('compatibility_scores')
                .select(`
                    score,
                    breakdown,
                    users!user_b_id (
                        id,
                        full_name,
                        username,
                        date_of_birth,
                        bio,
                        is_verified,
                        status,
                        user_media (
                            media_url
                        )
                    )
                `)
                .eq('user_a_id', authUser.id)
                .order('score', { ascending: false })
                .limit(1)
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            if (data && data.users) {
                const u = data.users;
                // Check if u is an array (sometimes Supabase types are weird if joins aren't specified well)
                const userObj = Array.isArray(u) ? u[0] : u;

                if (userObj) {
                    const smartMatch: AIRecommendation = {
                        id: userObj.id,
                        full_name: userObj.full_name,
                        username: userObj.username,
                        age: calculateAge(userObj.date_of_birth),
                        bio: userObj.bio,
                        is_verified: userObj.is_verified,
                        is_online: userObj.status === 'online',
                        photos: userObj.user_media?.map((m: any) => m.media_url) || [],
                        compatibility_score: data.score,
                        compatibility_breakdown: data.breakdown || {
                            interests: 95,
                            personality: 92,
                            lifestyle: 88,
                            goals: 90
                        },
                        reason: "Incredible alignment in long-term goals and creative passions."
                    };
                    set({ smartMatch });
                }
            }
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    }
}));

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

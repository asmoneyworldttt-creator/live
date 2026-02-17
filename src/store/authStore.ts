import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../api/supabase';

export interface UserProfile {
    id: string;
    email: string;
    phone: string;
    username: string;
    full_name: string;
    age?: number;
    avatar_url?: string;
    bio?: string;
    date_of_birth?: string;
    gender?: 'male' | 'female' | 'other';
    location?: {
        city?: string;
        country?: string;
        coordinates?: { lat: number; lng: number };
    };
    interests?: string[];
    is_verified: boolean;
    is_premium: boolean;
    is_creator: boolean;
    coin_balance: number;
    created_at: string;
    last_active?: string;
}

interface AuthState {
    session: Session | null;
    user: User | null;
    profile: UserProfile | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;

    // Actions
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, metadata: any) => Promise<void>;
    verifyOTP: (identifier: string, otp: string, type?: 'sms' | 'email' | 'phone_change') => Promise<void>;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
    deleteAccount: () => Promise<void>;

    // Helpers
    isVerified: boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    session: null,
    user: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,

    get isVerified() {
        const { profile } = get();
        return profile?.is_verified || false;
    },

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            set({
                session: data.session,
                user: data.user,
                isAuthenticated: true,
            });

            await get().refreshProfile();
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    signup: async (email, password, metadata) => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: metadata,
                },
            });

            if (error) throw error;

            set({
                session: data.session,
                user: data.user,
                isAuthenticated: !!data.session,
            });

            if (data.session) {
                await get().refreshProfile();
            }
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    verifyOTP: async (identifier, otp, type = 'sms') => {
        set({ isLoading: true, error: null });
        try {
            const verifyData: any = {
                token: otp,
                type: type,
            };

            if (type === 'sms' || type === 'phone_change') {
                verifyData.phone = identifier;
            } else {
                verifyData.email = identifier;
            }

            const { data, error } = await supabase.auth.verifyOtp(verifyData);

            if (error) throw error;

            set({
                session: data.session,
                user: data.user,
                isAuthenticated: true,
            });

            await get().refreshProfile();
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    logout: async () => {
        set({ isLoading: true });
        try {
            await supabase.auth.signOut();
            set({
                session: null,
                user: null,
                profile: null,
                isAuthenticated: false,
            });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    refreshProfile: async () => {
        const { user } = get();
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) throw error;
            set({ profile: data });
        } catch (error: any) {
            console.error('Error refreshing profile:', error);
        }
    },

    updateProfile: async (updates) => {
        const { user } = get();
        if (!user) return;

        set({ isLoading: true, error: null });
        try {
            const { error } = await supabase
                .from('users')
                .update(updates)
                .eq('id', user.id);

            if (error) throw error;
            await get().refreshProfile();
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    deleteAccount: async () => {
        set({ isLoading: true, error: null });
        try {
            const { error } = await supabase.rpc('delete_user');
            if (error) throw error;
            await get().logout();
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
}));

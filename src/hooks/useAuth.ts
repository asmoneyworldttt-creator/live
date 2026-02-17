import { useEffect } from 'react';
import { useAuthStore } from '../store';
import { supabase } from '../api/supabase';

/**
 * Hook for authentication state and actions
 */
export const useAuth = () => {
    const {
        session,
        user,
        profile,
        isLoading,
        isAuthenticated,
        error,
        setSession,
        login,
        loginWithPhone,
        verifyOTP,
        signup,
        logout,
        updateProfile,
        refreshProfile,
        deleteAccount,
    } = useAuthStore();

    // Setup auth state listener
    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) {
                refreshProfile();
            }
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) {
                refreshProfile();
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    return {
        // State
        session,
        user,
        profile,
        isLoading,
        isAuthenticated,
        error,

        // Actions
        login,
        loginWithPhone,
        verifyOTP,
        signup,
        logout,
        updateProfile,
        refreshProfile,
        deleteAccount,

        // Computed
        isPremium: profile?.is_premium || false,
        isCreator: profile?.is_creator || false,
        isVerified: profile?.is_verified || false,
    };
};

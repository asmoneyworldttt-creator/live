import { supabase } from './supabase';

export const authApi = {
  // OTP-based Phone Login
  sendOTP: async (phone: string) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
      options: { channel: 'sms' }
    });
    if (error) throw error;
    return data;
  },

  verifyOTP: async (phone: string, token: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
      phone, token, type: 'sms'
    });
    if (error) throw error;
    return data;
  },

  // Google OAuth
  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'socialapp://auth/callback',
        scopes: 'profile email'
      }
    });
    if (error) throw error;
    return data;
  },

  // Apple OAuth
  signInWithApple: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: { redirectTo: 'socialapp://auth/callback' }
    });
    if (error) throw error;
    return data;
  },

  signOut: async () => {
    await supabase.auth.signOut();
  }
};

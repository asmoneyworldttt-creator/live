import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wgxxwndlyggjebsklvgz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndneHh3bmRseWdnamVic2tsdmd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMzE0MDMsImV4cCI6MjA4NjkwNzQwM30.HCnz971vJh1xm9VZwbdHZdwi2KuAQ5-Vxp0LB13eadc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: undefined, // TODO: Add secure storage adapter (e.g., expo-secure-store)
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

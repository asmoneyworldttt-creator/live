import { createClient } from '@supabase/supabase-js';

// Use environment variables or fallback for build safety
// Note: You should configure these in your Vercel project settings for security and flexibility
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wgxxwndlyggjebsklvgz.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndneHh3bmRseWdnamVic2tsdmd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMzE0MDMsImV4cCI6MjA4NjkwNzQwM30.HCnz971vJh1xm9VZwbdHZdwi2KuAQ5-Vxp0LB13eadc';

if (!supabaseUrl || !supabaseKey) {
    console.warn('Missing Supabase Environment Variables - Client might not work correctly');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

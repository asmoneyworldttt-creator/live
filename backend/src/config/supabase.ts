import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wgxxwndlyggjebsklvgz.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndneHh3bmRseWdnamVic2tsdmd6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTMzMTQwMywiZXhwIjoyMDg2OTA3NDAzfQ.yYVzSQpZrFowBLxMrK2z22pKZ1vln-5zjgRv1jP1Isc';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.warn('Supabase URL or Service Key is missing. Check your .env file.');
}

export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

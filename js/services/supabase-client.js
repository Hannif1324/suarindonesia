
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.8/+esm'

// Placeholder credentials - User needs to update these!
const SUPABASE_URL = 'https://zyhjujejtdsljlufunjh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5aGp1amVqdGRzbGpsdWZ1bmpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMDgwNzUsImV4cCI6MjA3OTc4NDA3NX0.EskhTIZOLQYl3sF3u1xFWHuWyHafVkp5dXR52CLxtUw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Helper to check if Supabase is configured
 */
export const isSupabaseConfigured = () => {
    return SUPABASE_URL !== 'YOUR_SUPABASE_URL_HERE' && SUPABASE_KEY !== 'YOUR_SUPABASE_ANON_KEY_HERE';
};

// supabase pasword: SU4R#!23A
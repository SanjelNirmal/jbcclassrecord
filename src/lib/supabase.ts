import { createClient } from '@supabase/supabase-js';

// Initialize with environment variables for production readiness
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pwvwiledybefqlkrlwga.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_iz-iMP_aJnu8rHzH7B9IiQ_JKUZrJ26';

export const supabase = createClient(supabaseUrl, supabaseKey);

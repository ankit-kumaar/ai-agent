import { createClient } from '@supabase/supabase-js';
import { config } from './config';
import type { Database } from './types';

// Client-side Supabase client (uses anon key)
export const supabaseClient = createClient<Database>(
    config.NEXT_PUBLIC_SUPABASE_URL,
    config.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Server-side Supabase client (uses service role key for admin operations)
export const supabaseAdmin = createClient<Database>(
    config.NEXT_PUBLIC_SUPABASE_URL,
    config.SUPABASE_SERVICE_ROLE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);

// Helper function to get the appropriate client based on context
export function getSupabaseClient(isServer: boolean = false) {
    return isServer ? supabaseAdmin : supabaseClient;
}

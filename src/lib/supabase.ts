/**
 * PrivacyCart — Supabase Client Configuration & Health Checker
 * SPPU Third-Year Computer Engineering Project
 * 
 * Safely manages Supabase connectivity.
 * CRITICAL SECURITY PRINCIPLE:
 * Only public VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are used.
 * NEVER expose the service_role secret key or master database passwords in client code!
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    supabaseUrl.includes('.supabase.co') &&
    supabaseAnonKey.length > 20 &&
    supabaseAnonKey !== 'your-supabase-anon-key-here'
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/**
 * Checks connection health to Supabase PostgreSQL backend.
 * If server operation fails, returns exact error message rather than faking success.
 */
export async function testSupabaseConnection(): Promise<{
  configured: boolean;
  connected: boolean;
  message: string;
}> {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      configured: false,
      connected: false,
      message: 'Supabase credentials not configured in .env. Running in Academic Local Demonstration Mode.',
    };
  }

  try {
    const { error } = await supabase.from('products').select('id').limit(1);
    if (error) {
      return {
        configured: true,
        connected: false,
        message: `Supabase error: ${error.message} (${error.code || 'UNKNOWN'})`,
      };
    }

    return {
      configured: true,
      connected: true,
      message: 'Successfully connected to Supabase PostgreSQL database with Row Level Security.',
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      configured: true,
      connected: false,
      message: `Failed to connect to Supabase: ${errorMsg}`,
    };
  }
}

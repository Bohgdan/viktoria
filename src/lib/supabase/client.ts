import { createBrowserClient as createSSRBrowserClient } from '@supabase/ssr';

// Check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your-supabase-url' &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your-anon-key'
  );
}

export function createClient() {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured - using mock data');
    return null;
  }
  
  return createSSRBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Singleton instance for client-side usage
let browserClient: ReturnType<typeof createSSRBrowserClient> | null = null;
let clientInitialized = false;

export function getSupabaseClient() {
  if (!clientInitialized) {
    browserClient = createClient();
    clientInitialized = true;
  }
  return browserClient;
}

// Re-export for compatibility
export const createBrowserClient = createClient;

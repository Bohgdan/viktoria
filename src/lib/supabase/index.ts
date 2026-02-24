// Client-side only exports (safe to import in 'use client' components)
export { createClient as createBrowserClient, getSupabaseClient } from './client';

// IMPORTANT: For server components and API routes, import server client directly:
// import { createClient as createServerClient } from '@/lib/supabase/server';
// Do NOT export server client here - it breaks client component imports

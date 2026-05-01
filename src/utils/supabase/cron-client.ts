import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

/**
 * Creates a Supabase client for cron jobs and background tasks.
 * This client doesn't rely on cookies and works in server-side contexts.
 */
export function createCronClient() {
  return createSupabaseClient(supabaseUrl, supabaseKey)
}

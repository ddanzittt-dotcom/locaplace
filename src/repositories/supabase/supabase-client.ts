import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { env } from "../../lib/config/env"

export function createSupabaseClient(): SupabaseClient {
  return createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
}

import { z } from "zod"

const EnvSchema = z.object({
  DEV: z.boolean(),
  PROD: z.boolean(),
  VITE_DATA_MODE: z.enum(["demo", "supabase"]).default("demo"),
  VITE_SUPABASE_URL: z.string().default(""),
  VITE_SUPABASE_ANON_KEY: z.string().default(""),
  VITE_MAP_PROVIDER: z.enum(["demo", "naver"]).default("demo"),
  VITE_NAVER_MAP_CLIENT_ID: z.string().default(""),
  VITE_KAKAO_JAVASCRIPT_KEY: z.string().default(""),
  VITE_DISABLE_REACT_DEVTOOLS: z.string().default("0"),
})

export const env = EnvSchema.parse(import.meta.env)

export function getMissingSupabaseKeys(): readonly string[] {
  const missing: string[] = []
  if (env.VITE_SUPABASE_URL.length === 0) missing.push("VITE_SUPABASE_URL")
  if (env.VITE_SUPABASE_ANON_KEY.length === 0) missing.push("VITE_SUPABASE_ANON_KEY")
  return missing
}

export function hasSupabaseConfig(): boolean {
  return getMissingSupabaseKeys().length === 0
}

export function isDemoProductionMode(): boolean {
  return env.PROD && env.VITE_DATA_MODE === "demo"
}

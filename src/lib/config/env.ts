import { z } from "zod"

const RawEnvSchema = z.object({
  DEV: z.boolean(),
  PROD: z.boolean(),
  VITE_DEMO_MODE: z.string().default("false"),
  VITE_DATA_MODE: z.enum(["demo", "supabase"]).default("demo"),
  VITE_SUPABASE_URL: z.string().default(""),
  VITE_SUPABASE_ANON_KEY: z.string().default(""),
  VITE_MAP_PROVIDER: z.enum(["demo", "kakao"]).default("demo"),
  VITE_KAKAO_JAVASCRIPT_KEY: z.string().default(""),
  VITE_DISABLE_REACT_DEVTOOLS: z.string().default("0"),
})

const rawEnv = RawEnvSchema.parse(import.meta.env)

export const env = {
  ...rawEnv,
  VITE_DATA_MODE: rawEnv.VITE_DEMO_MODE === "true" ? "demo" : rawEnv.VITE_DATA_MODE,
} satisfies z.infer<typeof RawEnvSchema>

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

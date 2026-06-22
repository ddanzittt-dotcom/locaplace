import { env, getMissingSupabaseKeys, hasSupabaseConfig } from "../lib/config/env"
import { RepositoryConfigError } from "./contracts/errors"
import type { LocaRepository } from "./contracts/loca-repository"
import { DemoRepository } from "./demo/demo-repository"
import { createSupabaseClient } from "./supabase/supabase-client"
import { SupabaseRepository } from "./supabase/supabase-repository"

export function createLocaRepository(): LocaRepository {
  if (env.VITE_DATA_MODE === "demo") return new DemoRepository()
  if (!hasSupabaseConfig()) throw new RepositoryConfigError(getMissingSupabaseKeys())
  return new SupabaseRepository(createSupabaseClient())
}

import type { SupabaseClient } from "@supabase/supabase-js"
import type {
  AdminData,
  Experience,
  HomeSections,
  LibraryData,
  PlaceDetailModel,
  Profile,
  ProfileDetail,
  SearchResults,
  SharePayload,
  TasteMap,
  TasteMapCardModel,
} from "../../types/domain"
import { RepositoryConfigError } from "../contracts/errors"
import type {
  CreateExperienceInput,
  CreateTasteMapInput,
  LocaRepository,
  SavePlaceInput,
} from "../contracts/loca-repository"

function incompleteAdapter<T>(capability: string): T {
  throw new RepositoryConfigError([capability])
}

export class SupabaseRepository implements LocaRepository {
  readonly #client: SupabaseClient

  constructor(client: SupabaseClient) {
    this.#client = client
  }

  async getViewer(): Promise<Profile | null> {
    const { data } = await this.#client.auth.getUser()
    const user = data.user
    if (user === null) return null
    const { data: profile, error } = await this.#client
      .from("profiles")
      .select("id, handle, name, bio, role, created_at")
      .eq("id", user.id)
      .maybeSingle()
    if (error !== null || profile === null) return null
    return {
      id: String(profile.id),
      handle: String(profile.handle),
      name: String(profile.name),
      bio: String(profile.bio ?? ""),
      avatarTone: "mint",
      role: profile.role === "admin" ? "admin" : "user",
      createdAt: String(profile.created_at),
    }
  }

  async signInWithEmail(email: string): Promise<Profile> {
    const { error } = await this.#client.auth.signInWithOtp({ email })
    if (error !== null) throw error
    const viewer = await this.getViewer()
    if (viewer !== null) return viewer
    return {
      id: "pending-auth",
      handle: "pending",
      name: "이메일 확인 대기",
      bio: "메일함의 magic link를 열면 로그인됩니다.",
      avatarTone: "slate",
      role: "user",
      createdAt: new Date().toISOString(),
    }
  }

  async signOut() {
    const { error } = await this.#client.auth.signOut()
    if (error !== null) throw error
  }

  async getHome(): Promise<HomeSections> {
    return incompleteAdapter("Supabase read adapter completion")
  }

  async search(_query: string): Promise<SearchResults> {
    return incompleteAdapter("Supabase search adapter completion")
  }

  async getPlace(_placeId: string): Promise<PlaceDetailModel | null> {
    return incompleteAdapter("Supabase place adapter completion")
  }

  async getLibrary(): Promise<LibraryData> {
    return incompleteAdapter("Supabase library adapter completion")
  }

  async createExperience(_input: CreateExperienceInput): Promise<Experience> {
    return incompleteAdapter("Supabase storage upload adapter completion")
  }

  async savePlace(_input: SavePlaceInput): Promise<void> {
    return incompleteAdapter("Supabase saved-place adapter completion")
  }

  async unsavePlace(_placeId: string): Promise<void> {
    return incompleteAdapter("Supabase saved-place adapter completion")
  }

  async createTasteMap(_input: CreateTasteMapInput): Promise<TasteMap> {
    return incompleteAdapter("Supabase taste-map adapter completion")
  }

  async getTasteMap(_mapId: string): Promise<TasteMapCardModel | null> {
    return incompleteAdapter("Supabase taste-map adapter completion")
  }

  async saveTasteMap(_mapId: string): Promise<void> {
    return incompleteAdapter("Supabase taste-map save adapter completion")
  }

  async shareExperience(_experienceId: string): Promise<SharePayload> {
    return incompleteAdapter("Supabase share adapter completion")
  }

  async shareTasteMap(_mapId: string): Promise<SharePayload> {
    return incompleteAdapter("Supabase share adapter completion")
  }

  async getProfile(_handle: string): Promise<ProfileDetail | null> {
    return incompleteAdapter("Supabase profile adapter completion")
  }

  async getAdminData(): Promise<AdminData> {
    return incompleteAdapter("Supabase admin adapter completion")
  }

  async hideReportedContent(_reportId: string): Promise<void> {
    return incompleteAdapter("Supabase admin adapter completion")
  }

  async restoreReportedContent(_reportId: string): Promise<void> {
    return incompleteAdapter("Supabase admin adapter completion")
  }
}

import type {
  AdminData,
  Experience,
  HomeSections,
  LibraryData,
  MediaType,
  PlaceDetailModel,
  Profile,
  ProfileDetail,
  SearchResults,
  SharePayload,
  TasteMap,
  Visibility,
} from "../../types/domain"

export type SavePlaceInput = {
  readonly placeId: string
  readonly sourceExperienceId: string | null
}

export type CreateExperienceInput = {
  readonly mediaName: string
  readonly mediaType: MediaType
  readonly mimeType: string
  readonly sizeBytes: number
  readonly placeId: string
  readonly caption: string
  readonly tags: readonly string[]
  readonly visitedAt: string | null
  readonly showVisitedAt: boolean
  readonly visibility: Visibility
}

export type CreateTasteMapInput = {
  readonly title: string
  readonly story: string
  readonly placeIds: readonly string[]
  readonly visibility: Visibility
}

export interface LocaRepository {
  getViewer(): Promise<Profile | null>
  signInWithEmail(email: string): Promise<Profile>
  signOut(): Promise<void>
  getHome(): Promise<HomeSections>
  search(query: string): Promise<SearchResults>
  getPlace(placeId: string): Promise<PlaceDetailModel | null>
  getLibrary(): Promise<LibraryData>
  createExperience(input: CreateExperienceInput): Promise<Experience>
  savePlace(input: SavePlaceInput): Promise<void>
  unsavePlace(placeId: string): Promise<void>
  createTasteMap(input: CreateTasteMapInput): Promise<TasteMap>
  getTasteMap(mapId: string): Promise<PlaceDetailModel["maps"][number] | null>
  saveTasteMap(mapId: string): Promise<void>
  shareExperience(experienceId: string): Promise<SharePayload>
  shareTasteMap(mapId: string): Promise<SharePayload>
  getProfile(handle: string): Promise<ProfileDetail | null>
  getAdminData(): Promise<AdminData>
  hideReportedContent(reportId: string): Promise<void>
  restoreReportedContent(reportId: string): Promise<void>
}

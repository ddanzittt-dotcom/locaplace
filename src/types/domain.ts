export const VISIBILITIES = ["public", "unlisted", "private"] as const
export type Visibility = (typeof VISIBILITIES)[number]

export const EXPERIENCE_STATUSES = ["active", "hidden", "deleted"] as const
export type ExperienceStatus = (typeof EXPERIENCE_STATUSES)[number]

export const MAP_STATUSES = ["draft", "published", "hidden", "deleted"] as const
export type MapStatus = (typeof MAP_STATUSES)[number]

export const MEDIA_TYPES = ["image", "video"] as const
export type MediaType = (typeof MEDIA_TYPES)[number]

export const PROFILE_ROLES = ["user", "admin"] as const
export type ProfileRole = (typeof PROFILE_ROLES)[number]

export const REPORT_TARGET_TYPES = ["experience", "taste_map", "place", "profile"] as const
export type ReportTargetType = (typeof REPORT_TARGET_TYPES)[number]

export const REPORT_STATUSES = ["pending", "resolved", "dismissed"] as const
export type ReportStatus = (typeof REPORT_STATUSES)[number]

export type Coordinates = {
  readonly latitude: number
  readonly longitude: number
}

export type Tone = "coral" | "mint" | "amber" | "violet" | "blue" | "forest" | "slate"

export type Profile = {
  readonly id: string
  readonly handle: string
  readonly name: string
  readonly bio: string
  readonly avatarTone: Tone
  readonly role: ProfileRole
  readonly createdAt: string
}

export type Place = {
  readonly id: string
  readonly provider: string
  readonly providerPlaceId: string | null
  readonly name: string
  readonly normalizedName: string
  readonly address: string
  readonly region: string
  readonly coordinates: Coordinates
  readonly category: string
  readonly representativeTone: Tone
  readonly verificationStatus: "verified" | "user_submitted" | "hidden"
  readonly createdBy: string | null
  readonly createdAt: string
}

export type ExperienceMedia = {
  readonly id: string
  readonly experienceId: string
  readonly mediaType: MediaType
  readonly storagePath: string
  readonly posterPath: string | null
  readonly sortOrder: number
  readonly mimeType: string
  readonly sizeBytes: number
  readonly durationSeconds: number | null
  readonly tone: Tone
}

export type Experience = {
  readonly id: string
  readonly userId: string
  readonly placeId: string
  readonly caption: string
  readonly tags: readonly string[]
  readonly visitedAt: string | null
  readonly showVisitedAt: boolean
  readonly visibility: Visibility
  readonly status: ExperienceStatus
  readonly shareToken: string
  readonly createdAt: string
}

export type UserPlace = {
  readonly id: string
  readonly userId: string
  readonly placeId: string
  readonly sourceExperienceId: string | null
  readonly savedAt: string
}

export type TasteMapItem = {
  readonly id: string
  readonly tasteMapId: string
  readonly placeId: string
  readonly sourceExperienceId: string | null
  readonly itemNote: string | null
  readonly sortOrder: number
}

export type TasteMap = {
  readonly id: string
  readonly ownerId: string
  readonly title: string
  readonly story: string
  readonly coverType: "first_media" | "selected_media" | "collage" | "gradient"
  readonly coverTone: Tone
  readonly visibility: Visibility
  readonly status: MapStatus
  readonly shareToken: string
  readonly createdAt: string
  readonly saveCount: number
}

export type TasteMapSave = {
  readonly userId: string
  readonly tasteMapId: string
  readonly savedAt: string
}

export type Report = {
  readonly id: string
  readonly reporterId: string
  readonly targetType: ReportTargetType
  readonly targetId: string
  readonly reason: string
  readonly detail: string | null
  readonly status: ReportStatus
  readonly createdAt: string
}

export type FeaturedContent = {
  readonly id: string
  readonly contentType: "experience" | "place" | "taste_map"
  readonly contentId: string
  readonly section: string
  readonly sortOrder: number
  readonly active: boolean
}

export type RecentView = {
  readonly userId: string
  readonly contentType: "place" | "taste_map" | "experience"
  readonly contentId: string
  readonly viewedAt: string
}

export type ExperienceCardModel = {
  readonly experience: Experience
  readonly place: Place
  readonly author: Profile
  readonly media: readonly ExperienceMedia[]
  readonly isSaved: boolean
}

export type TasteMapCardModel = {
  readonly map: TasteMap
  readonly owner: Profile
  readonly places: readonly Place[]
  readonly isSaved: boolean
}

export type PlaceDetailModel = {
  readonly place: Place
  readonly experiences: readonly ExperienceCardModel[]
  readonly maps: readonly TasteMapCardModel[]
  readonly isSaved: boolean
}

export type HomeSections = {
  readonly recent: readonly (ExperienceCardModel | TasteMapCardModel)[]
  readonly nearbyExperiences: readonly ExperienceCardModel[]
  readonly weeklyMaps: readonly TasteMapCardModel[]
  readonly popularPlaces: readonly Place[]
  readonly curatorMaps: readonly TasteMapCardModel[]
}

export type SearchResults = {
  readonly experiences: readonly ExperienceCardModel[]
  readonly places: readonly Place[]
  readonly maps: readonly TasteMapCardModel[]
  readonly profiles: readonly Profile[]
}

export type LibraryData = {
  readonly savedPlaces: readonly Place[]
  readonly myMaps: readonly TasteMapCardModel[]
  readonly savedMaps: readonly TasteMapCardModel[]
}

export type ProfileDetail = {
  readonly profile: Profile
  readonly experiences: readonly ExperienceCardModel[]
  readonly maps: readonly TasteMapCardModel[]
}

export type AdminData = {
  readonly profiles: readonly Profile[]
  readonly reports: readonly Report[]
  readonly experiences: readonly ExperienceCardModel[]
  readonly maps: readonly TasteMapCardModel[]
  readonly places: readonly Place[]
}

export type SharePayload = {
  readonly title: string
  readonly subtitle: string
  readonly url: string
  readonly tone: Tone
  readonly qrValue: string
}

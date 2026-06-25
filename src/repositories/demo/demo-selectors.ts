import type {
  AdminData,
  ExperienceCardModel,
  HomeSections,
  LibraryData,
  Place,
  PlaceDetailModel,
  Profile,
  ProfileDetail,
  SearchResults,
  TasteMapCardModel,
} from "../../types/domain"
import type { DemoState } from "./demo-schema"

function getViewerId(state: DemoState): string | null {
  return state.viewerId
}

function byId<T extends { readonly id: string }>(items: readonly T[], id: string): T | null {
  return items.find((item) => item.id === id) ?? null
}

function isVisibleToViewer(
  item: { readonly userId?: string; readonly ownerId?: string; readonly visibility: string },
  viewerId: string | null,
): boolean {
  if (item.visibility === "public" || item.visibility === "unlisted") return true
  return item.userId === viewerId || item.ownerId === viewerId
}

export function getViewer(state: DemoState): Profile | null {
  const viewerId = getViewerId(state)
  if (viewerId === null) return null
  return byId(state.profiles, viewerId)
}

export function buildExperienceCard(
  state: DemoState,
  experienceId: string,
): ExperienceCardModel | null {
  const viewerId = getViewerId(state)
  const experience = byId(state.experiences, experienceId)
  if (experience === null || experience.status !== "active") return null
  if (!isVisibleToViewer(experience, viewerId)) return null

  const place = byId(state.places, experience.placeId)
  const author = byId(state.profiles, experience.userId)
  if (place === null || author === null) return null

  const media = state.media
    .filter((item) => item.experienceId === experience.id)
    .sort((left, right) => left.sortOrder - right.sortOrder)
  const isSaved = state.userPlaces.some(
    (saved) => saved.userId === viewerId && saved.placeId === place.id,
  )
  return { experience, place, author, media, isSaved }
}

export function buildTasteMapCard(state: DemoState, mapId: string): TasteMapCardModel | null {
  const viewerId = getViewerId(state)
  const map = byId(state.tasteMaps, mapId)
  if (map === null || map.status !== "published") return null
  if (!isVisibleToViewer(map, viewerId)) return null

  const owner = byId(state.profiles, map.ownerId)
  if (owner === null) return null

  const places = state.tasteMapItems
    .filter((item) => item.tasteMapId === map.id)
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map((item) => byId(state.places, item.placeId))
    .filter((place): place is Place => place !== null)
  const isSaved = state.tasteMapSaves.some(
    (saved) => saved.userId === viewerId && saved.tasteMapId === map.id,
  )
  return { map, owner, places, isSaved }
}

export function getHomeSections(state: DemoState): HomeSections {
  const viewerId = getViewerId(state)
  const homeViewerId = viewerId ?? state.profiles[0]?.id ?? null
  const recent = state.recentViews
    .map((view) => {
      if (view.contentType === "taste_map") return buildTasteMapCard(state, view.contentId)
      if (view.contentType === "experience") return buildExperienceCard(state, view.contentId)
      const place = byId(state.places, view.contentId)
      if (place === null) return null
      const experience = state.experiences.find((item) => item.placeId === place.id)
      return experience ? buildExperienceCard(state, experience.id) : null
    })
    .filter((item): item is ExperienceCardModel | TasteMapCardModel => item !== null)

  const nearbyExperiences = state.experiences
    .map((experience) => buildExperienceCard(state, experience.id))
    .filter((card): card is ExperienceCardModel => card !== null)

  const weeklyMaps = state.featuredContent
    .filter((item) => item.active && item.section === "weekly")
    .map((item) => buildTasteMapCard(state, item.contentId))
    .filter((card): card is TasteMapCardModel => card !== null)

  const curatorMaps = state.featuredContent
    .filter((item) => item.active && item.section === "curator")
    .map((item) => buildTasteMapCard(state, item.contentId))
    .filter((card): card is TasteMapCardModel => card !== null)

  const savedPlaceIds = new Set(
    state.userPlaces.filter((saved) => saved.userId === homeViewerId).map((saved) => saved.placeId),
  )
  const nearbyRecordablePlaces = [...state.places].sort((left, right) => {
    const leftSavedPriority = savedPlaceIds.has(left.id) ? 1 : 0
    const rightSavedPriority = savedPlaceIds.has(right.id) ? 1 : 0
    if (leftSavedPriority !== rightSavedPriority) return leftSavedPriority - rightSavedPriority
    const rightCount = state.userPlaces.filter((saved) => saved.placeId === right.id).length
    const leftCount = state.userPlaces.filter((saved) => saved.placeId === left.id).length
    return rightCount - leftCount
  })

  return { recent, nearbyExperiences, weeklyMaps, nearbyRecordablePlaces, curatorMaps }
}

export function searchDemoState(state: DemoState, query: string): SearchResults {
  const normalizedQuery = query.trim().toLowerCase()
  const matches = (value: string): boolean => value.toLowerCase().includes(normalizedQuery)
  const shouldReturnAll = normalizedQuery.length === 0

  const places = state.places.filter(
    (place) =>
      shouldReturnAll ||
      matches(place.name) ||
      matches(place.region) ||
      matches(place.category) ||
      matches(place.address),
  )
  const experiences = state.experiences
    .filter(
      (experience) =>
        shouldReturnAll ||
        matches(experience.caption) ||
        experience.tags.some((tag) => matches(tag)),
    )
    .map((experience) => buildExperienceCard(state, experience.id))
    .filter((card): card is ExperienceCardModel => card !== null)
  const maps = state.tasteMaps
    .filter((map) => shouldReturnAll || matches(map.title) || matches(map.story))
    .map((map) => buildTasteMapCard(state, map.id))
    .filter((card): card is TasteMapCardModel => card !== null)
  const profiles = state.profiles.filter(
    (profile) => shouldReturnAll || matches(profile.name) || matches(profile.handle),
  )
  return { experiences, places, maps, profiles }
}

export function getPlaceDetail(state: DemoState, placeId: string): PlaceDetailModel | null {
  const viewerId = getViewerId(state)
  const place = byId(state.places, placeId)
  if (place === null) return null
  const experiences = state.experiences
    .filter((experience) => experience.placeId === placeId)
    .map((experience) => buildExperienceCard(state, experience.id))
    .filter((card): card is ExperienceCardModel => card !== null)
  const mapIds = state.tasteMapItems
    .filter((item) => item.placeId === placeId)
    .map((item) => item.tasteMapId)
  const maps = [...new Set(mapIds)]
    .map((mapId) => buildTasteMapCard(state, mapId))
    .filter((card): card is TasteMapCardModel => card !== null)
  const isSaved = state.userPlaces.some(
    (saved) => saved.userId === viewerId && saved.placeId === placeId,
  )
  return { place, experiences, maps, isSaved }
}

export function getLibrary(state: DemoState): LibraryData {
  const viewerId = getViewerId(state)
  const savedPlaces = state.userPlaces
    .filter((saved) => saved.userId === viewerId)
    .map((saved) => byId(state.places, saved.placeId))
    .filter((place): place is Place => place !== null)
  const myMaps = state.tasteMaps
    .filter((map) => map.ownerId === viewerId)
    .map((map) => buildTasteMapCard(state, map.id))
    .filter((card): card is TasteMapCardModel => card !== null)
  const savedMaps = state.tasteMapSaves
    .filter((saved) => saved.userId === viewerId)
    .map((saved) => buildTasteMapCard(state, saved.tasteMapId))
    .filter((card): card is TasteMapCardModel => card !== null)
  return { savedPlaces, myMaps, savedMaps }
}

export function getProfileDetail(state: DemoState, handle: string): ProfileDetail | null {
  const profile = state.profiles.find((item) => item.handle === handle) ?? null
  if (profile === null) return null
  const experiences = state.experiences
    .filter((experience) => experience.userId === profile.id)
    .map((experience) => buildExperienceCard(state, experience.id))
    .filter((card): card is ExperienceCardModel => card !== null)
  const maps = state.tasteMaps
    .filter((map) => map.ownerId === profile.id)
    .map((map) => buildTasteMapCard(state, map.id))
    .filter((card): card is TasteMapCardModel => card !== null)
  return { profile, experiences, maps }
}

export function getAdminData(state: DemoState): AdminData {
  const experiences = state.experiences
    .map((experience) => buildExperienceCard(state, experience.id))
    .filter((card): card is ExperienceCardModel => card !== null)
  const maps = state.tasteMaps
    .map((map) => buildTasteMapCard(state, map.id))
    .filter((card): card is TasteMapCardModel => card !== null)
  return {
    profiles: state.profiles,
    reports: state.reports,
    experiences,
    maps,
    places: state.places,
  }
}

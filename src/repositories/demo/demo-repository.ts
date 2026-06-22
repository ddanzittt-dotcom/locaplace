import type { Experience, SharePayload, TasteMap } from "../../types/domain"
import { ValidationError } from "../contracts/errors"
import type {
  CreateExperienceInput,
  CreateTasteMapInput,
  LocaRepository,
  SavePlaceInput,
} from "../contracts/loca-repository"
import {
  createExperienceState,
  createTasteMapState,
  ensureSavedPlace,
  getRequiredViewerId,
  saveTasteMapState,
  updateReportedContentState,
} from "./demo-mutations"
import type { DemoState } from "./demo-schema"
import {
  buildExperienceCard,
  buildTasteMapCard,
  getAdminData,
  getHomeSections,
  getLibrary,
  getPlaceDetail,
  getProfileDetail,
  getViewer,
  searchDemoState,
} from "./demo-selectors"
import { loadDemoState, withDemoState } from "./demo-storage"
import { DEMO_ADMIN_ID, DEMO_USER_ID } from "./fixtures"

function getMapSharePayload(state: DemoState, mapId: string): SharePayload {
  const card = buildTasteMapCard(state, mapId)
  if (card === null) throw new ValidationError("mapId", "공유할 지도를 찾을 수 없습니다.")
  const url = `${window.location.origin}/share/map/${card.map.shareToken}`
  return {
    title: card.map.title,
    subtitle: `${card.places.length}개의 장소 · ${card.owner.name}`,
    url,
    tone: card.map.coverTone,
    qrValue: url,
  }
}

export class DemoRepository implements LocaRepository {
  async getViewer() {
    return getViewer(loadDemoState())
  }

  async signInWithEmail(email: string) {
    const normalized = email.trim().toLowerCase()
    const viewerId = normalized.includes("admin") ? DEMO_ADMIN_ID : DEMO_USER_ID
    const state = withDemoState((current) => ({ ...current, viewerId }))
    const viewer = getViewer(state)
    if (viewer === null) throw new ValidationError("email", "데모 사용자를 찾을 수 없습니다.")
    return viewer
  }

  async signOut() {
    withDemoState((state) => ({ ...state, viewerId: null }))
  }

  async getHome() {
    return getHomeSections(loadDemoState())
  }

  async search(query: string) {
    return searchDemoState(loadDemoState(), query)
  }

  async getPlace(placeId: string) {
    return getPlaceDetail(loadDemoState(), placeId)
  }

  async getLibrary() {
    return getLibrary(loadDemoState())
  }

  async createExperience(input: CreateExperienceInput): Promise<Experience> {
    const next = withDemoState((state) => createExperienceState(state, input))
    const created = next.experiences[0]
    if (created === undefined) throw new ValidationError("experience", "경험을 만들 수 없습니다.")
    return created
  }

  async savePlace(input: SavePlaceInput) {
    withDemoState((state) => {
      const viewerId = getRequiredViewerId(state)
      return ensureSavedPlace(state, input, viewerId)
    })
  }

  async unsavePlace(placeId: string) {
    withDemoState((state) => {
      const viewerId = getRequiredViewerId(state)
      return {
        ...state,
        userPlaces: state.userPlaces.filter(
          (saved) => saved.userId !== viewerId || saved.placeId !== placeId,
        ),
      }
    })
  }

  async createTasteMap(input: CreateTasteMapInput): Promise<TasteMap> {
    const next = withDemoState((state) => createTasteMapState(state, input))
    const created = next.tasteMaps[0]
    if (created === undefined) throw new ValidationError("tasteMap", "지도를 만들 수 없습니다.")
    return created
  }

  async getTasteMap(mapId: string) {
    return buildTasteMapCard(loadDemoState(), mapId)
  }

  async saveTasteMap(mapId: string) {
    withDemoState((state) => saveTasteMapState(state, mapId))
  }

  async shareExperience(experienceId: string) {
    const state = loadDemoState()
    const card = buildExperienceCard(state, experienceId)
    if (card === null) throw new ValidationError("experienceId", "공유할 경험을 찾을 수 없습니다.")
    const url = `${window.location.origin}/share/experience/${card.experience.shareToken}`
    return {
      title: card.place.name,
      subtitle: `${card.author.name} · ${card.experience.caption}`,
      url,
      tone: card.media[0]?.tone ?? card.place.representativeTone,
      qrValue: url,
    }
  }

  async shareTasteMap(mapId: string) {
    return getMapSharePayload(loadDemoState(), mapId)
  }

  async getProfile(handle: string) {
    return getProfileDetail(loadDemoState(), handle)
  }

  async getAdminData() {
    return getAdminData(loadDemoState())
  }

  async hideReportedContent(reportId: string) {
    withDemoState((state) => updateReportedContentState(state, reportId, "hide"))
  }

  async restoreReportedContent(reportId: string) {
    withDemoState((state) => updateReportedContentState(state, reportId, "restore"))
  }
}

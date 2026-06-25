import type { TasteMap, Tone } from "../../types/domain"
import { AuthRequiredError, ValidationError } from "../contracts/errors"
import type {
  CreateExperienceInput,
  CreateTasteMapInput,
  SavePlaceInput,
} from "../contracts/loca-repository"
import type { DemoState } from "./demo-schema"

type ReportAction = "hide" | "restore"

function nowIso(): string {
  return new Date().toISOString()
}

function createId(prefix: string): string {
  const random = crypto.randomUUID()
  return `${prefix}-${random}`
}

export function getRequiredViewerId(state: DemoState, returnTo = "/home"): string {
  if (state.viewerId === null) throw new AuthRequiredError(returnTo)
  return state.viewerId
}

function chooseTone(placeId: string): Tone {
  const tones: readonly Tone[] = ["coral", "mint", "amber", "violet", "blue", "forest", "slate"]
  const index = placeId.length % tones.length
  return tones[index] ?? "coral"
}

export function ensureSavedPlace(
  state: DemoState,
  input: SavePlaceInput,
  viewerId: string,
): DemoState {
  const alreadySaved = state.userPlaces.some(
    (saved) => saved.userId === viewerId && saved.placeId === input.placeId,
  )
  if (alreadySaved) return state
  return {
    ...state,
    userPlaces: [
      ...state.userPlaces,
      {
        id: createId("user-place"),
        userId: viewerId,
        placeId: input.placeId,
        sourceExperienceId: input.sourceExperienceId,
        savedAt: nowIso(),
      },
    ],
  }
}

export function createExperienceState(state: DemoState, input: CreateExperienceInput): DemoState {
  const viewerId = getRequiredViewerId(state, "/create/experience")
  if (input.placeId.length === 0) {
    throw new ValidationError("placeId", "장소 선택은 필수입니다.")
  }
  const placeExists = state.places.some((place) => place.id === input.placeId)
  if (!placeExists) throw new ValidationError("placeId", "선택한 장소를 찾을 수 없습니다.")

  const experienceId = createId("exp")
  const mediaId = createId("media")
  const experience: DemoState["experiences"][number] = {
    id: experienceId,
    userId: viewerId,
    placeId: input.placeId,
    caption: input.caption,
    tags: [...input.tags],
    visitedAt: input.visitedAt,
    showVisitedAt: input.showVisitedAt,
    visibility: input.visibility,
    status: "active",
    shareToken: createId("share-exp"),
    createdAt: nowIso(),
  }

  return ensureSavedPlace(
    {
      ...state,
      experiences: [experience, ...state.experiences],
      media: [
        {
          id: mediaId,
          experienceId,
          mediaType: input.mediaType,
          storagePath: `demo/uploads/${input.mediaName}`,
          posterPath: input.mediaType === "video" ? `demo/uploads/${input.mediaName}.poster` : null,
          sortOrder: 0,
          mimeType: input.mimeType,
          sizeBytes: input.sizeBytes,
          durationSeconds: input.mediaType === "image" ? null : 10,
          tone: chooseTone(input.placeId),
        },
        ...state.media,
      ],
    },
    { placeId: input.placeId, sourceExperienceId: experienceId },
    viewerId,
  )
}

export function createTasteMapState(state: DemoState, input: CreateTasteMapInput): DemoState {
  const viewerId = getRequiredViewerId(state, "/maps/new")
  if (input.placeIds.length < 2) {
    throw new ValidationError("placeIds", "취향 지도에는 장소가 2개 이상 필요합니다.")
  }
  const mapId = createId("map")
  const map: TasteMap = {
    id: mapId,
    ownerId: viewerId,
    title: input.title,
    story: input.story,
    coverType: "gradient",
    coverTone: chooseTone(input.placeIds[0] ?? mapId),
    visibility: input.visibility,
    status: "published",
    shareToken: createId("share-map"),
    createdAt: nowIso(),
    saveCount: 0,
  }
  const items = input.placeIds.map((placeId, index) => ({
    id: createId("item"),
    tasteMapId: mapId,
    placeId,
    sourceExperienceId: null,
    itemNote: null,
    sortOrder: index + 1,
  }))
  return {
    ...state,
    tasteMaps: [map, ...state.tasteMaps],
    tasteMapItems: [...items, ...state.tasteMapItems],
  }
}

export function saveTasteMapState(state: DemoState, mapId: string): DemoState {
  const viewerId = getRequiredViewerId(state)
  const alreadySaved = state.tasteMapSaves.some(
    (saved) => saved.userId === viewerId && saved.tasteMapId === mapId,
  )
  if (alreadySaved) return state
  return {
    ...state,
    tasteMapSaves: [
      ...state.tasteMapSaves,
      { userId: viewerId, tasteMapId: mapId, savedAt: nowIso() },
    ],
    tasteMaps: state.tasteMaps.map((map) =>
      map.id === mapId ? { ...map, saveCount: map.saveCount + 1 } : map,
    ),
  }
}

export function updateReportedContentState(
  state: DemoState,
  reportId: string,
  action: ReportAction,
): DemoState {
  getRequiredViewerId(state, "/admin")
  const report = state.reports.find((item) => item.id === reportId)
  if (report === undefined) return state

  const reportStatus = action === "hide" ? "resolved" : "dismissed"
  const experienceStatus = action === "hide" ? "hidden" : "active"
  const tasteMapStatus = action === "hide" ? "hidden" : "published"

  return {
    ...state,
    reports: state.reports.map((item) =>
      item.id === reportId ? { ...item, status: reportStatus } : item,
    ),
    experiences:
      report.targetType === "experience"
        ? state.experiences.map((item) =>
            item.id === report.targetId ? { ...item, status: experienceStatus } : item,
          )
        : state.experiences,
    tasteMaps:
      report.targetType === "taste_map"
        ? state.tasteMaps.map((item) =>
            item.id === report.targetId ? { ...item, status: tasteMapStatus } : item,
          )
        : state.tasteMaps,
  }
}

import { z } from "zod"
import { MEDIA_TYPES } from "../../types/domain"

export const COMPOSER_VISIBILITIES = ["public", "private"] as const

export const ExperienceFormSchema = z.object({
  mediaName: z.string().min(1, "사진 또는 음성을 추가해주세요."),
  mediaType: z.enum(MEDIA_TYPES),
  mimeType: z.string().min(1),
  sizeBytes: z.number().min(1),
  placeId: z.string().min(1, "장소 선택은 필수입니다."),
  caption: z.string().min(2, "메모를 조금 더 남겨주세요.").max(160),
  visitedAt: z.string(),
  showVisitedAt: z.boolean(),
  visibility: z.enum(COMPOSER_VISIBILITIES),
})

export type ExperienceForm = z.infer<typeof ExperienceFormSchema>

export type SelectedMedia = {
  readonly mediaName: string
  readonly mediaType: ExperienceForm["mediaType"]
  readonly mimeType: string
  readonly sizeBytes: number
  readonly label: string
}

export function createDefaultExperienceValues(): ExperienceForm {
  return {
    mediaName: "",
    mediaType: "image",
    mimeType: "",
    sizeBytes: 0,
    placeId: "",
    caption: "",
    visitedAt: new Date().toISOString().slice(0, 10),
    showVisitedAt: true,
    visibility: "public",
  }
}

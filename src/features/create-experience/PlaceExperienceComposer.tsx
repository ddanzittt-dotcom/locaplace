import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Send, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../app/auth-context"
import { useRepository } from "../../app/repository-context"
import { useToast } from "../../app/toast-context"
import type { Experience, Place } from "../../types/domain"
import {
  createDefaultExperienceValues,
  type ExperienceForm,
  ExperienceFormSchema,
  type SelectedMedia,
} from "./create-experience-form"
import { MediaCaptureField } from "./MediaCaptureField"
import { PlaceSelector } from "./PlaceSelector"
import { TagInput } from "./TagInput"

type PlaceExperienceComposerProps = {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly onPublished?: (experience: Experience) => void
}

function addTag(tags: readonly string[], draft: string): readonly string[] {
  const nextTag = draft.trim().replace(/^#/, "")
  if (nextTag.length === 0 || tags.includes(nextTag)) return tags
  return [...tags, nextTag]
}

export function PlaceExperienceComposer({
  isOpen,
  onClose,
  onPublished,
}: PlaceExperienceComposerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const repository = useRepository()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { viewer } = useAuth()
  const { showToast } = useToast()
  const [placeMode, setPlaceMode] = useState<"address" | "saved">("address")
  const [addressQuery, setAddressQuery] = useState("")
  const [savedQuery, setSavedQuery] = useState("")
  const [tags, setTags] = useState<readonly string[]>([])
  const [tagDraft, setTagDraft] = useState("")
  const [selectedMediaLabel, setSelectedMediaLabel] = useState<string | null>(null)

  const { data: searchResults } = useQuery({
    queryKey: ["search", addressQuery],
    queryFn: () => repository.search(addressQuery),
  })
  const { data: libraryData } = useQuery({
    queryKey: ["library"],
    queryFn: () => repository.getLibrary(),
  })
  const { data: homeData } = useQuery({ queryKey: ["home"], queryFn: () => repository.getHome() })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ExperienceForm>({
    resolver: zodResolver(ExperienceFormSchema),
    defaultValues: createDefaultExperienceValues(),
  })

  const selectedPlaceId = watch("placeId")
  const selectedPlace =
    searchResults?.places.find((place) => place.id === selectedPlaceId) ??
    libraryData?.savedPlaces.find((place) => place.id === selectedPlaceId) ??
    homeData?.nearbyRecordablePlaces.find((place) => place.id === selectedPlaceId) ??
    null

  const selectPlace = (place: Place): void => {
    setValue("placeId", place.id, { shouldValidate: true })
  }

  const selectMedia = (media: SelectedMedia): void => {
    setValue("mediaName", media.mediaName, { shouldValidate: true })
    setValue("mediaType", media.mediaType, { shouldValidate: true })
    setValue("mimeType", media.mimeType, { shouldValidate: true })
    setValue("sizeBytes", media.sizeBytes, { shouldValidate: true })
    setSelectedMediaLabel(media.label)
  }

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog === null || !isOpen || dialog.open) return
    dialog.showModal()
  }, [isOpen])

  const onSubmit = handleSubmit(async (values) => {
    if (viewer === null) {
      navigate("/auth", { state: { returnTo: "/create/experience", pendingAction: null } })
      return
    }
    const experience = await repository.createExperience({
      ...values,
      tags,
      visitedAt: values.visitedAt.length > 0 ? new Date(values.visitedAt).toISOString() : null,
    })
    await queryClient.invalidateQueries()
    showToast({
      message: "장소를 남겼어요.",
      action: { label: "내 장소에서 보기", to: "/me" },
    })
    onPublished?.(experience)
  })

  if (!isOpen) return null

  return (
    <dialog
      ref={dialogRef}
      className="composer-layer"
      aria-label="장소 기록하기"
      onCancel={onClose}
    >
      <section className="composer-dialog">
        <div className="composer-header">
          <span className="page-kicker">장소 경험</span>
          <button type="button" className="icon-button" onClick={onClose} aria-label="닫기">
            <X aria-hidden="true" size={18} />
          </button>
        </div>
        <h1>장소 기록하기</h1>
        <form className="composer-form" onSubmit={(event) => void onSubmit(event)}>
          <input type="hidden" {...register("placeId")} />
          <input type="hidden" {...register("mediaName")} />
          <input type="hidden" {...register("mediaType")} />
          <input type="hidden" {...register("mimeType")} />
          <input type="hidden" {...register("sizeBytes", { valueAsNumber: true })} />
          <input type="hidden" {...register("showVisitedAt")} />

          <PlaceSelector
            mode={placeMode}
            selectedPlaceId={selectedPlaceId}
            addressQuery={addressQuery}
            savedQuery={savedQuery}
            searchPlaces={searchResults?.places ?? []}
            savedPlaces={libraryData?.savedPlaces ?? []}
            nearbyPlaces={homeData?.nearbyRecordablePlaces ?? []}
            error={errors.placeId?.message}
            onModeChange={setPlaceMode}
            onAddressQueryChange={setAddressQuery}
            onSavedQueryChange={setSavedQuery}
            onUseCurrentLocation={() => setAddressQuery("서울")}
            onSelectPlace={selectPlace}
          />

          {selectedPlace === null ? null : (
            <p className="selected-place-note">
              선택됨 · {selectedPlace.name} {selectedPlace.address}
            </p>
          )}

          <label>
            <span>메모</span>
            <textarea
              rows={3}
              {...register("caption")}
              placeholder="이 장소에서 남기고 싶은 메모"
            />
            {errors.caption === undefined ? null : (
              <small className="field-error">{errors.caption.message}</small>
            )}
          </label>

          <MediaCaptureField
            selectedLabel={selectedMediaLabel}
            formError={errors.mediaName?.message}
            onMediaSelected={selectMedia}
          />

          <TagInput
            draft={tagDraft}
            tags={tags}
            onDraftChange={setTagDraft}
            onAddTag={() => {
              setTags((current) => addTag(current, tagDraft))
              setTagDraft("")
            }}
            onRemoveTag={(tag) => setTags((current) => current.filter((item) => item !== tag))}
          />

          <div className="field-grid">
            <label>
              <span>작성일</span>
              <input type="date" {...register("visitedAt")} />
            </label>
            <label>
              <span>공개 범위</span>
              <select {...register("visibility")}>
                <option value="public">전체 공개</option>
                <option value="private">나만 보기</option>
              </select>
            </label>
          </div>

          <button type="submit" className="primary-button" disabled={isSubmitting}>
            <Send aria-hidden="true" size={18} />
            {isSubmitting ? "기록 중" : "기록하기"}
          </button>
        </form>
      </section>
    </dialog>
  )
}

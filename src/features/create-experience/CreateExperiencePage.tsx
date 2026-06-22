import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ImagePlus, Send } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { useAuth } from "../../app/auth-context"
import { useRepository } from "../../app/repository-context"
import { useToast } from "../../app/toast-context"
import {
  getAcceptedMediaTypes,
  getMaxBytesForMime,
  isSupportedMimeType,
} from "../../lib/media/media-config"
import { type MediaType, VISIBILITIES } from "../../types/domain"

const ExperienceFormSchema = z.object({
  mediaName: z.string().min(1, "사진 또는 영상을 선택해주세요."),
  mediaType: z.enum(["image", "video"]),
  mimeType: z.string().min(1),
  sizeBytes: z.number().min(1),
  placeId: z.string().min(1, "장소 선택은 필수입니다."),
  caption: z.string().min(4, "한 문장을 조금 더 남겨주세요.").max(120),
  tags: z.string(),
  visitedAt: z.string(),
  showVisitedAt: z.boolean(),
  visibility: z.enum(VISIBILITIES),
})

type ExperienceForm = z.infer<typeof ExperienceFormSchema>

export function CreateExperiencePage() {
  const repository = useRepository()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { viewer } = useAuth()
  const { showToast } = useToast()
  const [fileError, setFileError] = useState<string | null>(null)
  const { data: placeResults } = useQuery({
    queryKey: ["search", ""],
    queryFn: () => repository.search(""),
  })
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ExperienceForm>({
    resolver: zodResolver(ExperienceFormSchema),
    defaultValues: {
      mediaName: "",
      mediaType: "image",
      mimeType: "",
      sizeBytes: 0,
      placeId: "",
      caption: "",
      tags: "비 오는 날",
      visitedAt: new Date().toISOString().slice(0, 10),
      showVisitedAt: true,
      visibility: "public",
    },
  })

  const selectedPlaceId = watch("placeId")

  const onFileChange = (files: FileList | null): void => {
    const file = files?.item(0) ?? null
    if (file === null) return
    if (!isSupportedMimeType(file.type)) {
      setFileError("지원하지 않는 파일 형식입니다.")
      return
    }
    if (file.size > getMaxBytesForMime(file.type)) {
      setFileError("파일 크기가 설정된 제한을 초과했습니다.")
      return
    }
    const mediaType: MediaType = file.type.startsWith("video/") ? "video" : "image"
    setFileError(null)
    setValue("mediaName", file.name, { shouldValidate: true })
    setValue("mediaType", mediaType, { shouldValidate: true })
    setValue("mimeType", file.type, { shouldValidate: true })
    setValue("sizeBytes", file.size, { shouldValidate: true })
  }

  const onSubmit = handleSubmit(async (values) => {
    if (viewer === null) {
      navigate("/auth", { state: { returnTo: "/create/experience", pendingAction: null } })
      return
    }
    const tags = values.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
    const experience = await repository.createExperience({
      ...values,
      tags,
      visitedAt: values.visitedAt.length > 0 ? new Date(values.visitedAt).toISOString() : null,
    })
    await queryClient.invalidateQueries()
    showToast({
      message: "장소를 남겼어요.",
      action: { label: "내 장소에서 보기", to: "/library" },
    })
    navigate(`/places/${experience.placeId}`)
  })

  return (
    <section className="page create-page">
      <div className="page-kicker">장소 경험</div>
      <h1>장소를 먼저 정하고 한 문장을 남겨요.</h1>
      <form className="form-card" onSubmit={(event) => void onSubmit(event)}>
        <label>
          <span>미디어</span>
          <input
            type="file"
            accept={getAcceptedMediaTypes()}
            onChange={(event) => onFileChange(event.target.files)}
          />
          <input type="hidden" {...register("mediaName")} />
          <input type="hidden" {...register("mediaType")} />
          <input type="hidden" {...register("mimeType")} />
          <input
            type="hidden"
            value={watch("sizeBytes")}
            {...register("sizeBytes", { valueAsNumber: true })}
          />
          {fileError === null ? null : <small className="field-error">{fileError}</small>}
          {errors.mediaName === undefined ? null : (
            <small className="field-error">{errors.mediaName.message}</small>
          )}
        </label>
        <label>
          <span>장소</span>
          <select {...register("placeId")}>
            <option value="">장소를 선택하세요</option>
            {placeResults?.places.map((place) => (
              <option key={place.id} value={place.id}>
                {place.name} · {place.region}
              </option>
            ))}
          </select>
          {errors.placeId === undefined ? null : (
            <small className="field-error">{errors.placeId.message}</small>
          )}
        </label>
        <label>
          <span>한 문장</span>
          <textarea rows={4} {...register("caption")} />
          {errors.caption === undefined ? null : (
            <small className="field-error">{errors.caption.message}</small>
          )}
        </label>
        <label>
          <span>태그</span>
          <input {...register("tags")} placeholder="비 오는 날, 오래 머물기 좋은 곳" />
        </label>
        <div className="field-grid">
          <label>
            <span>방문일</span>
            <input type="date" {...register("visitedAt")} />
          </label>
          <label>
            <span>공개 범위</span>
            <select {...register("visibility")}>
              <option value="public">전체 공개</option>
              <option value="unlisted">링크 공개</option>
              <option value="private">나만 보기</option>
            </select>
          </label>
        </div>
        <label className="check-row">
          <input type="checkbox" {...register("showVisitedAt")} />
          방문일 표시
        </label>
        <div className="preview-card">
          <ImagePlus aria-hidden="true" />
          <span>
            {selectedPlaceId.length === 0
              ? "장소를 선택하면 미리보기가 완성됩니다."
              : "미리보기 준비 완료"}
          </span>
        </div>
        <button type="submit" className="primary-button" disabled={isSubmitting}>
          <Send aria-hidden="true" size={18} />
          {isSubmitting ? "게시 중" : "게시"}
        </button>
      </form>
    </section>
  )
}

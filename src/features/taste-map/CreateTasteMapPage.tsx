import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ArrowDown, ArrowUp, Map as MapIcon } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { useAuth } from "../../app/auth-context"
import { useRepository } from "../../app/repository-context"
import { useToast } from "../../app/toast-context"
import { VISIBILITIES } from "../../types/domain"

const TasteMapFormSchema = z.object({
  title: z.string().min(2, "제목을 입력해주세요."),
  story: z.string().min(8, "이 지도의 이야기를 남겨주세요."),
  visibility: z.enum(VISIBILITIES),
})

type TasteMapForm = z.infer<typeof TasteMapFormSchema>

function moveItem(
  items: readonly string[],
  id: string,
  direction: "up" | "down",
): readonly string[] {
  const index = items.indexOf(id)
  if (index < 0) return items
  const targetIndex = direction === "up" ? index - 1 : index + 1
  if (targetIndex < 0 || targetIndex >= items.length) return items
  return items.map((item, itemIndex) => {
    if (itemIndex === index) return items[targetIndex] ?? item
    if (itemIndex === targetIndex) return id
    return item
  })
}

export function CreateTasteMapPage() {
  const repository = useRepository()
  const { viewer } = useAuth()
  const { showToast } = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { data: library } = useQuery({
    queryKey: ["library"],
    queryFn: () => repository.getLibrary(),
  })
  const [selected, setSelected] = useState<readonly string[]>([])
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TasteMapForm>({
    resolver: zodResolver(TasteMapFormSchema),
    defaultValues: { title: "", story: "", visibility: "public" },
  })

  const togglePlace = (placeId: string): void => {
    setSelected((current) =>
      current.includes(placeId) ? current.filter((id) => id !== placeId) : [...current, placeId],
    )
  }

  const onSubmit = handleSubmit(async (values) => {
    if (viewer === null) {
      navigate("/auth", { state: { returnTo: "/maps/new", pendingAction: null } })
      return
    }
    const map = await repository.createTasteMap({ ...values, placeIds: selected })
    await queryClient.invalidateQueries()
    showToast({
      message: "취향 지도를 만들었어요.",
      action: { label: "지도 나누기", to: `/maps/${map.id}` },
    })
    navigate(`/maps/${map.id}`)
  })

  return (
    <section className="page create-page">
      <div className="page-kicker">취향 지도 만들기</div>
      <h1>내 장소에서 골라 순서를 정해요.</h1>
      <form className="form-card" onSubmit={(event) => void onSubmit(event)}>
        <label>
          <span>제목</span>
          <input {...register("title")} placeholder="비 오는 날 오래 앉기" />
          {errors.title === undefined ? null : (
            <small className="field-error">{errors.title.message}</small>
          )}
        </label>
        <label>
          <span>이 지도의 이야기</span>
          <textarea rows={4} {...register("story")} />
          {errors.story === undefined ? null : (
            <small className="field-error">{errors.story.message}</small>
          )}
        </label>
        <label>
          <span>공개 범위</span>
          <select {...register("visibility")}>
            <option value="public">전체 공개</option>
            <option value="unlisted">링크 공개</option>
            <option value="private">나만 보기</option>
          </select>
        </label>
        <div className="select-list">
          {library?.savedPlaces.map((place) => (
            <label key={place.id} className="check-row">
              <input
                type="checkbox"
                checked={selected.includes(place.id)}
                onChange={() => togglePlace(place.id)}
              />
              {place.name}
            </label>
          ))}
        </div>
        <div className="selected-order">
          {selected.map((placeId) => {
            const place = library?.savedPlaces.find((item) => item.id === placeId)
            if (place === undefined) return null
            return (
              <div key={placeId} className="order-row">
                <span>{place.name}</span>
                <button
                  type="button"
                  aria-label={`${place.name} 위로 이동`}
                  onClick={() => setSelected((items) => moveItem(items, placeId, "up"))}
                >
                  <ArrowUp aria-hidden="true" size={16} />
                </button>
                <button
                  type="button"
                  aria-label={`${place.name} 아래로 이동`}
                  onClick={() => setSelected((items) => moveItem(items, placeId, "down"))}
                >
                  <ArrowDown aria-hidden="true" size={16} />
                </button>
              </div>
            )
          })}
        </div>
        {selected.length === 1 ? (
          <small className="field-error">장소를 2개 이상 선택해주세요.</small>
        ) : null}
        <button
          type="submit"
          className="primary-button"
          disabled={isSubmitting || selected.length < 2}
        >
          <MapIcon aria-hidden="true" size={18} />
          지도 나누기
        </button>
      </form>
    </section>
  )
}

import { useQuery } from "@tanstack/react-query"
import { Flag, MapPinned } from "lucide-react"
import { useParams } from "react-router-dom"
import { useRepository } from "../../app/repository-context"
import { Chip } from "../../components/common/chip"
import { EmptyState } from "../../components/common/empty-state"
import { Section } from "../../components/common/section"
import { ToneMedia } from "../../components/common/tone-media"
import { ExperienceCard } from "../../components/experience/experience-card"
import { TasteMapCard } from "../../components/taste-map/taste-map-card"
import { useSavePlaceAction } from "../../hooks/use-save-place-action"
import { trackEvent } from "../../lib/analytics/analytics"

const placeFilters = ["최신", "사진", "영상", "태그"] as const

export function PlaceDetailPage() {
  const { placeId } = useParams()
  const repository = useRepository()
  const savePlace = useSavePlaceAction()
  const { data: place } = useQuery({
    queryKey: ["place", placeId],
    queryFn: () => repository.getPlace(placeId ?? ""),
    enabled: placeId !== undefined,
  })

  if (place === null) {
    return (
      <EmptyState
        title="장소를 찾을 수 없어요"
        description="공개되지 않았거나 삭제된 장소입니다."
      />
    )
  }
  if (place === undefined) return <section className="page">장소를 불러오는 중입니다.</section>

  const detail = place
  trackEvent("place_page_viewed", {
    contentId: detail.place.id,
    contentType: "place",
    mode: "demo",
  })

  return (
    <section className="page place-page">
      <div className="place-overview">
        <ToneMedia
          tone={detail.place.representativeTone}
          shape="wide"
          label={detail.place.category}
        />
        <div className="place-title">
          <div className="place-title-copy">
            <div className="page-kicker">{detail.place.region}</div>
            <h1>{detail.place.name}</h1>
            <p>{detail.place.address}</p>
          </div>
          <fieldset className="place-actions">
            <legend className="sr-only">장소 상세 주요 액션</legend>
            <button
              type="button"
              className="primary-button"
              onClick={() =>
                void savePlace(
                  { placeId: detail.place.id, sourceExperienceId: null },
                  detail.place.name,
                )
              }
            >
              내 장소에 담기
            </button>
            <button type="button" className="secondary-button">
              <MapPinned aria-hidden="true" size={18} />
              지도에서 보기
            </button>
          </fieldset>
        </div>
      </div>
      <fieldset className="place-filter-row">
        <legend className="sr-only">장소 경험 필터</legend>
        {placeFilters.map((filter, index) => (
          <Chip key={filter} isActive={index === 0}>
            {filter}
          </Chip>
        ))}
      </fieldset>
      <Section title="이 장소에 남겨진 경험">
        <div className="card-list">
          {detail.experiences.map((card) => (
            <ExperienceCard
              key={card.experience.id}
              card={card}
              onSave={() =>
                void savePlace(
                  { placeId: card.place.id, sourceExperienceId: card.experience.id },
                  card.place.name,
                )
              }
            />
          ))}
        </div>
      </Section>
      <Section title="이 장소가 포함된 취향 지도">
        <div className="horizontal-list square-list">
          {detail.maps.map((card) => (
            <TasteMapCard key={card.map.id} card={card} />
          ))}
        </div>
      </Section>
      <div className="utility-row place-utility-actions">
        <button type="button" className="secondary-button">
          정보 수정 요청
        </button>
        <button type="button" className="secondary-button">
          <Flag aria-hidden="true" size={18} />
          신고
        </button>
      </div>
    </section>
  )
}

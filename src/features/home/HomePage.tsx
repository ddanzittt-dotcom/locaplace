import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useRepository } from "../../app/repository-context"
import { Section } from "../../components/common/section"
import { SharePanel } from "../../components/common/share-panel"
import { ExperienceCard } from "../../components/experience/experience-card"
import { TasteMapCard } from "../../components/taste-map/taste-map-card"
import { useSavePlaceAction } from "../../hooks/use-save-place-action"
import type { SharePayload } from "../../types/domain"

export function HomePage() {
  const repository = useRepository()
  const savePlace = useSavePlaceAction()
  const [sharePayload, setSharePayload] = useState<SharePayload | null>(null)
  const { data: homeData } = useQuery({ queryKey: ["home"], queryFn: () => repository.getHome() })

  if (homeData === undefined) return <section className="page">홈을 불러오는 중입니다.</section>

  return (
    <section className="page home-page">
      <div className="page-kicker">장소를 남기고, 취향을 지도로 나누다</div>
      <h1>오늘 볼 장소</h1>
      <div className="filter-row">
        <button type="button" className="chip chip-active">
          전체
        </button>
        <button type="button" className="chip">
          장소
        </button>
        <button type="button" className="chip">
          지도
        </button>
      </div>

      <Section title="최근 본 장소와 지도">
        <div className="horizontal-list">
          {homeData.recent.map((item) =>
            "experience" in item ? (
              <ExperienceCard
                key={item.experience.id}
                card={item}
                onSave={() =>
                  void savePlace(
                    { placeId: item.place.id, sourceExperienceId: item.experience.id },
                    item.place.name,
                  )
                }
                onShare={() =>
                  void repository.shareExperience(item.experience.id).then(setSharePayload)
                }
              />
            ) : (
              <TasteMapCard
                key={item.map.id}
                card={item}
                onShare={() => void repository.shareTasteMap(item.map.id).then(setSharePayload)}
              />
            ),
          )}
        </div>
      </Section>

      <Section
        title="내 주변에 새로 남겨진 경험"
        subtitle="GPS를 장소로 확정하지 않고 주변 제안만 보여줍니다."
      >
        <div className="card-list">
          {homeData.nearbyExperiences.map((card) => (
            <ExperienceCard
              key={card.experience.id}
              card={card}
              onSave={() =>
                void savePlace(
                  { placeId: card.place.id, sourceExperienceId: card.experience.id },
                  card.place.name,
                )
              }
              onShare={() =>
                void repository.shareExperience(card.experience.id).then(setSharePayload)
              }
            />
          ))}
        </div>
      </Section>

      <Section title="이번 주의 취향 지도">
        <div className="horizontal-list square-list">
          {homeData.weeklyMaps.map((card) => (
            <TasteMapCard
              key={card.map.id}
              card={card}
              onShare={() => void repository.shareTasteMap(card.map.id).then(setSharePayload)}
            />
          ))}
        </div>
      </Section>

      <Section title="최근 많이 담긴 장소">
        <div className="place-list">
          {homeData.popularPlaces.slice(0, 4).map((place) => (
            <Link className="place-row" to={`/places/${place.id}`} key={place.id}>
              <strong>{place.name}</strong>
              <span>
                {place.region} · {place.category}
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="로컬 큐레이터가 만든 지도">
        <div className="horizontal-list square-list">
          {homeData.curatorMaps.map((card) => (
            <TasteMapCard
              key={card.map.id}
              card={card}
              onShare={() => void repository.shareTasteMap(card.map.id).then(setSharePayload)}
            />
          ))}
        </div>
      </Section>
      <SharePanel payload={sharePayload} onClose={() => setSharePayload(null)} />
    </section>
  )
}

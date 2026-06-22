import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Grid2X2, List, Plus } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useRepository } from "../../app/repository-context"
import { Chip } from "../../components/common/chip"
import { EmptyState } from "../../components/common/empty-state"
import { Section } from "../../components/common/section"
import { TasteMapCard } from "../../components/taste-map/taste-map-card"
import { trackEvent } from "../../lib/analytics/analytics"

export function LibraryPage() {
  const repository = useRepository()
  const queryClient = useQueryClient()
  const [tab, setTab] = useState<"places" | "myMaps" | "savedMaps">("places")
  const [view, setView] = useState<"list" | "grid">("list")
  const { data: library } = useQuery({
    queryKey: ["library"],
    queryFn: () => repository.getLibrary(),
  })

  trackEvent("library_viewed", { mode: "demo" })

  if (library === undefined)
    return <section className="page">라이브러리를 불러오는 중입니다.</section>

  const removePlace = async (placeId: string): Promise<void> => {
    await repository.unsavePlace(placeId)
    await queryClient.invalidateQueries()
  }

  return (
    <section className="page library-page">
      <div className="page-kicker">라이브러리</div>
      <h1>내 장소가 쌓이는 곳</h1>
      <div className="filter-row">
        <Chip isActive={tab === "places"} onClick={() => setTab("places")}>
          내 장소
        </Chip>
        <Chip isActive={tab === "myMaps"} onClick={() => setTab("myMaps")}>
          내 지도
        </Chip>
        <Chip isActive={tab === "savedMaps"} onClick={() => setTab("savedMaps")}>
          저장한 지도
        </Chip>
      </div>
      <div className="utility-row">
        <button
          type="button"
          className="icon-button"
          onClick={() => setView("list")}
          aria-label="목록 보기"
        >
          <List aria-hidden="true" />
        </button>
        <button
          type="button"
          className="icon-button"
          onClick={() => setView("grid")}
          aria-label="격자 보기"
        >
          <Grid2X2 aria-hidden="true" />
        </button>
        <Link className="primary-button" to="/maps/new">
          <Plus aria-hidden="true" size={18} />
          취향 지도 만들기
        </Link>
      </div>
      {tab === "places" ? (
        <Section title="내 장소">
          {library.savedPlaces.length === 0 ? (
            <EmptyState
              title="아직 담은 장소가 없어요"
              description="홈이나 탐색에서 장소를 담아보세요."
            />
          ) : (
            <div className={view === "grid" ? "place-grid" : "place-list"}>
              {library.savedPlaces.map((place) => (
                <div key={place.id} className="place-row">
                  <Link to={`/places/${place.id}`}>
                    <strong>{place.name}</strong>
                    <span>
                      {place.region} · {place.category}
                    </span>
                  </Link>
                  <button type="button" onClick={() => void removePlace(place.id)}>
                    저장 취소
                  </button>
                </div>
              ))}
            </div>
          )}
        </Section>
      ) : null}
      {tab === "myMaps" ? (
        <Section title="내 지도">
          <div className="horizontal-list square-list">
            {library.myMaps.map((card) => (
              <TasteMapCard key={card.map.id} card={card} />
            ))}
          </div>
        </Section>
      ) : null}
      {tab === "savedMaps" ? (
        <Section title="저장한 지도">
          <div className="horizontal-list square-list">
            {library.savedMaps.map((card) => (
              <TasteMapCard key={card.map.id} card={card} />
            ))}
          </div>
        </Section>
      ) : null}
    </section>
  )
}

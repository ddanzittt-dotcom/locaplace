import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Grid2X2, List, Map as MapIcon, Share2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../app/auth-context"
import { useRepository } from "../../app/repository-context"
import { Chip } from "../../components/common/chip"
import { EmptyState } from "../../components/common/empty-state"
import { Section } from "../../components/common/section"
import { TasteMapCard } from "../../components/taste-map/taste-map-card"
import { trackEvent } from "../../lib/analytics/analytics"

export function LibraryPage() {
  const repository = useRepository()
  const queryClient = useQueryClient()
  const { viewer } = useAuth()
  const [tab, setTab] = useState<"places" | "myMaps" | "savedMaps">("places")
  const [view, setView] = useState<"list" | "grid">("list")
  const [selectedPlaceIds, setSelectedPlaceIds] = useState<readonly string[]>([])
  const { data: library } = useQuery({
    queryKey: ["library"],
    queryFn: () => repository.getLibrary(),
  })

  useEffect(() => {
    trackEvent("library_viewed", { mode: "demo" })
  }, [])

  if (library === undefined) return <section className="page">내 공간을 불러오는 중입니다.</section>

  const removePlace = async (placeId: string): Promise<void> => {
    await repository.unsavePlace(placeId)
    await queryClient.invalidateQueries()
  }
  const toggleSelectedPlace = (placeId: string): void => {
    setSelectedPlaceIds((current) =>
      current.includes(placeId) ? current.filter((id) => id !== placeId) : [...current, placeId],
    )
  }
  const featuredMap = library.myMaps[0] ?? library.savedMaps[0]
  const selectedPlaceQuery = new URLSearchParams({
    places: selectedPlaceIds.join(","),
  }).toString()

  return (
    <section className="page library-page">
      <div className="profile-hero-card">
        <div className={`profile-avatar tone-${viewer?.avatarTone ?? "coral"}`}>
          {viewer?.name[0] ?? "L"}
        </div>
        <div>
          <p className="page-kicker">내 공간</p>
          <h1>{viewer?.name ?? "LOCA"}의 장소 아카이브</h1>
          <p className="lead">{viewer?.bio ?? "내 장소와 취향 지도를 한곳에서 관리해요."}</p>
          <div className="tag-row">
            <Chip>저장 장소</Chip>
            <Chip>취향 지도</Chip>
          </div>
        </div>
      </div>

      <div className="profile-stats">
        <span>
          <strong>{library.savedPlaces.length}</strong>
          <small>장소</small>
        </span>
        <span>
          <strong>{library.myMaps.length}</strong>
          <small>내 지도</small>
        </span>
        <span>
          <strong>{library.savedMaps.length}</strong>
          <small>저장한 지도</small>
        </span>
      </div>

      {featuredMap === undefined ? null : (
        <section className="featured-map-card">
          <span>대표 취향 지도</span>
          <h2>{featuredMap.map.title}</h2>
          <p>
            {featuredMap.places.length}개 장소 ·{" "}
            {featuredMap.map.visibility === "public" ? "공개" : "비공개"}
          </p>
          <Link
            className="icon-button"
            to={`/maps/${featuredMap.map.id}`}
            aria-label="대표 지도 열기"
          >
            <Share2 aria-hidden="true" size={17} />
          </Link>
        </section>
      )}

      <div className="library-toolbar">
        <fieldset className="profile-tabs">
          <legend className="sr-only">내 공간 보기</legend>
          <Chip isActive={tab === "places"} onClick={() => setTab("places")}>
            내 장소
          </Chip>
          <Chip isActive={tab === "myMaps"} onClick={() => setTab("myMaps")}>
            내 지도
          </Chip>
          <Chip isActive={tab === "savedMaps"} onClick={() => setTab("savedMaps")}>
            저장한 지도
          </Chip>
        </fieldset>
        {tab === "places" ? (
          <fieldset className="library-view-toggle">
            <legend className="sr-only">내 장소 보기 방식</legend>
            <button
              type="button"
              className={
                view === "list"
                  ? "icon-button library-toggle-button icon-button-active"
                  : "icon-button library-toggle-button"
              }
              onClick={() => setView("list")}
              aria-label="목록 보기"
            >
              <List aria-hidden="true" />
            </button>
            <button
              type="button"
              className={
                view === "grid"
                  ? "icon-button library-toggle-button icon-button-active"
                  : "icon-button library-toggle-button"
              }
              onClick={() => setView("grid")}
              aria-label="격자 보기"
            >
              <Grid2X2 aria-hidden="true" />
            </button>
          </fieldset>
        ) : null}
      </div>

      {tab === "places" ? (
        <Section title="내 장소">
          {library.savedPlaces.length === 0 ? (
            <EmptyState
              title="아직 담은 장소가 없어요"
              description="홈이나 탐색에서 장소를 담아보세요."
            />
          ) : (
            <>
              <div className="library-selection-bar">
                <span>
                  {selectedPlaceIds.length === 0
                    ? "장소를 선택해 취향 지도를 만들어요."
                    : `${selectedPlaceIds.length}개 장소 선택됨`}
                </span>
                {selectedPlaceIds.length >= 2 ? (
                  <Link
                    className="primary-button library-map-action"
                    to={`/maps/new?${selectedPlaceQuery}`}
                  >
                    <MapIcon aria-hidden="true" size={17} />
                    선택한 장소로 지도 만들기
                  </Link>
                ) : (
                  <button type="button" className="primary-button library-map-action" disabled>
                    <MapIcon aria-hidden="true" size={17} />
                    2개 이상 선택
                  </button>
                )}
              </div>
              <div className={view === "grid" ? "place-grid" : "place-list"}>
                {library.savedPlaces.map((place) => {
                  const isSelected = selectedPlaceIds.includes(place.id)
                  return (
                    <div
                      key={place.id}
                      className={
                        isSelected
                          ? "place-row selectable-place selected"
                          : "place-row selectable-place"
                      }
                    >
                      <label className="selectable-place-control">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectedPlace(place.id)}
                        />
                        <span>
                          <strong>{place.name}</strong>
                          <small>
                            {place.region} · {place.category}
                          </small>
                        </span>
                      </label>
                      <div className="place-row-actions">
                        <Link to={`/places/${place.id}`}>보기</Link>
                        <button type="button" onClick={() => void removePlace(place.id)}>
                          저장 취소
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
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

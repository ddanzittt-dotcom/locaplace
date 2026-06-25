import { useQuery, useQueryClient } from "@tanstack/react-query"
import { BookmarkPlus, List, Map as MapIcon, Share2 } from "lucide-react"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { useRepository } from "../../app/repository-context"
import { useToast } from "../../app/toast-context"
import { SharePanel } from "../../components/common/share-panel"
import { ToneMedia } from "../../components/common/tone-media"
import { MapPreview } from "../../components/taste-map/map-preview"
import { trackEvent } from "../../lib/analytics/analytics"
import type { SharePayload } from "../../types/domain"

export function TasteMapDetailPage() {
  const { mapId } = useParams()
  const repository = useRepository()
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const [view, setView] = useState<"list" | "map">("list")
  const [sharePayload, setSharePayload] = useState<SharePayload | null>(null)
  const { data: tasteMap } = useQuery({
    queryKey: ["map", mapId],
    queryFn: () => repository.getTasteMap(mapId ?? ""),
    enabled: mapId !== undefined,
  })

  if (tasteMap === null) return <section className="page">지도를 찾을 수 없습니다.</section>
  if (tasteMap === undefined) return <section className="page">지도를 불러오는 중입니다.</section>

  const detail = tasteMap

  const saveMap = async (): Promise<void> => {
    await repository.saveTasteMap(detail.map.id)
    await queryClient.invalidateQueries()
    showToast({
      message: "취향 지도를 저장했어요.",
      action: { label: "내 공간", to: "/me" },
    })
  }

  const toggleView = (nextView: "list" | "map"): void => {
    setView(nextView)
    trackEvent("map_view_toggled", {
      contentId: detail.map.id,
      contentType: "taste_map",
      mode: "demo",
    })
  }

  return (
    <section className="page map-detail-page">
      <ToneMedia tone={detail.map.coverTone} shape="square" label="취향 지도 커버" />
      <div className="page-kicker">{detail.owner.name}</div>
      <div className="map-title-row">
        <h1>{detail.map.title}</h1>
        <fieldset className="map-title-actions">
          <legend className="sr-only">지도 작업</legend>
          <button
            type="button"
            className="map-title-action map-title-action-save"
            onClick={() => void saveMap()}
            aria-label="지도 저장"
            title="지도 저장"
          >
            <BookmarkPlus aria-hidden="true" size={17} />
          </button>
          <button
            type="button"
            className="map-title-action map-title-action-share"
            onClick={() => void repository.shareTasteMap(detail.map.id).then(setSharePayload)}
            aria-label="지도 공유"
            title="지도 공유"
          >
            <Share2 aria-hidden="true" size={17} />
          </button>
        </fieldset>
      </div>
      <p className="lead">{detail.map.story}</p>
      <p className="card-meta">
        {detail.places.length}개 장소 · 저장 {detail.map.saveCount}
      </p>
      <div className="filter-row">
        <button
          type="button"
          className={`chip ${view === "list" ? "chip-active" : ""}`}
          onClick={() => toggleView("list")}
        >
          <List aria-hidden="true" size={16} />
          목록 보기
        </button>
        <button
          type="button"
          className={`chip ${view === "map" ? "chip-active" : ""}`}
          onClick={() => toggleView("map")}
        >
          <MapIcon aria-hidden="true" size={16} />
          지도 보기
        </button>
      </div>
      {view === "list" ? (
        <div className="place-list">
          {detail.places.map((place, index) => (
            <div className="place-row numbered" key={place.id}>
              <b>{index + 1}</b>
              <span>
                <strong>{place.name}</strong>
                <small>
                  {place.region} · {place.category}
                </small>
              </span>
            </div>
          ))}
        </div>
      ) : (
        <MapPreview places={detail.places} />
      )}
      <SharePanel payload={sharePayload} onClose={() => setSharePayload(null)} />
    </section>
  )
}

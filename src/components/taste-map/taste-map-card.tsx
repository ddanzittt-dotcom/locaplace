import { BookmarkPlus, Share2 } from "lucide-react"
import { Link } from "react-router-dom"
import type { TasteMapCardModel } from "../../types/domain"
import { ToneMedia } from "../common/tone-media"

type TasteMapCardProps = {
  readonly card: TasteMapCardModel
  readonly onSave?: () => void
  readonly onShare?: () => void
}

export function TasteMapCard({ card, onSave, onShare }: TasteMapCardProps) {
  return (
    <article className="map-card">
      <Link to={`/maps/${card.map.id}`} aria-label={`${card.map.title} 열기`}>
        <ToneMedia tone={card.map.coverTone} shape="square" label="취향 지도" />
      </Link>
      <h3>{card.map.title}</h3>
      <p>{card.map.story}</p>
      <p className="card-meta">
        {card.places.length}개 장소 · {card.owner.name}
      </p>
      <div className="card-actions">
        {onSave === undefined ? null : (
          <button type="button" className="action-button" onClick={onSave}>
            <BookmarkPlus aria-hidden="true" size={17} />
            {card.isSaved ? "저장됨" : "지도 저장"}
          </button>
        )}
        <button type="button" className="icon-button" onClick={onShare} aria-label="지도 공유">
          <Share2 aria-hidden="true" size={17} />
        </button>
      </div>
    </article>
  )
}

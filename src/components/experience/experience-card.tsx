import { BookmarkPlus, MapPin, Share2 } from "lucide-react"
import { Link } from "react-router-dom"
import type { ExperienceCardModel } from "../../types/domain"
import { Chip } from "../common/chip"
import { ToneMedia } from "../common/tone-media"

type ExperienceCardProps = {
  readonly card: ExperienceCardModel
  readonly onSave: () => void
  readonly onShare?: () => void
}

export function ExperienceCard({ card, onSave, onShare }: ExperienceCardProps) {
  const media = card.media[0]
  return (
    <article className="experience-card">
      <Link className="place-heading" to={`/places/${card.place.id}`}>
        <MapPin aria-hidden="true" size={17} />
        <span>
          <strong>{card.place.name}</strong>
          <small>{card.place.region}</small>
        </span>
      </Link>
      <ToneMedia
        tone={media?.tone ?? card.place.representativeTone}
        mediaType={media?.mediaType ?? "image"}
        label={card.place.category}
      />
      <p className="card-caption">{card.experience.caption}</p>
      <div className="tag-row">
        {card.experience.tags.slice(0, 2).map((tag) => (
          <Chip key={tag}>{tag}</Chip>
        ))}
      </div>
      <p className="card-meta">
        {card.author.name} · {new Date(card.experience.createdAt).toLocaleDateString("ko-KR")}
      </p>
      <div className="card-actions">
        <button type="button" className="action-button" onClick={onSave}>
          <BookmarkPlus aria-hidden="true" size={17} />
          {card.isSaved ? "담김" : "내 장소에 담기"}
        </button>
        <Link className="action-button" to={`/places/${card.place.id}`}>
          이 장소 더 보기
        </Link>
        <button type="button" className="icon-button" onClick={onShare} aria-label="경험 공유">
          <Share2 aria-hidden="true" size={17} />
        </button>
      </div>
    </article>
  )
}

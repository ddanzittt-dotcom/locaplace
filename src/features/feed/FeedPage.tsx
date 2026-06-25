import { useQuery } from "@tanstack/react-query"
import { BookmarkPlus, MapPin, Share2, User } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useRepository } from "../../app/repository-context"
import { Chip } from "../../components/common/chip"
import { SharePanel } from "../../components/common/share-panel"
import { ToneMedia } from "../../components/common/tone-media"
import { useSavePlaceAction } from "../../hooks/use-save-place-action"
import type { SharePayload } from "../../types/domain"

function toPublicMediaUrl(path: string | null | undefined): string | undefined {
  if (path === null || path === undefined) return undefined
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) return path
  return `/${path}`
}

export function FeedPage() {
  const repository = useRepository()
  const savePlace = useSavePlaceAction()
  const [sharePayload, setSharePayload] = useState<SharePayload | null>(null)
  const { data: homeData } = useQuery({ queryKey: ["home"], queryFn: () => repository.getHome() })

  if (homeData === undefined) return <section className="page">피드를 불러오는 중입니다.</section>

  const feedCards = homeData.nearbyExperiences.slice(0, 4)

  return (
    <section className="feed-page" aria-label="장소 피드">
      <div className="feed-tabs" role="tablist" aria-label="피드 범위">
        <button type="button" className="feed-tab feed-tab-active" role="tab" aria-selected="true">
          추천
        </button>
        <button type="button" className="feed-tab" role="tab" aria-selected="false">
          팔로잉
        </button>
        <button type="button" className="feed-tab" role="tab" aria-selected="false">
          내 지역
        </button>
      </div>

      <div className="feed-stack" role="feed" aria-label="위아래로 넘기는 장소 피드">
        {feedCards.map((card, index) => {
          const media = card.media[0]
          const mediaSrc = toPublicMediaUrl(media?.storagePath)
          const posterSrc = toPublicMediaUrl(media?.posterPath)
          return (
            <article
              className="feed-story"
              key={card.experience.id}
              aria-label={`피드 ${index + 1}/${feedCards.length}: ${card.place.name}`}
              aria-posinset={index + 1}
              aria-setsize={feedCards.length}
            >
              <ToneMedia
                tone={media?.tone ?? card.place.representativeTone}
                mediaType={media?.mediaType ?? "image"}
                label={card.place.category}
                {...(mediaSrc === undefined ? {} : { src: mediaSrc })}
                {...(posterSrc === undefined ? {} : { posterSrc })}
                priority={index === 0}
              />
              <div className="feed-story-overlay" />
              <Link className="feed-place-pill" to={`/places/${card.place.id}`}>
                <MapPin aria-hidden="true" size={16} />
                {card.place.name} · {card.place.region}
              </Link>
              <div className="feed-copy">
                <p className="feed-author">
                  <span className={`mini-avatar tone-${card.author.avatarTone}`}>
                    {card.author.name[0]}
                  </span>
                  {card.author.name} ·{" "}
                  {new Date(card.experience.createdAt).toLocaleDateString("ko-KR")}
                </p>
                <h1>{card.experience.caption}</h1>
                <div className="tag-row">
                  {card.experience.tags.slice(0, 3).map((tag) => (
                    <Chip key={tag}>{tag}</Chip>
                  ))}
                </div>
              </div>
              <div className="feed-rail">
                <button
                  type="button"
                  className="feed-rail-button"
                  onClick={() =>
                    void savePlace(
                      { placeId: card.place.id, sourceExperienceId: card.experience.id },
                      card.place.name,
                    )
                  }
                >
                  <BookmarkPlus aria-hidden="true" size={19} />
                  <span>{card.isSaved ? "담김" : "담기"}</span>
                </button>
                <Link className="feed-rail-button" to={`/places/${card.place.id}`}>
                  <MapPin aria-hidden="true" size={19} />
                  <span>장소</span>
                </Link>
                <Link className="feed-rail-button" to={`/u/${card.author.handle}`}>
                  <User aria-hidden="true" size={19} />
                  <span>공간</span>
                </Link>
                <button
                  type="button"
                  className="feed-rail-button"
                  onClick={() =>
                    void repository.shareExperience(card.experience.id).then(setSharePayload)
                  }
                >
                  <Share2 aria-hidden="true" size={19} />
                  <span>공유</span>
                </button>
              </div>
            </article>
          )
        })}
      </div>
      <SharePanel payload={sharePayload} onClose={() => setSharePayload(null)} />
    </section>
  )
}

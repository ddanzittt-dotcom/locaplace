import { useQuery } from "@tanstack/react-query"
import { Search } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useRepository } from "../../app/repository-context"
import { Chip } from "../../components/common/chip"
import { Section } from "../../components/common/section"
import { ExperienceCard } from "../../components/experience/experience-card"
import { TasteMapCard } from "../../components/taste-map/taste-map-card"
import { useSavePlaceAction } from "../../hooks/use-save-place-action"
import { trackEvent } from "../../lib/analytics/analytics"

export function ExplorePage() {
  const repository = useRepository()
  const savePlace = useSavePlaceAction()
  const [query, setQuery] = useState("")
  const { data: results } = useQuery({
    queryKey: ["search", query],
    queryFn: () => repository.search(query),
  })

  const updateQuery = (value: string): void => {
    setQuery(value)
    trackEvent("explore_searched", { mode: "demo" })
  }

  return (
    <section className="page explore-page">
      <label className="search-box">
        <Search aria-hidden="true" size={18} />
        <input
          value={query}
          onChange={(event) => updateQuery(event.target.value)}
          placeholder="장소, 지역, 기분, 지도를 검색"
        />
      </label>
      <div className="tag-row">
        {["내 주변", "이번 주", "카페와 공간", "산책과 여행", "로컬 큐레이터", "비 오는 날"].map(
          (tag) => (
            <Chip key={tag}>{tag}</Chip>
          ),
        )}
      </div>
      <Section title="장소 경험">
        <div className="card-list">
          {results?.experiences.map((card) => (
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
      <Section title="장소">
        <div className="place-list">
          {results?.places.map((place) => (
            <Link key={place.id} className="place-row" to={`/places/${place.id}`}>
              <strong>{place.name}</strong>
              <span>
                {place.region} · {place.category}
              </span>
            </Link>
          ))}
        </div>
      </Section>
      <Section title="취향 지도">
        <div className="horizontal-list square-list">
          {results?.maps.map((card) => (
            <TasteMapCard key={card.map.id} card={card} />
          ))}
        </div>
      </Section>
    </section>
  )
}

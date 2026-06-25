import { useQuery } from "@tanstack/react-query"
import { CalendarDays, MapPin, Search } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useRepository } from "../../app/repository-context"
import { Chip } from "../../components/common/chip"
import { Section } from "../../components/common/section"
import { TasteMapCard } from "../../components/taste-map/taste-map-card"
import { trackEvent } from "../../lib/analytics/analytics"

const CATEGORY_FILTERS = ["전체", "카페", "산책", "행사", "전시", "서점"] as const

const LOCAL_PROGRAMS = [
  {
    title: "망원 골목 사진 산책",
    place: "망원시장 뒤편",
    schedule: "오늘 19:00",
    meta: "1.2km · 공동지도 참여",
  },
  {
    title: "서촌 책방 기록 모임",
    place: "달빛책방",
    schedule: "토요일 11:00",
    meta: "신청 중 · 12명",
  },
  {
    title: "비 오는 날 카페 큐레이션",
    place: "브루어스 커피",
    schedule: "이번 주",
    meta: "장소 기록 18개",
  },
] as const

export function ExplorePage() {
  const repository = useRepository()
  const [query, setQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<(typeof CATEGORY_FILTERS)[number]>("전체")
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
      <div className="page-kicker">탐색</div>
      <h1>지금 가까운 장소 흐름</h1>
      <label className="search-box">
        <Search aria-hidden="true" size={18} />
        <input
          value={query}
          onChange={(event) => updateQuery(event.target.value)}
          placeholder="행사, 프로그램, 장소, 지도를 검색"
        />
      </label>
      <div className="tag-row category-row">
        {CATEGORY_FILTERS.map((tag) => (
          <Chip key={tag} isActive={activeFilter === tag} onClick={() => setActiveFilter(tag)}>
            {tag}
          </Chip>
        ))}
      </div>

      <Section title="내 주변 행사·프로그램" subtitle="지금 참여할 수 있는 지역의 기회">
        <div className="horizontal-list event-list">
          {LOCAL_PROGRAMS.map((program) => (
            <article className="event-card" key={program.title}>
              <div className="event-media">
                <CalendarDays aria-hidden="true" size={18} />
                <span>{program.schedule}</span>
              </div>
              <div className="event-body">
                <h3>{program.title}</h3>
                <p>{program.place}</p>
                <small>{program.meta}</small>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section title="추천 지도" subtitle="큐레이터가 고른 장소 플레이리스트">
        <div className="horizontal-list square-list">
          {results?.maps.map((card) => (
            <TasteMapCard key={card.map.id} card={card} />
          ))}
        </div>
      </Section>

      <Section title="추천 장소" subtitle="최근 많이 담겼거나 새 경험이 쌓인 곳">
        <div className="place-list">
          {results?.places.slice(0, 4).map((place) => (
            <Link key={place.id} className="place-row rich-place-row" to={`/places/${place.id}`}>
              <span className={`place-thumb tone-${place.representativeTone}`}>
                <MapPin aria-hidden="true" size={18} />
              </span>
              <span>
                <strong>{place.name}</strong>
                <small>
                  {place.region} · {place.category}
                </small>
              </span>
            </Link>
          ))}
        </div>
      </Section>
    </section>
  )
}

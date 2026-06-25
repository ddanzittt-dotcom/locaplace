import { useQuery } from "@tanstack/react-query"
import { ChevronRight, MapPin } from "lucide-react"
import { Link } from "react-router-dom"
import { useRepository } from "../../app/repository-context"
import { Section } from "../../components/common/section"
import { HomeCalendar } from "./HomeCalendar"
import { HomeIntro } from "./HomeIntro"

export function HomePage() {
  const repository = useRepository()
  const { data: homeData } = useQuery({ queryKey: ["home"], queryFn: () => repository.getHome() })

  if (homeData === undefined) return <section className="page">홈을 불러오는 중입니다.</section>

  const recommendedPlaces = homeData.nearbyRecordablePlaces.slice(0, 3)

  return (
    <section className="page home-page">
      <HomeIntro />
      <HomeCalendar />

      <Section
        title="내 근처 기록할 만한 장소"
        subtitle="가까운 동네에서 오늘 남기기 좋은 곳을 골랐어요."
      >
        <div className="place-list">
          {recommendedPlaces.map((place) => (
            <Link className="place-row rich-place-row" to={`/places/${place.id}`} key={place.id}>
              <span className={`place-thumb tone-${place.representativeTone}`}>
                <MapPin aria-hidden="true" size={18} />
              </span>
              <span>
                <strong>{place.name}</strong>
                <small>
                  {place.region} · {place.category}
                </small>
              </span>
              <ChevronRight aria-hidden="true" size={18} />
            </Link>
          ))}
        </div>
      </Section>
    </section>
  )
}

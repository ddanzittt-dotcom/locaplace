import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { Link, useParams } from "react-router-dom"
import { useRepository } from "../../app/repository-context"
import { ExperienceCard } from "../../components/experience/experience-card"
import { useSavePlaceAction } from "../../hooks/use-save-place-action"

export function ShareExperiencePage() {
  const { token } = useParams()
  const repository = useRepository()
  const savePlace = useSavePlaceAction()
  const { data: results } = useQuery({
    queryKey: ["share-exp", token],
    queryFn: () => repository.search(""),
  })
  const card = useMemo(
    () => results?.experiences.find((item) => item.experience.shareToken === token) ?? null,
    [results, token],
  )

  if (card === null) return <section className="page">공개 경험을 찾을 수 없습니다.</section>
  return (
    <section className="page">
      <div className="page-kicker">공유된 장소 경험</div>
      <ExperienceCard
        card={card}
        onSave={() =>
          void savePlace(
            { placeId: card.place.id, sourceExperienceId: card.experience.id },
            card.place.name,
          )
        }
      />
      <Link className="secondary-button" to="/home">
        LOCA 둘러보기
      </Link>
    </section>
  )
}

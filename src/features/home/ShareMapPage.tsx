import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { Link, useParams } from "react-router-dom"
import { useRepository } from "../../app/repository-context"
import { TasteMapCard } from "../../components/taste-map/taste-map-card"

export function ShareMapPage() {
  const { token } = useParams()
  const repository = useRepository()
  const { data: results } = useQuery({
    queryKey: ["share-map", token],
    queryFn: () => repository.search(""),
  })
  const card = useMemo(
    () => results?.maps.find((item) => item.map.shareToken === token) ?? null,
    [results, token],
  )

  if (card === null) return <section className="page">공개 지도를 찾을 수 없습니다.</section>
  return (
    <section className="page">
      <div className="page-kicker">공유된 취향 지도</div>
      <TasteMapCard card={card} />
      <Link className="primary-button" to={`/maps/${card.map.id}`}>
        지도 열기
      </Link>
    </section>
  )
}

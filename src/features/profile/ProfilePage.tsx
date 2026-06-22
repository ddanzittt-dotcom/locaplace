import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { useRepository } from "../../app/repository-context"
import { Section } from "../../components/common/section"
import { ExperienceCard } from "../../components/experience/experience-card"
import { TasteMapCard } from "../../components/taste-map/taste-map-card"
import { useSavePlaceAction } from "../../hooks/use-save-place-action"

export function ProfilePage() {
  const { handle } = useParams()
  const repository = useRepository()
  const savePlace = useSavePlaceAction()
  const { data: profile } = useQuery({
    queryKey: ["profile", handle],
    queryFn: () => repository.getProfile(handle ?? ""),
    enabled: handle !== undefined,
  })

  if (profile === null) return <section className="page">프로필을 찾을 수 없습니다.</section>
  if (profile === undefined) return <section className="page">프로필을 불러오는 중입니다.</section>

  return (
    <section className="page profile-page">
      <div className={`profile-avatar tone-${profile.profile.avatarTone}`}>
        {profile.profile.name.slice(0, 1)}
      </div>
      <div className="page-kicker">@{profile.profile.handle}</div>
      <h1>{profile.profile.name}</h1>
      <p className="lead">{profile.profile.bio}</p>
      <Section title="대표 취향 지도">
        <div className="horizontal-list square-list">
          {profile.maps.slice(0, 2).map((card) => (
            <TasteMapCard key={card.map.id} card={card} />
          ))}
        </div>
      </Section>
      <Section title="공개 장소 경험">
        <div className="card-list">
          {profile.experiences.map((card) => (
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
    </section>
  )
}

import { useNavigate } from "react-router-dom"
import { PlaceExperienceComposer } from "./PlaceExperienceComposer"

export function CreateExperiencePage() {
  const navigate = useNavigate()
  return (
    <section className="page create-page modal-route-page" aria-label="장소 경험 작성">
      <PlaceExperienceComposer
        isOpen
        onClose={() => navigate("/home")}
        onPublished={(experience) => navigate(`/places/${experience.placeId}`)}
      />
    </section>
  )
}

import type { Place } from "../../types/domain"

export function MapPreview({ places }: { readonly places: readonly Place[] }) {
  return (
    <div className="map-preview" role="img" aria-label="장소 순서가 표시된 데모 지도">
      {places.map((place, index) => (
        <div
          key={place.id}
          className="map-pin"
          style={{
            left: `${18 + ((index * 23) % 58)}%`,
            top: `${20 + ((index * 19) % 54)}%`,
          }}
        >
          <span>{index + 1}</span>
          <small>{place.name}</small>
        </div>
      ))}
    </div>
  )
}

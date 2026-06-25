import { Bookmark, LocateFixed, Map as MapIcon, MapPin, Search } from "lucide-react"
import { useState } from "react"
import type { Place } from "../../types/domain"

type PlaceMode = "address" | "saved"

type PlaceSelectorProps = {
  readonly mode: PlaceMode
  readonly selectedPlaceId: string
  readonly addressQuery: string
  readonly savedQuery: string
  readonly searchPlaces: readonly Place[]
  readonly savedPlaces: readonly Place[]
  readonly nearbyPlaces: readonly Place[]
  readonly error: string | undefined
  readonly onModeChange: (mode: PlaceMode) => void
  readonly onAddressQueryChange: (query: string) => void
  readonly onSavedQueryChange: (query: string) => void
  readonly onUseCurrentLocation: () => void
  readonly onSelectPlace: (place: Place) => void
}

function placeMatches(place: Place, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (normalized.length === 0) return true
  return [place.name, place.region, place.category, place.address].some((value) =>
    value.toLowerCase().includes(normalized),
  )
}

function PlaceButton({
  place,
  selectedPlaceId,
  onSelectPlace,
}: {
  readonly place: Place
  readonly selectedPlaceId: string
  readonly onSelectPlace: (place: Place) => void
}) {
  const isSelected = selectedPlaceId === place.id
  return (
    <button
      type="button"
      className={isSelected ? "place-choice place-choice-selected" : "place-choice"}
      onClick={() => onSelectPlace(place)}
      aria-pressed={isSelected}
    >
      <MapPin aria-hidden="true" size={15} />
      <span>
        <strong>{place.name}</strong>
        <small>
          {place.address} · {place.category}
        </small>
      </span>
    </button>
  )
}

function MapPickerPanel({
  targetPlace,
  onSelectPlace,
}: {
  readonly targetPlace: Place | null
  readonly onSelectPlace: (place: Place) => void
}) {
  return (
    <div className="map-picker-panel">
      <div className="map-picker-surface" aria-hidden="true">
        <span />
        <MapPin size={18} />
      </div>
      <div className="map-picker-copy">
        <strong>{targetPlace?.name ?? "지도 위치"}</strong>
        <small>
          {targetPlace === null ? "검색 또는 내 주변 장소를 먼저 고르세요." : targetPlace.address}
        </small>
      </div>
      <button
        type="button"
        className="map-picker-confirm"
        disabled={targetPlace === null}
        onClick={() => {
          if (targetPlace !== null) onSelectPlace(targetPlace)
        }}
      >
        이 위치로 지정
      </button>
    </div>
  )
}

export function PlaceSelector({
  mode,
  selectedPlaceId,
  addressQuery,
  savedQuery,
  searchPlaces,
  savedPlaces,
  nearbyPlaces,
  error,
  onModeChange,
  onAddressQueryChange,
  onSavedQueryChange,
  onUseCurrentLocation,
  onSelectPlace,
}: PlaceSelectorProps) {
  const [isMapPickerOpen, setIsMapPickerOpen] = useState(false)
  const isAddressMapPickerOpen = mode === "address" && isMapPickerOpen
  const hasAddressQuery = addressQuery.trim().length > 0
  const filteredSavedPlaces = savedPlaces
    .filter((place) => placeMatches(place, savedQuery))
    .slice(0, 3)
  const nearbyPlaceChoices = nearbyPlaces.slice(0, 5)
  const searchPlaceChoices = hasAddressQuery
    ? searchPlaces.filter((place) => placeMatches(place, addressQuery)).slice(0, 3)
    : []
  const resultPlaces = isAddressMapPickerOpen
    ? []
    : mode === "address"
      ? searchPlaceChoices
      : filteredSavedPlaces
  const selectedPlace =
    [...searchPlaces, ...savedPlaces, ...nearbyPlaces].find(
      (place) => place.id === selectedPlaceId,
    ) ?? null
  const mapTargetPlace =
    selectedPlace ??
    searchPlaceChoices[0] ??
    filteredSavedPlaces[0] ??
    nearbyPlaceChoices[0] ??
    null

  return (
    <fieldset className="composer-fieldset">
      <legend>장소</legend>
      <div className="composer-mode-row" role="tablist" aria-label="장소 선택 방식">
        <button
          type="button"
          className={mode === "address" ? "mode-chip mode-chip-active" : "mode-chip"}
          onClick={() => onModeChange("address")}
          aria-selected={mode === "address"}
          role="tab"
        >
          <Search aria-hidden="true" size={15} />
          주소검색
        </button>
        <button
          type="button"
          className={mode === "saved" ? "mode-chip mode-chip-active" : "mode-chip"}
          onClick={() => onModeChange("saved")}
          aria-selected={mode === "saved"}
          role="tab"
        >
          <Bookmark aria-hidden="true" size={15} />내 장소
        </button>
      </div>

      {mode === "address" ? (
        <div className="address-search-stack">
          <div className="address-search-row">
            <label>
              <span className="sr-only">주소 검색</span>
              <input
                value={addressQuery}
                onChange={(event) => onAddressQueryChange(event.target.value)}
                placeholder="상호나 주소 검색"
              />
            </label>
            <button type="button" className="icon-text-button" onClick={onUseCurrentLocation}>
              <LocateFixed aria-hidden="true" size={15} />내 위치
            </button>
          </div>
          <button
            type="button"
            className="map-picker-trigger"
            onClick={() => setIsMapPickerOpen((current) => !current)}
            aria-expanded={isMapPickerOpen}
          >
            <MapIcon aria-hidden="true" size={15} />
            지도에서 위치 지정
          </button>
          {isAddressMapPickerOpen ? (
            <MapPickerPanel targetPlace={mapTargetPlace} onSelectPlace={onSelectPlace} />
          ) : null}
        </div>
      ) : (
        <label>
          <span className="sr-only">내 장소 검색</span>
          <input
            value={savedQuery}
            onChange={(event) => onSavedQueryChange(event.target.value)}
            placeholder="저장한 장소에서 검색"
          />
        </label>
      )}

      <div className="place-choice-list">
        {resultPlaces.map((place) => (
          <PlaceButton
            key={place.id}
            place={place}
            selectedPlaceId={selectedPlaceId}
            onSelectPlace={onSelectPlace}
          />
        ))}
      </div>
      {mode === "address" && !hasAddressQuery && !isAddressMapPickerOpen ? (
        <p className="place-result-empty">상호나 주소를 입력하면 맞는 장소가 나와요.</p>
      ) : null}
      {mode === "address" &&
      hasAddressQuery &&
      searchPlaceChoices.length === 0 &&
      !isAddressMapPickerOpen ? (
        <p className="place-result-empty">검색 결과가 없어요. 지도에서 위치를 지정할 수 있어요.</p>
      ) : null}
      {mode === "saved" && filteredSavedPlaces.length === 0 ? (
        <p className="place-result-empty">저장한 장소에서 일치하는 결과가 없어요.</p>
      ) : null}

      <div className="nearby-picks">
        <span>내 주변 장소</span>
        <div className="nearby-pick-row">
          {nearbyPlaceChoices.map((place) => (
            <button
              type="button"
              className={selectedPlaceId === place.id ? "nearby-pick selected" : "nearby-pick"}
              key={place.id}
              onClick={() => onSelectPlace(place)}
            >
              {place.name}
            </button>
          ))}
        </div>
      </div>
      {error === undefined ? null : <small className="field-error">{error}</small>}
    </fieldset>
  )
}

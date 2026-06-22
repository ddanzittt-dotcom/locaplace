import type { Coordinates, Place } from "../../types/domain"

export type PlaceSearchResult = {
  readonly provider: string
  readonly providerPlaceId: string
  readonly name: string
  readonly address: string
  readonly coordinates: Coordinates
  readonly category: string
}

export interface MapProvider {
  renderMap(container: HTMLElement, places: readonly Place[]): void
  geocode(query: string): Promise<Coordinates | null>
  reverseGeocode(location: Coordinates): Promise<string | null>
}

export interface PlaceSearchProvider {
  search(query: string, location?: Coordinates): Promise<readonly PlaceSearchResult[]>
  nearby(location: Coordinates): Promise<readonly PlaceSearchResult[]>
}

export class DemoMapProvider implements MapProvider, PlaceSearchProvider {
  renderMap(container: HTMLElement, places: readonly Place[]): void {
    container.dataset["placeCount"] = String(places.length)
  }

  async geocode(): Promise<Coordinates | null> {
    return { latitude: 37.5665, longitude: 126.978 }
  }

  async reverseGeocode(): Promise<string | null> {
    return "서울"
  }

  async search(query: string): Promise<readonly PlaceSearchResult[]> {
    if (query.trim().length === 0) return []
    return [
      {
        provider: "demo",
        providerPlaceId: `demo-${query}`,
        name: query,
        address: "서울 어딘가",
        coordinates: { latitude: 37.5665, longitude: 126.978 },
        category: "사용자 지정 장소",
      },
    ]
  }

  async nearby(): Promise<readonly PlaceSearchResult[]> {
    return []
  }
}

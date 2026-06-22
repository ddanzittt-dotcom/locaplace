import { beforeEach, describe, expect, it } from "vitest"
import { DemoRepository } from "../../src/repositories/demo/demo-repository"
import { loadDemoState, resetDemoState } from "../../src/repositories/demo/demo-storage"

describe("DemoRepository", () => {
  beforeEach(() => {
    window.localStorage.clear()
    resetDemoState()
  })

  it("Given a guest When saving after sign-in Then the place is stored once", async () => {
    const repository = new DemoRepository()

    await repository.signInWithEmail("yuna@loca.test")
    await repository.savePlace({ placeId: "place-brewers", sourceExperienceId: "exp-brewers-rain" })
    await repository.savePlace({ placeId: "place-brewers", sourceExperienceId: "exp-brewers-rain" })

    const saved = loadDemoState().userPlaces.filter((place) => place.placeId === "place-brewers")
    expect(saved).toHaveLength(1)
  })

  it("Given a signed-in user When publishing an experience Then home and place detail include it", async () => {
    const repository = new DemoRepository()
    await repository.signInWithEmail("yuna@loca.test")

    const experience = await repository.createExperience({
      mediaName: "new-place.jpg",
      mediaType: "image",
      mimeType: "image/jpeg",
      sizeBytes: 400000,
      placeId: "place-blue-stairs",
      caption: "계단 끝에서 도시가 잠깐 낮아졌다.",
      tags: ["산책과 여행"],
      visitedAt: "2026-06-21T09:00:00.000Z",
      showVisitedAt: true,
      visibility: "public",
    })

    const home = await repository.getHome()
    const place = await repository.getPlace("place-blue-stairs")
    expect(home.nearbyExperiences.some((card) => card.experience.id === experience.id)).toBe(true)
    expect(place?.experiences.some((card) => card.experience.id === experience.id)).toBe(true)
  })

  it("Given saved places When creating a taste map Then the order is preserved", async () => {
    const repository = new DemoRepository()
    await repository.signInWithEmail("yuna@loca.test")

    const map = await repository.createTasteMap({
      title: "걷다가 쉬는 순서",
      story: "서점에서 시작해 커피와 전시로 느려지는 길.",
      placeIds: ["place-moon-library", "place-brewers", "place-rain-yard"],
      visibility: "public",
    })

    const detail = await repository.getTasteMap(map.id)
    expect(detail?.places.map((place) => place.id)).toEqual([
      "place-moon-library",
      "place-brewers",
      "place-rain-yard",
    ])
  })
})

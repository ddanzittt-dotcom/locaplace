import { Buffer } from "node:buffer"
import { expect, type Page, test } from "@playwright/test"

async function resetDemo(page: Page): Promise<void> {
  await page.goto("/welcome")
  await page.evaluate(() => window.localStorage.clear())
}

async function login(page: Page, email = "yuna@loca.test"): Promise<void> {
  await page.goto("/auth")
  await page.getByLabel("이메일").fill(email)
  await page.getByRole("button", { name: "이메일로 계속" }).click()
  await expect(page).toHaveURL(/\/home/)
}

const shot = (page: Page, path: string) => page.screenshot({ path, animations: "disabled" })

test("guest save resumes after login", async ({ page }) => {
  await resetDemo(page)
  await page.goto("/feed")
  await page.getByRole("button", { name: "담기" }).first().click()
  await expect(page).toHaveURL(/\/auth/)
  await page.getByLabel("이메일").fill("yuna@loca.test")
  await page.getByRole("button", { name: "이메일로 계속" }).click()
  await expect(page).toHaveURL(/\/feed/)
  await expect(page.getByText("내 장소에 담았어요.")).toBeVisible()
})
test("publish photo experience and see it on place and my space", async ({ page }) => {
  await resetDemo(page)
  await login(page)
  await page.goto("/create/experience")
  await expect(page.getByRole("dialog", { name: "장소 기록하기" })).toBeVisible()
  await page.getByPlaceholder("상호나 주소 검색").fill("남산")
  await page
    .getByRole("button", { name: /푸른계단/ })
    .first()
    .click()
  await page.getByLabel("메모").fill("계단 끝에서 바람이 잠깐 쉬었다.")
  await page.getByRole("button", { name: "사진" }).click()
  await page.setInputFiles('[data-media-input="gallery"]', {
    name: "quiet-stairs.jpg",
    mimeType: "image/jpeg",
    buffer: Buffer.from("demo image"),
  })
  await page.getByPlaceholder("태그를 입력하고 Enter").fill("계단")
  await page.getByPlaceholder("태그를 입력하고 Enter").press("Enter")
  await expect(page.getByRole("button", { name: "계단", exact: true })).toBeVisible()
  await page.getByRole("button", { name: "기록하기" }).click()
  await expect(page).toHaveURL(/\/places\/place-blue-stairs/)
  await expect(page.getByText("계단 끝에서 바람이 잠깐 쉬었다.")).toBeVisible()
  await page.goto("/me")
  await expect(page.getByText("푸른계단")).toBeVisible()
})

test("create sheet opens place experience popup with search and voice controls", async ({
  page,
}) => {
  await resetDemo(page)
  await login(page)
  await page.goto("/home")
  await page.getByRole("button", { name: "만들기" }).click()
  await page.getByRole("button", { name: /장소 경험/ }).click()
  await expect(page).toHaveURL(/\/home/)
  await expect(page.getByRole("dialog", { name: "장소 기록하기" })).toBeVisible()
  await expect(page.getByPlaceholder("상호나 주소 검색")).toBeVisible()
  await expect(page.getByText("상호나 주소를 입력하면 맞는 장소가 나와요.")).toBeVisible()
  await page.getByRole("button", { name: "지도에서 위치 지정" }).click()
  await expect(page.getByRole("button", { name: "이 위치로 지정" })).toBeVisible()
  await page.getByRole("tab", { name: "내 장소" }).click()
  await page.getByPlaceholder("저장한 장소에서 검색").fill("브루")
  await expect(page.getByRole("button", { name: /브루어스 커피.*카페/ })).toBeVisible()
  await page.getByRole("tab", { name: "주소검색" }).click()
  await page.getByRole("button", { name: "내 위치" }).click()
  await expect(page.getByPlaceholder("상호나 주소 검색")).toHaveValue("서울")
  await page.getByRole("button", { name: "음성 녹음" }).click()
  await expect(page.getByText("음성 녹음 중")).toBeVisible()
  await page.getByRole("button", { name: "녹음 완료" }).click()
  await expect(page.getByText("음성 녹음 완료")).toBeVisible()
})

test("create taste map, reorder, and toggle map view", async ({ page }) => {
  await resetDemo(page)
  await login(page)
  await page.goto("/maps/new")
  await page.getByLabel("제목").fill("비와 책 사이")
  await page.getByLabel("이 지도의 이야기").fill("비 오는 날 천천히 이어지는 세 장소입니다.")
  await page.getByLabel("브루어스 커피").check()
  await page.getByLabel("달빛책방").check()
  await page.getByLabel("비마당").check()
  await page.getByLabel("비마당 위로 이동").click()
  await page.getByRole("button", { name: "지도 나누기" }).click()
  await expect(page).toHaveURL(/\/maps\/map-/)
  await expect(page.getByText("비와 책 사이")).toBeVisible()
  await page.getByRole("button", { name: "지도 보기" }).click()
  await expect(page.getByLabel("장소 순서가 표시된 데모 지도")).toBeVisible()
})

test("admin hides and restores reported content", async ({ page }) => {
  await resetDemo(page)
  await login(page, "admin@loca.test")
  await page.goto("/admin")
  await expect(page.getByText("신고 목록")).toBeVisible()
  await page.getByRole("button", { name: "숨김" }).click()
  await expect(page.getByText(/resolved/)).toBeVisible()
  await page.getByRole("button", { name: "복원" }).click()
  await expect(page.getByText(/dismissed/)).toBeVisible()
})

test("capture required mobile screenshots", async ({ page }) => {
  await resetDemo(page)
  await page.setViewportSize({ width: 390, height: 844 })
  await login(page)

  await page.goto("/home")
  await expect(page.getByRole("heading", { name: "윤아님의 장소 기록" })).toBeVisible()
  await shot(page, "artifacts/screenshots/01-home.png")
  await page.goto("/feed")
  await expect(page.getByRole("tab", { name: "추천" })).toBeVisible()
  await shot(page, "artifacts/screenshots/11-feed.png")
  await page.goto("/explore")
  await expect(page.getByText("브루어스 커피").first()).toBeVisible()
  await shot(page, "artifacts/screenshots/02-explore.png")
  await page.getByRole("button", { name: "만들기" }).click()
  await expect(page.getByRole("heading", { name: "무엇을 남길까요?" })).toBeVisible()
  await page.waitForTimeout(250)
  await shot(page, "artifacts/screenshots/03-create-sheet.png")
  await page.goto("/create/experience")
  await expect(page.getByRole("dialog", { name: "장소 기록하기" })).toBeVisible()
  await expect(page.getByRole("button", { name: /브루어스 커피/ }).first()).toBeVisible()
  await shot(page, "artifacts/screenshots/04-create-experience.png")
  await page.goto("/places/place-brewers")
  await expect(page.getByRole("heading", { name: "브루어스 커피" })).toBeVisible()
  await shot(page, "artifacts/screenshots/05-place-detail.png")
  await page.goto("/me")
  await expect(page.getByRole("heading", { name: "윤아의 장소 아카이브" })).toBeVisible()
  await shot(page, "artifacts/screenshots/06-library.png")
  await page.goto("/maps/new")
  await expect(page.getByRole("heading", { name: "내 장소에서 골라 순서를 정해요." })).toBeVisible()
  await expect(page.getByLabel("브루어스 커피")).toBeVisible()
  await shot(page, "artifacts/screenshots/07-create-map.png")
  await page.goto("/maps/map-rainy-cafes")
  await expect(page.getByRole("heading", { name: "비 오는 날 오래 앉기" })).toBeVisible()
  await shot(page, "artifacts/screenshots/08-map-detail-list.png")
  await page.getByRole("button", { name: "지도 보기" }).click()
  await expect(page.getByLabel("장소 순서가 표시된 데모 지도")).toBeVisible()
  await shot(page, "artifacts/screenshots/09-map-detail-map.png")
  await page.goto("/u/minseo.local")
  await expect(page.getByRole("heading", { name: "민서" })).toBeVisible()
  await shot(page, "artifacts/screenshots/10-profile.png")
})

test("feed pages one story per vertical slide", async ({ page }) => {
  await resetDemo(page)
  await page.setViewportSize({ width: 390, height: 844 })
  await login(page)
  await page.goto("/feed")
  await expect(page.getByLabel(/피드 1\//)).toBeVisible()

  const mediaCounts = await page.evaluate(() => ({
    imageCount: document.querySelectorAll(".feed-story img").length,
    videoCount: document.querySelectorAll(".feed-story video").length,
  }))
  expect(mediaCounts.imageCount + mediaCounts.videoCount).toBeGreaterThan(0)
  expect(mediaCounts.videoCount).toBeGreaterThan(0)

  const initialMetrics = await page.evaluate(() => {
    const stack = document.querySelector(".feed-stack")
    if (!(stack instanceof HTMLElement)) throw new Error("Expected feed stack to render")
    const stories = Array.from(document.querySelectorAll(".feed-story"))
    const firstStory = stories[0]
    if (firstStory === undefined) throw new Error("Expected at least one feed story")
    const stackRect = stack.getBoundingClientRect()
    const visibleStories = stories.filter((story) => {
      const rect = story.getBoundingClientRect()
      return Math.min(rect.bottom, stackRect.bottom) - Math.max(rect.top, stackRect.top) > 2
    }).length
    return {
      firstHeight: firstStory.getBoundingClientRect().height,
      stackHeight: stackRect.height,
      visibleStories,
    }
  })

  expect(initialMetrics.visibleStories).toBe(1)
  expect(Math.abs(initialMetrics.firstHeight - initialMetrics.stackHeight)).toBeLessThanOrEqual(1)

  await page.evaluate(() => {
    const stack = document.querySelector(".feed-stack")
    if (!(stack instanceof HTMLElement)) throw new Error("Expected feed stack to render")
    stack.scrollTo({ top: stack.clientHeight, behavior: "auto" })
  })

  await expect
    .poll(async () =>
      page.evaluate(() => {
        const stack = document.querySelector(".feed-stack")
        if (!(stack instanceof HTMLElement)) throw new Error("Expected feed stack to render")
        const secondStory = document.querySelectorAll(".feed-story")[1]
        if (secondStory === undefined) throw new Error("Expected a second feed story")
        return Math.abs(secondStory.getBoundingClientRect().top - stack.getBoundingClientRect().top)
      }),
    )
    .toBeLessThanOrEqual(2)
})

test("mobile widths do not create horizontal overflow", async ({ page }) => {
  await resetDemo(page)
  for (const viewport of [
    { width: 360, height: 800 },
    { width: 390, height: 844 },
    { width: 430, height: 932 },
  ]) {
    await page.setViewportSize(viewport)
    await page.goto("/home")
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    )
    expect(hasOverflow).toBe(false)
  }
})

test("home calendar opens month and year record dialogs", async ({ page }) => {
  await resetDemo(page)
  await page.setViewportSize({ width: 390, height: 844 })
  await login(page)
  await page.goto("/home")

  await expect(page.getByText("21일 - 27일")).toBeVisible()
  await page.getByRole("button", { name: "월간 보기" }).click()
  await expect(page.getByRole("dialog", { name: "2026년 6월 기록" })).toBeVisible()
  await expect(page.getByText("3개 기록")).toBeVisible()
  await page.getByRole("button", { name: "닫기", exact: true }).click()
  await expect(page.getByRole("dialog", { name: "2026년 6월 기록" })).toBeHidden()

  await page.getByRole("button", { name: "연간 보기" }).click()
  await expect(page.getByRole("dialog", { name: "2026년 기록" })).toBeVisible()
  await expect(page.getByText("48개 기록 · 8일 활동")).toBeVisible()
})

test("wide web view keeps the centered mobile shell", async ({ page }) => {
  await resetDemo(page)
  await page.setViewportSize({ width: 1286, height: 894 })
  await login(page)
  await expect(page.getByRole("heading", { name: "윤아님의 장소 기록" })).toBeVisible()
  const metrics = await page.evaluate(() => {
    const shell = document.querySelector(".app-shell")
    const firstCard = document.querySelector(".quick-record-card")
    const bottomNav = document.querySelector(".bottom-nav")
    if (shell === null || firstCard === null || bottomNav === null) {
      throw new Error("Expected LOCA shell, first card, and bottom nav to render")
    }
    const shellRect = shell.getBoundingClientRect()
    const cardRect = firstCard.getBoundingClientRect()
    const navRect = bottomNav.getBoundingClientRect()
    return {
      cardWidth: cardRect.width,
      hasDocumentOverflow: document.documentElement.scrollWidth > window.innerWidth,
      navWidth: navRect.width,
      shellLeft: shellRect.left,
      shellWidth: shellRect.width,
      viewportWidth: window.innerWidth,
    }
  })
  const expectedShellLeft = (metrics.viewportWidth - metrics.shellWidth) / 2
  expect(metrics.hasDocumentOverflow).toBe(false)
  expect(metrics.shellWidth).toBeLessThanOrEqual(480)
  expect(metrics.shellLeft).toBeCloseTo(expectedShellLeft, 0)
  expect(metrics.navWidth).toBeLessThanOrEqual(metrics.shellWidth)
  expect(metrics.cardWidth).toBeGreaterThan(340)
})

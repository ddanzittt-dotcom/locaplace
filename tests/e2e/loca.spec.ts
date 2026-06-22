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

async function captureScreen(page: Page, path: string): Promise<void> {
  await page.screenshot({ path, animations: "disabled" })
}

test("guest save resumes after login", async ({ page }) => {
  await resetDemo(page)
  await page.goto("/home")
  await page.getByRole("button", { name: "내 장소에 담기" }).first().click()
  await expect(page).toHaveURL(/\/auth/)
  await page.getByLabel("이메일").fill("yuna@loca.test")
  await page.getByRole("button", { name: "이메일로 계속" }).click()
  await expect(page).toHaveURL(/\/home/)
  await expect(page.getByText("내 장소에 담았어요.")).toBeVisible()
})

test("publish photo experience and see it on place and library", async ({ page }) => {
  await resetDemo(page)
  await login(page)
  await page.goto("/create/experience")
  await page.setInputFiles('input[type="file"]', {
    name: "quiet-stairs.jpg",
    mimeType: "image/jpeg",
    buffer: Buffer.from("demo image"),
  })
  await page.getByLabel("장소").selectOption("place-blue-stairs")
  await page.getByLabel("한 문장").fill("계단 끝에서 바람이 잠깐 쉬었다.")
  await page.getByRole("button", { name: "게시" }).click()
  await expect(page).toHaveURL(/\/places\/place-blue-stairs/)
  await expect(page.getByText("계단 끝에서 바람이 잠깐 쉬었다.")).toBeVisible()
  await page.goto("/library")
  await expect(page.getByText("푸른계단")).toBeVisible()
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
  await expect(page.getByRole("heading", { name: "오늘 볼 장소" })).toBeVisible()
  await captureScreen(page, "artifacts/screenshots/01-home.png")
  await page.goto("/explore")
  await expect(page.getByText("브루어스 커피").first()).toBeVisible()
  await captureScreen(page, "artifacts/screenshots/02-explore.png")
  await page.getByRole("button", { name: "만들기" }).click()
  await expect(page.getByRole("heading", { name: "무엇을 남길까요?" })).toBeVisible()
  await page.waitForTimeout(250)
  await captureScreen(page, "artifacts/screenshots/03-create-sheet.png")
  await page.goto("/create/experience")
  await expect(
    page.getByRole("heading", { name: "장소를 먼저 정하고 한 문장을 남겨요." }),
  ).toBeVisible()
  await expect(page.getByLabel("장소")).toContainText("브루어스 커피")
  await captureScreen(page, "artifacts/screenshots/04-create-experience.png")
  await page.goto("/places/place-brewers")
  await expect(page.getByRole("heading", { name: "브루어스 커피" })).toBeVisible()
  await captureScreen(page, "artifacts/screenshots/05-place-detail.png")
  await page.goto("/library")
  await expect(page.getByRole("heading", { name: "내 장소가 쌓이는 곳" })).toBeVisible()
  await captureScreen(page, "artifacts/screenshots/06-library.png")
  await page.goto("/maps/new")
  await expect(page.getByRole("heading", { name: "내 장소에서 골라 순서를 정해요." })).toBeVisible()
  await expect(page.getByLabel("브루어스 커피")).toBeVisible()
  await captureScreen(page, "artifacts/screenshots/07-create-map.png")
  await page.goto("/maps/map-rainy-cafes")
  await expect(page.getByRole("heading", { name: "비 오는 날 오래 앉기" })).toBeVisible()
  await captureScreen(page, "artifacts/screenshots/08-map-detail-list.png")
  await page.getByRole("button", { name: "지도 보기" }).click()
  await expect(page.getByLabel("장소 순서가 표시된 데모 지도")).toBeVisible()
  await captureScreen(page, "artifacts/screenshots/09-map-detail-map.png")
  await page.goto("/u/minseo.local")
  await expect(page.getByRole("heading", { name: "민서" })).toBeVisible()
  await captureScreen(page, "artifacts/screenshots/10-profile.png")
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

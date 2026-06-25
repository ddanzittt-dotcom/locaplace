import { expect, type Page, test } from "@playwright/test"

async function resetDemo(page: Page): Promise<void> {
  await page.goto("/welcome")
  await page.evaluate(() => window.localStorage.clear())
}

async function login(page: Page): Promise<void> {
  await page.goto("/auth")
  await page.getByLabel("이메일").fill("yuna@loca.test")
  await page.getByRole("button", { name: "이메일로 계속" }).click()
  await expect(page).toHaveURL(/\/home/)
}

test("place detail action groups stay readable on mobile", async ({ page }) => {
  await resetDemo(page)
  await page.setViewportSize({ width: 360, height: 800 })
  await login(page)
  await page.goto("/places/place-brewers")
  await expect(page.getByRole("heading", { name: "브루어스 커피" })).toBeVisible()
  await expect(page.getByRole("group", { name: "장소 상세 주요 액션" })).toBeVisible()
  await expect(page.getByRole("group", { name: "장소 경험 필터" })).toBeVisible()

  const metrics = await page.evaluate(() => {
    const shell = document.querySelector(".app-shell")
    const actions = document.querySelector(".place-actions")
    const filters = document.querySelector(".place-filter-row")
    if (shell === null || actions === null || filters === null) {
      throw new Error("Expected place detail action groups to render")
    }
    const shellRect = shell.getBoundingClientRect()
    return [actions, filters].map((node) => {
      const rect = node.getBoundingClientRect()
      return {
        fitsShell: rect.left >= shellRect.left && rect.right <= shellRect.right,
        hasDocumentOverflow: document.documentElement.scrollWidth > window.innerWidth,
        height: rect.height,
      }
    })
  })

  expect(metrics.every((metric) => metric.fitsShell)).toBe(true)
  expect(metrics.every((metric) => !metric.hasDocumentOverflow)).toBe(true)
  expect(metrics.every((metric) => metric.height <= 52)).toBe(true)
})

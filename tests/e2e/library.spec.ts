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

test("library header and place-to-map flow stay aligned on mobile", async ({ page }) => {
  await resetDemo(page)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/welcome")
  await expect(page.getByText("Demo Mode")).toBeHidden()
  await expect(page.getByRole("link", { name: "로그인" })).toBeVisible()

  await login(page)
  await page.goto("/me")
  await expect(page.getByRole("heading", { name: "윤아의 장소 아카이브" })).toBeVisible()
  await expect(page.getByRole("link", { name: "공개 화면 보기" })).toHaveCount(0)
  await expect(page.getByRole("link", { name: "취향 지도 만들기" })).toHaveCount(0)
  await expect(page.getByRole("group", { name: "내 공간 보기" })).toBeVisible()
  await expect(page.getByRole("group", { name: "내 장소 보기 방식" })).toBeVisible()

  const toolbarMetrics = await page.evaluate(() => {
    const shell = document.querySelector(".app-shell")
    const toolbar = document.querySelector(".library-toolbar")
    if (shell === null || toolbar === null) throw new Error("Expected library toolbar")
    const shellRect = shell.getBoundingClientRect()
    const toolbarRect = toolbar.getBoundingClientRect()
    return {
      fitsShell: toolbarRect.left >= shellRect.left && toolbarRect.right <= shellRect.right,
      hasDocumentOverflow: document.documentElement.scrollWidth > window.innerWidth,
    }
  })
  expect(toolbarMetrics.fitsShell).toBe(true)
  expect(toolbarMetrics.hasDocumentOverflow).toBe(false)

  await page.getByRole("checkbox", { name: /브루어스 커피/ }).check()
  await page.getByRole("checkbox", { name: /달빛책방/ }).check()
  await page.getByRole("link", { name: "선택한 장소로 지도 만들기" }).click()
  await expect(page).toHaveURL(/\/maps\/new\?places=/)
  await expect(page.getByRole("checkbox", { name: "브루어스 커피" })).toBeChecked()
  await expect(page.getByRole("checkbox", { name: "달빛책방" })).toBeChecked()
})

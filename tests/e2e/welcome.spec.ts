import { expect, test } from "@playwright/test"

test("welcome screen keeps headline and CTA composed on narrow screens", async ({ page }) => {
  for (const viewport of [
    { width: 360, height: 800 },
    { width: 390, height: 844 },
    { width: 520, height: 663 },
  ]) {
    await page.setViewportSize(viewport)
    await page.goto("/welcome")
    await expect(
      page.getByRole("heading", { name: "장소를 남기고, 취향을 지도로 나누다." }),
    ).toBeVisible()
    await expect(page.getByRole("link", { name: "시작하기" })).toBeVisible()

    const metrics = await page.evaluate(() => {
      const heading = document.querySelector("h1")
      const button = document.querySelector(".welcome-page .primary-button")
      if (!(heading instanceof HTMLElement) || !(button instanceof HTMLElement)) {
        throw new Error("Expected welcome heading and CTA to render")
      }
      const headingRect = heading.getBoundingClientRect()
      const buttonRect = button.getBoundingClientRect()
      return {
        buttonLeft: buttonRect.left,
        buttonRight: buttonRect.right,
        buttonTop: buttonRect.top,
        headingBottom: headingRect.bottom,
        headingHeight: headingRect.height,
        headingLeft: headingRect.left,
        headingRight: headingRect.right,
        hasDocumentOverflow: document.documentElement.scrollWidth > window.innerWidth,
      }
    })

    expect(metrics.hasDocumentOverflow).toBe(false)
    expect(metrics.headingLeft).toBeGreaterThanOrEqual(16)
    expect(metrics.headingRight).toBeLessThanOrEqual(viewport.width - 16)
    expect(metrics.headingHeight).toBeGreaterThan(48)
    expect(metrics.buttonTop).toBeGreaterThan(metrics.headingBottom)
    expect(metrics.buttonLeft).toBeGreaterThanOrEqual(16)
    expect(metrics.buttonRight).toBeLessThanOrEqual(viewport.width - 16)
  }
})

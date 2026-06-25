import { expect, test } from "@playwright/test"

test("welcome screen keeps headline and CTA composed inside the app shell", async ({ page }) => {
  for (const viewport of [
    { width: 360, height: 800 },
    { width: 390, height: 844 },
    { width: 520, height: 663 },
    { width: 650, height: 876 },
  ]) {
    await page.setViewportSize(viewport)
    await page.goto("/welcome")

    await expect(page.getByRole("heading", { name: /장소를 남기고/ })).toBeVisible()
    await expect(page.getByRole("link", { name: /시작하기/ })).toBeVisible()

    const metrics = await page.evaluate(() => {
      const cover = document.querySelector(".welcome-page .welcome-cover")
      const heading = document.querySelector("h1")
      const button = document.querySelector(".welcome-page .primary-button")
      if (
        !(cover instanceof HTMLElement) ||
        !(heading instanceof HTMLElement) ||
        !(button instanceof HTMLElement)
      ) {
        throw new Error("Expected welcome cover, heading, and CTA to render")
      }
      const coverRect = cover.getBoundingClientRect()
      const headingRect = heading.getBoundingClientRect()
      const buttonRect = button.getBoundingClientRect()
      return {
        buttonLeft: buttonRect.left,
        buttonRight: buttonRect.right,
        buttonTop: buttonRect.top,
        coverHeight: coverRect.height,
        headingBottom: headingRect.bottom,
        headingHeight: headingRect.height,
        headingLeft: headingRect.left,
        headingRight: headingRect.right,
        headingTop: headingRect.top,
        hasDocumentOverflow: document.documentElement.scrollWidth > window.innerWidth,
      }
    })

    expect(metrics.hasDocumentOverflow).toBe(false)
    expect(metrics.coverHeight).toBeLessThanOrEqual(148)
    expect(metrics.headingTop).toBeLessThanOrEqual(viewport.height * 0.36)
    expect(metrics.headingLeft).toBeGreaterThanOrEqual(16)
    expect(metrics.headingRight).toBeLessThanOrEqual(viewport.width - 16)
    expect(metrics.headingHeight).toBeGreaterThan(48)
    expect(metrics.buttonTop).toBeGreaterThan(metrics.headingBottom)
    expect(metrics.buttonLeft).toBeGreaterThanOrEqual(16)
    expect(metrics.buttonRight).toBeLessThanOrEqual(viewport.width - 16)
  }
})

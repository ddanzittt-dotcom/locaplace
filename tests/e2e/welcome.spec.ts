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
      const heading = document.querySelector("h1")
      const button = document.querySelector(".welcome-page .primary-button")
      if (!(heading instanceof HTMLElement) || !(button instanceof HTMLElement)) {
        throw new Error("Expected welcome heading and CTA to render")
      }
      const headingRect = heading.getBoundingClientRect()
      const buttonRect = button.getBoundingClientRect()
      const viewportCenterX = window.innerWidth / 2
      return {
        buttonCenterX: buttonRect.left + buttonRect.width / 2,
        buttonLeft: buttonRect.left,
        buttonRight: buttonRect.right,
        buttonTop: buttonRect.top,
        hasWelcomeCover: document.querySelector(".welcome-page .welcome-cover") !== null,
        headingCenterX: headingRect.left + headingRect.width / 2,
        headingCenterY: headingRect.top + headingRect.height / 2,
        headingBottom: headingRect.bottom,
        headingHeight: headingRect.height,
        headingLeft: headingRect.left,
        headingRight: headingRect.right,
        headingTop: headingRect.top,
        hasDocumentOverflow: document.documentElement.scrollWidth > window.innerWidth,
        viewportCenterX,
      }
    })

    expect(metrics.hasDocumentOverflow).toBe(false)
    expect(metrics.hasWelcomeCover).toBe(false)
    expect(Math.abs(metrics.headingCenterX - metrics.viewportCenterX)).toBeLessThanOrEqual(1)
    expect(Math.abs(metrics.buttonCenterX - metrics.viewportCenterX)).toBeLessThanOrEqual(1)
    expect(metrics.headingCenterY).toBeGreaterThan(viewport.height * 0.4)
    expect(metrics.headingCenterY).toBeLessThan(viewport.height * 0.55)
    expect(metrics.headingLeft).toBeGreaterThanOrEqual(16)
    expect(metrics.headingRight).toBeLessThanOrEqual(viewport.width - 16)
    expect(metrics.headingHeight).toBeGreaterThan(48)
    expect(metrics.buttonTop).toBeGreaterThan(metrics.headingBottom)
    expect(metrics.buttonLeft).toBeGreaterThanOrEqual(16)
    expect(metrics.buttonRight).toBeLessThanOrEqual(viewport.width - 16)
  }
})

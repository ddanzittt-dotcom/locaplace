# LOCA Design System

## 1. Atmosphere & Identity

LOCA feels like a quiet pocket archive for real places: dark, tactile, image-led, and warmer than a utility map. The signature is a place-first media stack where gradient covers and square map collections create the color, while the interface stays calm and recedes.

## 2. Color

| Role | Token | Light | Dark | Usage |
|---|---|---|---|---|
| Surface/primary | --color-background | #F7F3EA | #111312 | Page background |
| Surface/secondary | --color-surface | #FFFFFF | #1B1E1C | Cards, nav, sheets |
| Surface/elevated | --color-surface-alt | #ECE7DD | #252925 | Inputs, selected chips |
| Text/primary | --color-text-primary | #111312 | #F7F3EA | Primary copy |
| Text/secondary | --color-text-secondary | #5F665F | #A8AEA9 | Metadata, helper copy |
| Border/default | --color-border | #D9D1C4 | #303531 | Hairlines, controls |
| Accent/primary | --color-accent-coral | #E95C45 | #FF7058 | Primary actions |
| Accent/secondary | --color-accent-mint | #217D66 | #98E6C9 | Saved states, map pins |
| Status/error | --color-error | #C93737 | #FF6B6B | Validation and failures |

Rules: dark mode is the product baseline; coral is for decisive creation and mint is for saving or map-positive states. No Spotify green, logos, exact palette, or artwork is reused.

## 3. Typography

| Level | Size | Weight | Line Height | Tracking | Usage |
|---|---:|---:|---:|---:|---|
| Display | 32px | 800 | 1.08 | 0 | Welcome and page lead |
| H1 | 28px | 800 | 1.14 | 0 | Top page headings |
| H2 | 22px | 760 | 1.2 | 0 | Section headings |
| H3 | 18px | 720 | 1.25 | 0 | Card titles |
| Body | 15px | 450 | 1.55 | 0 | Main text |
| Body/sm | 13px | 450 | 1.45 | 0 | Metadata |
| Caption | 11px | 700 | 1.25 | 0 | Chips and labels |

Font stack: `Pretendard, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`. Mono: `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`.

## 4. Spacing & Layout

Base unit: 4px. Mobile design target is 390x844 with guardrails from 360px to 430px. Main content uses a max width of 480px on mobile app surfaces and expands to a two-column editorial shell only on desktop.

| Token | Value | Usage |
|---|---:|---|
| --space-1 | 4px | Tight icon gap |
| --space-2 | 8px | Chips and compact rows |
| --space-3 | 12px | Form field padding |
| --space-4 | 16px | Page horizontal padding |
| --space-5 | 20px | Card padding |
| --space-6 | 24px | Section gaps |
| --space-8 | 32px | Major gaps |

## 5. Components

### Experience Card
- Structure: place header, 4:5 media block, caption, author/date, actions.
- States: default, hover, focus, saved, loading.
- Accessibility: place link is first interactive target; action buttons have text labels.

### Taste Map Card
- Structure: 1:1 cover, title, place count, story, save/share actions.
- States: default, hover, saved.
- Accessibility: cover is decorative when title follows immediately.

### Bottom Sheet
- Structure: scrim, sheet, two creation actions.
- Motion: transform/opacity only, 220ms standard easing.
- Accessibility: close button, focusable action buttons, escape-free fallback via scrim click.

## 6. Motion & Interaction

| Type | Duration | Easing | Usage |
|---|---:|---|---|
| Micro | 120ms | ease-out | Button active movement |
| Standard | 220ms | cubic-bezier(0.16, 1, 0.3, 1) | Sheets, cards, tabs |
| Emphasis | 360ms | cubic-bezier(0.16, 1, 0.3, 1) | Page entry |

Animate only transform and opacity. Respect `prefers-reduced-motion`.

## 7. Depth & Surface

Strategy: tonal-shift with very restrained borders. Cards have 8px radius unless the component is a sheet, cover, or image surface where 16-24px is intentional.

# LOCA Design System

## 1. Atmosphere & Identity

LOCA feels like a quiet pocket archive for real places: dark, tactile, image-led, and warmer than a utility map. The signature is a place-first media stack where gradient covers and square map collections create the color, while the interface stays calm and recedes.

## 2. Color

| Role | Token | Light | Dark | Usage |
|---|---|---|---|---|
| Surface/primary | --color-background | #F7F3EA | #101310 | Page background |
| Surface/secondary | --color-surface | #FFFFFF | #191D1A | Cards, nav, sheets |
| Surface/elevated | --color-surface-alt | #ECE7DD | #242A25 | Inputs, selected chips |
| Surface/strong | --color-surface-strong | #E3DCCE | #2C332D | Active rows, pressed nav |
| Text/primary | --color-text-primary | #111312 | #F9F4E8 | Primary copy |
| Text/secondary | --color-text-secondary | #5F665F | #ACB4AD | Metadata, helper copy |
| Border/default | --color-border | #D9D1C4 | #303731 | Hairlines, controls |
| Border/soft | --color-border-soft | #ECE7DD | rgba(249, 244, 232, 0.06) | Quiet card separation |
| Accent/primary | --color-accent-coral | #E95C45 | #FF7058 | Primary actions |
| Accent/secondary | --color-accent-mint | #217D66 | #98E6C9 | Saved states, map pins |
| Status/error | --color-error | #C93737 | #FF6B6B | Validation and failures |

Rules: dark mode is the product baseline; coral is for decisive creation and mint is for saving or map-positive states. No Spotify green, logos, exact palette, or artwork is reused.

## 3. Typography

| Level | Size | Weight | Line Height | Tracking | Usage |
|---|---:|---:|---:|---:|---|
| Display | 28px | 800 | 1.12 | 0 | Welcome and page lead |
| H1 | 26px | 800 | 1.14 | 0 | Top page headings |
| H2 | 20px | 760 | 1.22 | 0 | Section headings |
| H3 | 17px | 720 | 1.25 | 0 | Card titles |
| Body | 14px | 450 | 1.5 | 0 | Main text |
| Body/sm | 12px | 450 | 1.42 | 0 | Metadata |
| Caption | 11px | 700 | 1.25 | 0 | Chips and labels |

Display stack: `"Pretendard Variable", Pretendard, "SUIT Variable", "Apple SD Gothic Neo", "Noto Sans KR", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.

Body stack: same Korean-first stack at 450-500 weight for compact mobile reading. Numeric UI uses `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` with tabular figures for calendar counts, stats, and distances.

## 4. Spacing & Layout

Base unit: 4px. Mobile design target is 390x844 with guardrails from 360px to 430px. Main content uses a max width of 480px on app surfaces. Desktop browsers keep that mobile app shell centered until a dedicated desktop shell exists, so wide web viewports must not stretch cards or bottom navigation into a partially desktop layout. Mobile screens prioritize compact scan density: top chrome, cards, and forms should leave the next action or next content row visible inside the first viewport.

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
- Structure: place header, compact 16:9 media block, caption, author/date, actions.
- States: default, hover, focus, saved, loading.
- Accessibility: place link is first interactive target; action buttons have text labels.

### Taste Map Card
- Structure: compact 4:3 cover, title, place count, story, save/share actions.
- States: default, hover, saved.
- Accessibility: cover is decorative when title follows immediately.

### Bottom Sheet
- Structure: scrim, sheet, two creation actions.
- Motion: transform/opacity only, 220ms standard easing.
- Accessibility: close button, focusable action buttons, escape-free fallback via scrim click.

### Place Experience Composer
- Structure: centered modal dialog, place-first selection, memo, media controls, tags, date, visibility, primary submit.
- States: address search, saved-place search, selected place, photo source menu, voice recording, validation errors, submitting.
- Accessibility: dialog label, close button, button-based place choices, Enter-created removable tag chips.

### Record Calendar
- Structure: segmented period switch, fixed-format day/month/year grid, compact stat row.
- States: active period, today, recorded day, focus.
- Accessibility: period controls expose selected state; recorded days are links to the user's place archive.

### Feed Story
- Structure: full-bleed tone media, place pill, caption, author, tag row, vertical action rail.
- States: saved, share dialog open, pressed controls.
- Accessibility: every rail action is a button or link with visible text; place and profile destinations remain navigable.

### Profile Space Header
- Structure: avatar, bio, tags, three stat cells, primary map/action strip.
- States: authenticated, guest fallback, empty library.
- Accessibility: public profile and map actions are explicit links.

## 6. Motion & Interaction

| Type | Duration | Easing | Usage |
|---|---:|---|---|
| Micro | 120ms | ease-out | Button active movement |
| Standard | 220ms | cubic-bezier(0.16, 1, 0.3, 1) | Sheets, cards, tabs |
| Emphasis | 360ms | cubic-bezier(0.16, 1, 0.3, 1) | Page entry |

Animate only transform and opacity. Respect `prefers-reduced-motion`.

## 7. Depth & Surface

Strategy: tonal-shift with translucent 1px borders and restrained inset highlights. Cards have 8px radius unless the component is a sheet, cover, or image surface where 16-24px is intentional. Motion and shadows should make touch feedback clearer without turning the interface into a floating card stack.

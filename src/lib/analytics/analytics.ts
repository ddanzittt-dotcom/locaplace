export const ANALYTICS_EVENTS = [
  "experience_create_started",
  "experience_media_selected",
  "experience_place_selected",
  "experience_published",
  "experience_publish_failed",
  "place_page_viewed",
  "place_saved",
  "place_unsaved",
  "map_create_started",
  "map_created",
  "map_viewed",
  "map_saved",
  "map_shared",
  "map_view_toggled",
  "library_viewed",
  "explore_searched",
  "report_submitted",
] as const

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number]

export type AnalyticsPayload = {
  readonly contentId?: string
  readonly contentType?: "experience" | "place" | "taste_map"
  readonly mode?: "demo" | "supabase"
}

export function trackEvent(event: AnalyticsEvent, payload: AnalyticsPayload = {}): void {
  if (import.meta.env.DEV) {
    console.info("[analytics]", event, payload)
  }
}

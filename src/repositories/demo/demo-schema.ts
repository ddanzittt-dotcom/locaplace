import { z } from "zod"

const toneSchema = z.enum(["coral", "mint", "amber", "violet", "blue", "forest", "slate"])
const visibilitySchema = z.enum(["public", "unlisted", "private"])
const profileRoleSchema = z.enum(["user", "admin"])

const coordinatesSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
})

const profileSchema = z.object({
  id: z.string(),
  handle: z.string(),
  name: z.string(),
  bio: z.string(),
  avatarTone: toneSchema,
  role: profileRoleSchema,
  createdAt: z.string(),
})

const placeSchema = z.object({
  id: z.string(),
  provider: z.string(),
  providerPlaceId: z.string().nullable(),
  name: z.string(),
  normalizedName: z.string(),
  address: z.string(),
  region: z.string(),
  coordinates: coordinatesSchema,
  category: z.string(),
  representativeTone: toneSchema,
  verificationStatus: z.enum(["verified", "user_submitted", "hidden"]),
  createdBy: z.string().nullable(),
  createdAt: z.string(),
})

const mediaSchema = z.object({
  id: z.string(),
  experienceId: z.string(),
  mediaType: z.enum(["image", "video", "audio"]),
  storagePath: z.string(),
  posterPath: z.string().nullable(),
  sortOrder: z.number(),
  mimeType: z.string(),
  sizeBytes: z.number(),
  durationSeconds: z.number().nullable(),
  tone: toneSchema,
})

const experienceSchema = z.object({
  id: z.string(),
  userId: z.string(),
  placeId: z.string(),
  caption: z.string(),
  tags: z.array(z.string()),
  visitedAt: z.string().nullable(),
  showVisitedAt: z.boolean(),
  visibility: visibilitySchema,
  status: z.enum(["active", "hidden", "deleted"]),
  shareToken: z.string(),
  createdAt: z.string(),
})

const userPlaceSchema = z.object({
  id: z.string(),
  userId: z.string(),
  placeId: z.string(),
  sourceExperienceId: z.string().nullable(),
  savedAt: z.string(),
})

const tasteMapSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  title: z.string(),
  story: z.string(),
  coverType: z.enum(["first_media", "selected_media", "collage", "gradient"]),
  coverTone: toneSchema,
  visibility: visibilitySchema,
  status: z.enum(["draft", "published", "hidden", "deleted"]),
  shareToken: z.string(),
  createdAt: z.string(),
  saveCount: z.number(),
})

const tasteMapItemSchema = z.object({
  id: z.string(),
  tasteMapId: z.string(),
  placeId: z.string(),
  sourceExperienceId: z.string().nullable(),
  itemNote: z.string().nullable(),
  sortOrder: z.number(),
})

const tasteMapSaveSchema = z.object({
  userId: z.string(),
  tasteMapId: z.string(),
  savedAt: z.string(),
})

const reportSchema = z.object({
  id: z.string(),
  reporterId: z.string(),
  targetType: z.enum(["experience", "taste_map", "place", "profile"]),
  targetId: z.string(),
  reason: z.string(),
  detail: z.string().nullable(),
  status: z.enum(["pending", "resolved", "dismissed"]),
  createdAt: z.string(),
})

const featuredContentSchema = z.object({
  id: z.string(),
  contentType: z.enum(["experience", "place", "taste_map"]),
  contentId: z.string(),
  section: z.string(),
  sortOrder: z.number(),
  active: z.boolean(),
})

const recentViewSchema = z.object({
  userId: z.string(),
  contentType: z.enum(["place", "taste_map", "experience"]),
  contentId: z.string(),
  viewedAt: z.string(),
})

export const DemoStateSchema = z.object({
  viewerId: z.string().nullable(),
  profiles: z.array(profileSchema),
  places: z.array(placeSchema),
  media: z.array(mediaSchema),
  experiences: z.array(experienceSchema),
  userPlaces: z.array(userPlaceSchema),
  tasteMaps: z.array(tasteMapSchema),
  tasteMapItems: z.array(tasteMapItemSchema),
  tasteMapSaves: z.array(tasteMapSaveSchema),
  reports: z.array(reportSchema),
  featuredContent: z.array(featuredContentSchema),
  recentViews: z.array(recentViewSchema),
})

export type DemoState = z.infer<typeof DemoStateSchema>

import { z } from "zod"

const MediaConfigSchema = z.object({
  VITE_ENABLE_VIDEO_UPLOAD: z
    .string()
    .default("true")
    .transform((value) => value === "true"),
  VITE_MAX_VIDEO_SECONDS: z
    .string()
    .default("15")
    .transform((value) => Number.parseInt(value, 10)),
  VITE_MAX_VIDEO_BYTES: z
    .string()
    .default("52428800")
    .transform((value) => Number.parseInt(value, 10)),
  VITE_MAX_IMAGE_BYTES: z
    .string()
    .default("10485760")
    .transform((value) => Number.parseInt(value, 10)),
})

export const mediaConfig = MediaConfigSchema.parse(import.meta.env)

export function getAcceptedMediaTypes(): string {
  if (!mediaConfig.VITE_ENABLE_VIDEO_UPLOAD) return "image/jpeg,image/png,image/webp"
  return "image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
}

export function isSupportedMimeType(mimeType: string): boolean {
  const imageTypes = ["image/jpeg", "image/png", "image/webp"]
  const videoTypes = ["video/mp4", "video/webm", "video/quicktime"]
  const allowedTypes = mediaConfig.VITE_ENABLE_VIDEO_UPLOAD
    ? [...imageTypes, ...videoTypes]
    : imageTypes
  return allowedTypes.includes(mimeType)
}

export function getMaxBytesForMime(mimeType: string): number {
  if (mimeType.startsWith("video/")) return mediaConfig.VITE_MAX_VIDEO_BYTES
  return mediaConfig.VITE_MAX_IMAGE_BYTES
}

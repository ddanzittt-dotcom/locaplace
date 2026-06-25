import { Image, Mic, Video } from "lucide-react"
import type { MediaType, Tone } from "../../types/domain"

type ToneMediaProps = {
  readonly tone: Tone
  readonly label: string
  readonly shape?: "portrait" | "square" | "wide"
  readonly mediaType?: MediaType
  readonly src?: string
  readonly posterSrc?: string
  readonly priority?: boolean
}

export function ToneMedia({
  tone,
  label,
  shape = "portrait",
  mediaType = "image",
  src,
  posterSrc,
  priority = false,
}: ToneMediaProps) {
  const Icon = mediaType === "video" ? Video : mediaType === "audio" ? Mic : Image
  const hasMediaAsset = src !== undefined && mediaType !== "audio"

  return (
    <div className={`tone-media tone-${tone} tone-${shape}`}>
      {src === undefined || mediaType === "audio" ? null : mediaType === "video" ? (
        <video
          className="tone-media-asset"
          src={src}
          poster={posterSrc}
          aria-label={label}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        <img
          className="tone-media-asset"
          src={src}
          alt={label}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
        />
      )}
      <Icon className="tone-media-icon" aria-hidden="true" size={22} strokeWidth={1.8} />
      <span aria-hidden={hasMediaAsset ? "true" : undefined}>{label}</span>
    </div>
  )
}

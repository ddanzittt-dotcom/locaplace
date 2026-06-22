import { Image, Video } from "lucide-react"
import type { Tone } from "../../types/domain"

type ToneMediaProps = {
  readonly tone: Tone
  readonly label: string
  readonly shape?: "portrait" | "square" | "wide"
  readonly mediaType?: "image" | "video"
}

export function ToneMedia({
  tone,
  label,
  shape = "portrait",
  mediaType = "image",
}: ToneMediaProps) {
  const Icon = mediaType === "video" ? Video : Image
  return (
    <div className={`tone-media tone-${tone} tone-${shape}`} role="img" aria-label={label}>
      <Icon aria-hidden="true" size={22} strokeWidth={1.8} />
      <span>{label}</span>
    </div>
  )
}

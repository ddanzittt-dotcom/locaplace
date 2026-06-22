import { Copy, Share2 } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import type { SharePayload } from "../../types/domain"
import { ToneMedia } from "./tone-media"

type SharePanelProps = {
  readonly payload: SharePayload | null
  readonly onClose: () => void
}

export function SharePanel({ payload, onClose }: SharePanelProps) {
  if (payload === null) return null

  const copyLink = async (): Promise<void> => {
    if (navigator.clipboard === undefined) return
    await navigator.clipboard.writeText(payload.url)
  }

  const share = async (): Promise<void> => {
    if (navigator.share === undefined) {
      await copyLink()
      return
    }
    await navigator.share({ title: payload.title, text: payload.subtitle, url: payload.url })
  }

  return (
    <div className="sheet-layer">
      <button type="button" className="sheet-scrim" onClick={onClose} aria-label="공유 닫기" />
      <section
        className="bottom-sheet share-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="공유"
      >
        <ToneMedia tone={payload.tone} shape="square" label="공유 카드" />
        <h2>{payload.title}</h2>
        <p>{payload.subtitle}</p>
        <div className="qr-box">
          <QRCodeSVG value={payload.qrValue} size={128} bgColor="#F7F3EA" fgColor="#111312" />
        </div>
        <div className="sheet-actions">
          <button type="button" className="primary-button" onClick={share}>
            <Share2 aria-hidden="true" size={18} />
            공유
          </button>
          <button type="button" className="secondary-button" onClick={copyLink}>
            <Copy aria-hidden="true" size={18} />
            링크 복사
          </button>
        </div>
      </section>
    </div>
  )
}

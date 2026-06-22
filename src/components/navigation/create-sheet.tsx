import { ImagePlus, Map as MapIcon } from "lucide-react"
import { Link } from "react-router-dom"

type CreateSheetProps = {
  readonly isOpen: boolean
  readonly onClose: () => void
}

export function CreateSheet({ isOpen, onClose }: CreateSheetProps) {
  if (!isOpen) return null
  return (
    <div className="sheet-layer">
      <button type="button" className="sheet-scrim" onClick={onClose} aria-label="만들기 닫기" />
      <section className="bottom-sheet" role="dialog" aria-modal="true" aria-label="만들기">
        <div className="sheet-handle" aria-hidden="true" />
        <h2>무엇을 남길까요?</h2>
        <Link className="create-option" to="/create/experience" onClick={onClose}>
          <ImagePlus aria-hidden="true" size={22} />
          <span>
            <strong>장소 경험</strong>
            <small>사진과 한 문장으로 특정 장소의 경험을 남겨보세요.</small>
          </span>
        </Link>
        <Link className="create-option" to="/maps/new" onClick={onClose}>
          <MapIcon aria-hidden="true" size={22} />
          <span>
            <strong>취향 지도</strong>
            <small>내 장소를 모아 나만의 장소 플레이리스트를 만들어보세요.</small>
          </span>
        </Link>
        <button type="button" className="secondary-button" onClick={onClose}>
          닫기
        </button>
      </section>
    </div>
  )
}

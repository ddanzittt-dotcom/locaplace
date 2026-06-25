import { ImagePlus, Map as MapIcon } from "lucide-react"
import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"

type CreateSheetProps = {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly onCreateExperience: () => void
}

export function CreateSheet({ isOpen, onClose, onCreateExperience }: CreateSheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog === null || !isOpen || dialog.open) return
    dialog.showModal()
  }, [isOpen])

  if (!isOpen) return null
  const openExperienceComposer = (): void => {
    onClose()
    onCreateExperience()
  }
  return (
    <dialog ref={dialogRef} className="sheet-layer" aria-label="만들기" onCancel={onClose}>
      <section className="bottom-sheet">
        <div className="sheet-handle" aria-hidden="true" />
        <h2>무엇을 남길까요?</h2>
        <button type="button" className="create-option" onClick={openExperienceComposer}>
          <ImagePlus aria-hidden="true" size={22} />
          <span>
            <strong>장소 경험</strong>
            <small>장소를 고르고 메모, 사진, 음성으로 기록해보세요.</small>
          </span>
        </button>
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
    </dialog>
  )
}

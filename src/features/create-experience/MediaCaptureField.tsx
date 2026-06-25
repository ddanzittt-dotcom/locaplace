import { Camera, Image as ImageIcon, Mic, Square } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  getAcceptedMediaTypes,
  getMaxBytesForMime,
  isSupportedMimeType,
} from "../../lib/media/media-config"
import type { MediaType } from "../../types/domain"
import type { SelectedMedia } from "./create-experience-form"

type VoiceState = "idle" | "recording" | "recorded"

type MediaCaptureFieldProps = {
  readonly selectedLabel: string | null
  readonly formError: string | undefined
  readonly onMediaSelected: (media: SelectedMedia) => void
}

function getMediaType(mimeType: string): MediaType {
  if (mimeType.startsWith("audio/")) return "audio"
  if (mimeType.startsWith("video/")) return "video"
  return "image"
}

export function MediaCaptureField({
  selectedLabel,
  formError,
  onMediaSelected,
}: MediaCaptureFieldProps) {
  const captureInputRef = useRef<HTMLInputElement | null>(null)
  const galleryInputRef = useRef<HTMLInputElement | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const voiceStreamRef = useRef<MediaStream | null>(null)
  const voiceChunksRef = useRef<Blob[]>([])
  const voiceRunRef = useRef(0)
  const [isPhotoMenuOpen, setIsPhotoMenuOpen] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const [voiceState, setVoiceState] = useState<VoiceState>("idle")

  const stopVoiceTracks = useCallback((): void => {
    for (const track of voiceStreamRef.current?.getTracks() ?? []) {
      track.stop()
    }
    voiceStreamRef.current = null
    mediaRecorderRef.current = null
    voiceChunksRef.current = []
  }, [])

  useEffect(() => stopVoiceTracks, [stopVoiceTracks])

  const selectVoiceMedia = (label: string, sizeBytes: number, mimeType = "audio/webm"): void => {
    onMediaSelected({
      mediaName: "voice-note.webm",
      mediaType: "audio",
      mimeType,
      sizeBytes,
      label,
    })
  }

  const selectFile = (file: File | null): void => {
    if (file === null) return
    if (!isSupportedMimeType(file.type)) {
      setFileError("지원하지 않는 파일 형식입니다.")
      return
    }
    if (file.size > getMaxBytesForMime(file.type)) {
      setFileError("파일 크기가 설정된 제한을 초과했습니다.")
      return
    }
    voiceRunRef.current += 1
    stopVoiceTracks()
    setFileError(null)
    setVoiceState("idle")
    onMediaSelected({
      mediaName: file.name,
      mediaType: getMediaType(file.type),
      mimeType: file.type,
      sizeBytes: file.size,
      label: file.name,
    })
  }

  const getVoiceMimeType = (): string => {
    if (typeof MediaRecorder === "undefined") return "audio/webm"
    if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) return "audio/webm;codecs=opus"
    if (MediaRecorder.isTypeSupported("audio/webm")) return "audio/webm"
    return "audio/webm"
  }

  const finishFallbackRecording = (): void => {
    voiceRunRef.current += 1
    stopVoiceTracks()
    setVoiceState("recorded")
    selectVoiceMedia("음성 녹음 완료", 128_000)
  }

  const stopVoiceRecording = (): void => {
    const recorder = mediaRecorderRef.current
    if (recorder !== null && recorder.state === "recording") {
      recorder.stop()
      return
    }
    finishFallbackRecording()
  }

  const startVoiceRecording = async (): Promise<void> => {
    const runId = voiceRunRef.current + 1
    voiceRunRef.current = runId
    setIsPhotoMenuOpen(false)
    setFileError(null)
    setVoiceState("recording")
    selectVoiceMedia("음성 녹음 중", 0)

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") return

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      if (voiceRunRef.current !== runId) {
        for (const track of stream.getTracks()) {
          track.stop()
        }
        return
      }
      const mimeType = getVoiceMimeType()
      const recorder = new MediaRecorder(stream, { mimeType })
      voiceStreamRef.current = stream
      mediaRecorderRef.current = recorder
      voiceChunksRef.current = []

      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) voiceChunksRef.current.push(event.data)
      })
      recorder.addEventListener(
        "stop",
        () => {
          if (voiceRunRef.current !== runId) return
          const blob = new Blob(voiceChunksRef.current, { type: recorder.mimeType || mimeType })
          stopVoiceTracks()
          setVoiceState("recorded")
          selectVoiceMedia("음성 녹음 완료", blob.size > 0 ? blob.size : 128_000, blob.type)
        },
        { once: true },
      )
      recorder.start()
    } catch {
      setFileError("마이크 권한을 받을 수 없어 데모 음성 메모로 표시합니다.")
    }
  }

  const toggleVoiceRecording = (): void => {
    if (voiceState === "recording") {
      stopVoiceRecording()
      return
    }
    void startVoiceRecording()
  }

  return (
    <fieldset className="composer-fieldset media-capture-field">
      <legend>사진과 음성</legend>
      <div className="media-action-row">
        <button
          type="button"
          className="media-action"
          onClick={() => setIsPhotoMenuOpen((v) => !v)}
        >
          <ImageIcon aria-hidden="true" size={18} />
          사진
        </button>
        <button
          type="button"
          className={voiceState === "recording" ? "media-action media-action-live" : "media-action"}
          onClick={toggleVoiceRecording}
        >
          {voiceState === "recording" ? (
            <Square aria-hidden="true" size={16} />
          ) : (
            <Mic aria-hidden="true" size={18} />
          )}
          {voiceState === "recording" ? "녹음 완료" : "음성 녹음"}
        </button>
      </div>

      {isPhotoMenuOpen ? (
        <div className="photo-source-menu">
          <button type="button" onClick={() => captureInputRef.current?.click()}>
            <Camera aria-hidden="true" size={16} />
            사진 촬영
          </button>
          <button type="button" onClick={() => galleryInputRef.current?.click()}>
            <ImageIcon aria-hidden="true" size={16} />
            갤러리
          </button>
        </div>
      ) : null}

      <input
        ref={captureInputRef}
        className="sr-only"
        type="file"
        accept="image/*"
        capture="environment"
        data-media-input="camera"
        onChange={(event) => selectFile(event.target.files?.item(0) ?? null)}
      />
      <input
        ref={galleryInputRef}
        className="sr-only"
        type="file"
        accept={getAcceptedMediaTypes()}
        data-media-input="gallery"
        onChange={(event) => selectFile(event.target.files?.item(0) ?? null)}
      />

      {selectedLabel === null ? (
        <p className="media-empty">메모와 함께 남길 사진이나 음성을 추가해주세요.</p>
      ) : (
        <p className="media-selected">{selectedLabel}</p>
      )}
      {fileError === null ? null : <small className="field-error">{fileError}</small>}
      {formError === undefined ? null : <small className="field-error">{formError}</small>}
    </fieldset>
  )
}

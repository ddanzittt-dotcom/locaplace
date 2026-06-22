import type { ReactNode } from "react"

type ChipProps = {
  readonly children: ReactNode
  readonly isActive?: boolean
  readonly onClick?: () => void
}

export function Chip({ children, isActive = false, onClick }: ChipProps) {
  if (onClick === undefined) {
    return <span className={`chip ${isActive ? "chip-active" : ""}`}>{children}</span>
  }
  return (
    <button type="button" className={`chip ${isActive ? "chip-active" : ""}`} onClick={onClick}>
      {children}
    </button>
  )
}

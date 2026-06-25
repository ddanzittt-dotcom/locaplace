export type CalendarDialog = "month" | "year"

type WeekRecordDay = {
  readonly weekday: string
  readonly day: number
  readonly hasRecord: boolean
  readonly isToday?: boolean
  readonly isMuted?: boolean
}

type MonthRecordDay = {
  readonly day: number
  readonly hasRecord: boolean
  readonly isToday: boolean
  readonly isMuted: boolean
}

export const WEEK_RECORD_DAYS: readonly WeekRecordDay[] = [
  { weekday: "일", day: 21, hasRecord: false },
  { weekday: "월", day: 22, hasRecord: false },
  { weekday: "화", day: 23, hasRecord: true },
  { weekday: "수", day: 24, hasRecord: true, isToday: true },
  { weekday: "목", day: 25, hasRecord: false, isMuted: true },
  { weekday: "금", day: 26, hasRecord: false, isMuted: true },
  { weekday: "토", day: 27, hasRecord: false, isMuted: true },
] as const

export const MONTH_RECORD_DAYS: readonly MonthRecordDay[] = Array.from(
  { length: 30 },
  (_, index) => {
    const day = index + 1
    return {
      day,
      hasRecord: day === 19 || day === 23 || day === 24,
      isToday: day === 24,
      isMuted: day >= 25,
    }
  },
)

export const MONTH_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const
export const MONTHLY_RECORDS = [
  { label: "1월", count: 0, level: "empty" },
  { label: "2월", count: 0, level: "empty" },
  { label: "3월", count: 0, level: "empty" },
  { label: "4월", count: 0, level: "empty" },
  { label: "5월", count: 45, level: "full" },
  { label: "6월", count: 3, level: "small" },
  { label: "7월", count: 0, level: "empty" },
  { label: "8월", count: 0, level: "empty" },
  { label: "9월", count: 0, level: "empty" },
  { label: "10월", count: 0, level: "empty" },
  { label: "11월", count: 0, level: "empty" },
  { label: "12월", count: 0, level: "empty" },
] as const
export const HEATMAP_COLUMNS = Array.from({ length: 42 }, (_, index) => index)
export const YEAR_MONTH_LABELS = Array.from({ length: 12 }, (_, index) => index + 1)

export function getHeatDotTone(row: number, column: number): "empty" | "soft" | "record" | "today" {
  if (row === 2 && column === 33) return "today"
  if (
    (row === 1 && column === 26) ||
    (row === 2 && column === 27) ||
    (row === 3 && column === 28)
  ) {
    return "record"
  }
  if (
    (row === 2 && column === 26) ||
    (row === 3 && column === 27) ||
    (row === 0 && column === 25)
  ) {
    return "soft"
  }
  return "empty"
}

import { ChevronRight } from "lucide-react"
import { useEffect, useId, useState } from "react"
import { Link } from "react-router-dom"
import { Section } from "../../components/common/section"
import { MonthRecordDialog, YearRecordDialog } from "./HomeCalendarDialogs"
import { type CalendarDialog, WEEK_RECORD_DAYS } from "./home-calendar-data"

type CalendarDialogState = CalendarDialog | null

export function HomeCalendar() {
  const [dialog, setDialog] = useState<CalendarDialogState>(null)
  const titleId = useId()

  useEffect(() => {
    if (dialog === null) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDialog(null)
    }

    document.addEventListener("keydown", closeOnEscape)
    return () => document.removeEventListener("keydown", closeOnEscape)
  }, [dialog])

  return (
    <Section
      title="기록 캘린더"
      subtitle="이번 주 기록 리듬을 확인하고 월간, 연간 기록을 펼쳐봐요."
    >
      <section
        className="calendar-card weekly-record-card"
        aria-label="6월 21일부터 27일까지 기록 요약"
      >
        <div className="weekly-calendar-topline">
          <strong>21일 - 27일</strong>
          <span>
            <b>2</b> 기록
          </span>
        </div>
        <div className="weekly-calendar-grid">
          {WEEK_RECORD_DAYS.map((item) => (
            <Link
              to="/me"
              key={item.day}
              className={[
                "weekly-calendar-day",
                item.hasRecord ? "weekly-calendar-day-recorded" : "",
                item.isToday === true ? "weekly-calendar-day-today" : "",
                item.isMuted === true ? "weekly-calendar-day-muted" : "",
              ].join(" ")}
              aria-label={`${item.weekday}요일 ${item.day}일 기록 보기`}
            >
              <span>{item.weekday}</span>
              <strong>{item.day}</strong>
              <i aria-hidden="true" />
            </Link>
          ))}
        </div>
        <div className="calendar-view-actions">
          <button type="button" onClick={() => setDialog("month")}>
            월간 보기
            <ChevronRight aria-hidden="true" size={15} />
          </button>
          <button type="button" onClick={() => setDialog("year")}>
            연간 보기
            <ChevronRight aria-hidden="true" size={15} />
          </button>
        </div>
      </section>

      {dialog === null ? null : (
        <div className="calendar-modal-layer">
          <button
            type="button"
            className="calendar-modal-backdrop"
            aria-label="캘린더 닫기"
            onClick={() => setDialog(null)}
          />
          <div
            className={`calendar-modal calendar-modal-${dialog}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            {dialog === "month" ? (
              <MonthRecordDialog titleId={titleId} onClose={() => setDialog(null)} />
            ) : (
              <YearRecordDialog titleId={titleId} onClose={() => setDialog(null)} />
            )}
          </div>
        </div>
      )}
    </Section>
  )
}

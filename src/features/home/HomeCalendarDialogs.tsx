import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Link } from "react-router-dom"
import {
  getHeatDotTone,
  HEATMAP_COLUMNS,
  MONTH_LABELS,
  MONTH_RECORD_DAYS,
  MONTHLY_RECORDS,
  YEAR_MONTH_LABELS,
} from "./home-calendar-data"

type DialogProps = {
  readonly titleId: string
  readonly onClose: () => void
}

export function MonthRecordDialog({ titleId, onClose }: DialogProps) {
  return (
    <>
      <DialogHeader titleId={titleId} title="2026년 6월 기록" count="3개 기록" onClose={onClose} />
      <div className="month-calendar-toolbar">
        <button type="button" aria-label="이전 달">
          <ChevronLeft aria-hidden="true" size={18} />
        </button>
        <strong>6월</strong>
        <button type="button" aria-label="다음 달" disabled>
          <ChevronRight aria-hidden="true" size={18} />
        </button>
      </div>
      <div className="month-calendar-labels">
        {MONTH_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <nav className="month-calendar-grid" aria-label="2026년 6월 기록 날짜">
        {MONTH_RECORD_DAYS.map((item) => (
          <Link
            to="/me"
            key={item.day}
            className={[
              "month-calendar-day",
              item.hasRecord ? "month-calendar-day-recorded" : "",
              item.isToday ? "month-calendar-day-today" : "",
              item.isMuted ? "month-calendar-day-muted" : "",
            ].join(" ")}
            aria-label={`6월 ${item.day}일 기록 보기`}
          >
            <strong>{item.day}</strong>
            <i aria-hidden="true" />
          </Link>
        ))}
      </nav>
    </>
  )
}

export function YearRecordDialog({ titleId, onClose }: DialogProps) {
  return (
    <>
      <DialogHeader
        titleId={titleId}
        title="2026년 기록"
        count="48개 기록 · 8일 활동"
        onClose={onClose}
      />
      <section className="year-heatmap" aria-label="2026년 활동 히트맵">
        <div className="year-heatmap-months" aria-hidden="true">
          {YEAR_MONTH_LABELS.map((month) => (
            <span key={month}>{month}</span>
          ))}
        </div>
        {[0, 1, 2, 3, 4].map((row) => (
          <div className="year-heatmap-row" key={row}>
            <span>{row === 1 ? "월" : row === 2 ? "수" : row === 3 ? "금" : ""}</span>
            <div>
              {HEATMAP_COLUMNS.map((column) => (
                <i
                  className={`year-heat-dot year-heat-dot-${getHeatDotTone(row, column)}`}
                  key={`${row}-${column}`}
                />
              ))}
            </div>
          </div>
        ))}
      </section>
      <section className="year-record-bars" aria-label="월간 기록">
        <h3>월간 기록</h3>
        {MONTHLY_RECORDS.map((item) => (
          <div className="year-record-row" key={item.label}>
            <span>{item.label}</span>
            <b className={`year-record-meter year-record-meter-${item.level}`}>
              <i />
            </b>
            <strong>{item.count > 0 ? item.count : "·"}</strong>
          </div>
        ))}
      </section>
    </>
  )
}

function DialogHeader({
  titleId,
  title,
  count,
  onClose,
}: {
  readonly titleId: string
  readonly title: string
  readonly count: string
  readonly onClose: () => void
}) {
  return (
    <header className="calendar-modal-header">
      <div>
        <h3 id={titleId}>{title}</h3>
        <p>{count}</p>
      </div>
      <button type="button" onClick={onClose} aria-label="닫기">
        <X aria-hidden="true" size={18} />
      </button>
    </header>
  )
}

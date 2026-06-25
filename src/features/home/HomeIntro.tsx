import { CalendarDays, ImagePlus, Map as MapIcon } from "lucide-react"
import { Link } from "react-router-dom"

export function HomeIntro() {
  return (
    <>
      <div className="home-greeting">
        <div>
          <p className="page-kicker">장소 기록 홈</p>
          <h1>윤아님의 장소 기록</h1>
          <p className="lead">오늘도 마음에 남은 한 곳의 시간을 남겨보세요.</p>
        </div>
        <Link className="avatar-link avatar-square" to="/me" aria-label="내 공간 열기">
          윤
        </Link>
      </div>

      <section className="quick-record-card">
        <div>
          <span className="soft-badge">
            <CalendarDays aria-hidden="true" size={15} />
            오늘의 기록
          </span>
          <h2>오늘 어디가 마음에 남았나요?</h2>
          <p>사진과 한 문장을 장소에 연결하면 캘린더와 취향 지도에 자동으로 쌓여요.</p>
        </div>
        <div className="quick-actions">
          <Link className="primary-button" to="/create/experience">
            <ImagePlus aria-hidden="true" size={17} />
            장소 남기기
          </Link>
          <Link className="secondary-button" to="/maps/new">
            <MapIcon aria-hidden="true" size={17} />
            지도 만들기
          </Link>
        </div>
      </section>
    </>
  )
}

import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

export function WelcomePage() {
  return (
    <section className="page welcome-page">
      <div className="page-kicker">LOCA</div>
      <h1>장소를 남기고, 취향을 지도로 나누다.</h1>
      <p className="lead">별점이 아니라 기억, 상황, 감정이 쌓이는 장소 중심 소셜 아카이브입니다.</p>
      <Link className="primary-button" to="/home">
        시작하기
        <ArrowRight aria-hidden="true" size={18} />
      </Link>
    </section>
  )
}

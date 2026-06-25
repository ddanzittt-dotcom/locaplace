import { Compass, Home, Plus, Rss, User } from "lucide-react"
import { NavLink } from "react-router-dom"

export function BottomNav({ onCreate }: { readonly onCreate: () => void }) {
  return (
    <nav className="bottom-nav" aria-label="주요 메뉴">
      <NavLink to="/home">
        <Home aria-hidden="true" size={21} />
        <span>홈</span>
      </NavLink>
      <NavLink to="/feed">
        <Rss aria-hidden="true" size={21} />
        <span>피드</span>
      </NavLink>
      <button type="button" className="bottom-nav-create" onClick={onCreate}>
        <Plus aria-hidden="true" size={23} />
        <span>만들기</span>
      </button>
      <NavLink to="/explore">
        <Compass aria-hidden="true" size={21} />
        <span>탐색</span>
      </NavLink>
      <NavLink to="/me">
        <User aria-hidden="true" size={21} />
        <span>내 공간</span>
      </NavLink>
    </nav>
  )
}

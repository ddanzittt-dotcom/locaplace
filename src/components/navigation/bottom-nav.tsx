import { Compass, Home, Library, Plus } from "lucide-react"
import { NavLink } from "react-router-dom"

export function BottomNav({ onCreate }: { readonly onCreate: () => void }) {
  return (
    <nav className="bottom-nav" aria-label="주요 메뉴">
      <NavLink to="/home">
        <Home aria-hidden="true" size={21} />
        <span>홈</span>
      </NavLink>
      <NavLink to="/explore">
        <Compass aria-hidden="true" size={21} />
        <span>탐색</span>
      </NavLink>
      <NavLink to="/library">
        <Library aria-hidden="true" size={21} />
        <span>라이브러리</span>
      </NavLink>
      <button type="button" onClick={onCreate}>
        <Plus aria-hidden="true" size={23} />
        <span>만들기</span>
      </button>
    </nav>
  )
}

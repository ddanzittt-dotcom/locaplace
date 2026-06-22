import { type ReactNode, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../app/auth-context"
import { env, isDemoProductionMode } from "../../lib/config/env"
import { BottomNav } from "./bottom-nav"
import { CreateSheet } from "./create-sheet"

export function AppShell({ children }: { readonly children: ReactNode }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const { viewer, signOut } = useAuth()
  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/home" className="brand-mark" aria-label="LOCA 홈">
          LOCA
        </Link>
        <div className="header-actions">
          {env.DEV || isDemoProductionMode() ? <span className="demo-badge">Demo Mode</span> : null}
          {viewer === null ? (
            <Link className="avatar-link" to="/auth">
              로그인
            </Link>
          ) : (
            <button type="button" className="avatar-link" onClick={() => void signOut()}>
              {viewer.name}
            </button>
          )}
        </div>
      </header>
      <main>{children}</main>
      <BottomNav onCreate={() => setIsCreateOpen(true)} />
      <CreateSheet isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  )
}

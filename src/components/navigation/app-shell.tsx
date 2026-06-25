import { type ReactNode, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../app/auth-context"
import { PlaceExperienceComposer } from "../../features/create-experience/PlaceExperienceComposer"
import { BottomNav } from "./bottom-nav"
import { CreateSheet } from "./create-sheet"

export function AppShell({ children }: { readonly children: ReactNode }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isExperienceOpen, setIsExperienceOpen] = useState(false)
  const navigate = useNavigate()
  const { viewer, signOut } = useAuth()
  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/home" className="brand-mark" aria-label="LOCA 홈">
          LOCA
        </Link>
        <div className="header-actions">
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
      <CreateSheet
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreateExperience={() => setIsExperienceOpen(true)}
      />
      <PlaceExperienceComposer
        isOpen={isExperienceOpen}
        onClose={() => setIsExperienceOpen(false)}
        onPublished={(experience) => {
          setIsExperienceOpen(false)
          navigate(`/places/${experience.placeId}`)
        }}
      />
    </div>
  )
}

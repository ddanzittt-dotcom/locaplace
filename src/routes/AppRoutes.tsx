import { Navigate, Route, Routes } from "react-router-dom"
import { AdminPage } from "../features/admin/AdminPage"
import { AuthPage } from "../features/auth/AuthPage"
import { CreateExperiencePage } from "../features/create-experience/CreateExperiencePage"
import { ExplorePage } from "../features/explore/ExplorePage"
import { FeedPage } from "../features/feed/FeedPage"
import { HomePage } from "../features/home/HomePage"
import { ShareExperiencePage } from "../features/home/ShareExperiencePage"
import { ShareMapPage } from "../features/home/ShareMapPage"
import { WelcomePage } from "../features/home/WelcomePage"
import { LibraryPage } from "../features/library/LibraryPage"
import { PlaceDetailPage } from "../features/place-detail/PlaceDetailPage"
import { ProfilePage } from "../features/profile/ProfilePage"
import { CreateTasteMapPage } from "../features/taste-map/CreateTasteMapPage"
import { TasteMapDetailPage } from "../features/taste-map/TasteMapDetailPage"

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/welcome" replace />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/feed" element={<FeedPage />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/create/experience" element={<CreateExperiencePage />} />
      <Route path="/places/:placeId" element={<PlaceDetailPage />} />
      <Route path="/me" element={<LibraryPage />} />
      <Route path="/library" element={<Navigate to="/me" replace />} />
      <Route path="/myspace" element={<Navigate to="/me" replace />} />
      <Route path="/maps/new" element={<CreateTasteMapPage />} />
      <Route path="/maps/:mapId" element={<TasteMapDetailPage />} />
      <Route path="/u/:handle" element={<ProfilePage />} />
      <Route path="/share/experience/:token" element={<ShareExperiencePage />} />
      <Route path="/share/map/:token" element={<ShareMapPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}

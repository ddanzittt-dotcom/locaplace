import { BrowserRouter } from "react-router-dom"
import { AppShell } from "../components/navigation/app-shell"
import { getMissingSupabaseKeys, isDemoProductionMode } from "../lib/config/env"
import { RepositoryConfigError } from "../repositories/contracts/errors"
import { AppRoutes } from "../routes/AppRoutes"
import { AuthProvider } from "./auth-context"
import { LocaQueryProvider } from "./query-client"
import { RepositoryProvider } from "./repository-context"
import { ToastProvider } from "./toast-context"

function ConfigurationErrorScreen({ error }: { readonly error: RepositoryConfigError }) {
  return (
    <section className="page config-error">
      <h1>Supabase 설정이 필요합니다.</h1>
      <p className="lead">{error.message}</p>
      <p>`.env.local`에 누락된 환경변수를 채운 뒤 다시 실행해주세요.</p>
    </section>
  )
}

export function App() {
  try {
    return (
      <BrowserRouter>
        <LocaQueryProvider>
          <RepositoryProvider>
            <AuthProvider>
              <ToastProvider>
                <AppShell>
                  {isDemoProductionMode() ? (
                    <div className="production-warning">
                      Production에서 Demo Mode가 켜져 있습니다. 실제 서비스 전 Supabase 모드로
                      전환하세요.
                    </div>
                  ) : null}
                  <AppRoutes />
                </AppShell>
              </ToastProvider>
            </AuthProvider>
          </RepositoryProvider>
        </LocaQueryProvider>
      </BrowserRouter>
    )
  } catch (error) {
    if (error instanceof RepositoryConfigError) return <ConfigurationErrorScreen error={error} />
    throw error
  }
}

export function getConfigurationHints(): readonly string[] {
  return getMissingSupabaseKeys()
}

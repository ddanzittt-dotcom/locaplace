import { useQueryClient } from "@tanstack/react-query"
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react"
import type { Profile } from "../types/domain"
import { useRepository } from "./repository-context"

type AuthState = {
  readonly viewer: Profile | null
  readonly isLoading: boolean
  readonly signIn: (email: string) => Promise<Profile>
  readonly signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { readonly children: ReactNode }) {
  const repository = useRepository()
  const queryClient = useQueryClient()
  const [viewer, setViewer] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    repository
      .getViewer()
      .then((profile) => {
        if (!cancelled) setViewer(profile)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [repository])

  const value = useMemo<AuthState>(
    () => ({
      viewer,
      isLoading,
      signIn: async (email) => {
        const profile = await repository.signInWithEmail(email)
        setViewer(profile)
        await queryClient.invalidateQueries()
        return profile
      },
      signOut: async () => {
        await repository.signOut()
        setViewer(null)
        await queryClient.invalidateQueries()
      },
    }),
    [isLoading, queryClient, repository, viewer],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const auth = useContext(AuthContext)
  if (auth === null) throw new Error("AuthProvider is missing")
  return auth
}

import { createContext, type ReactNode, useContext, useMemo } from "react"
import type { LocaRepository } from "../repositories/contracts/loca-repository"
import { createLocaRepository } from "../repositories/create-repository"

const RepositoryContext = createContext<LocaRepository | null>(null)

export function RepositoryProvider({ children }: { readonly children: ReactNode }) {
  const repository = useMemo(() => createLocaRepository(), [])
  return <RepositoryContext.Provider value={repository}>{children}</RepositoryContext.Provider>
}

export function useRepository(): LocaRepository {
  const repository = useContext(RepositoryContext)
  if (repository === null) throw new Error("RepositoryProvider is missing")
  return repository
}

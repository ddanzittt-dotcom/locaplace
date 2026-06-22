import { type DemoState, DemoStateSchema } from "./demo-schema"
import { demoFixtureState } from "./fixtures"

const STORAGE_KEY = "loca.demo.state.v1"

function cloneFixtureState(): DemoState {
  return structuredClone(demoFixtureState)
}

export function resetDemoState(): DemoState {
  const state = cloneFixtureState()
  saveDemoState(state)
  return state
}

export function loadDemoState(): DemoState {
  if (typeof window === "undefined") return cloneFixtureState()

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (raw === null) return resetDemoState()

  try {
    const parsed: unknown = JSON.parse(raw)
    return DemoStateSchema.parse(parsed)
  } catch (error) {
    if (error instanceof Error) console.warn("Resetting invalid LOCA demo state", error.message)
    return resetDemoState()
  }
}

export function saveDemoState(state: DemoState): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function withDemoState(update: (state: DemoState) => DemoState): DemoState {
  const current = loadDemoState()
  const next = update(current)
  saveDemoState(next)
  return next
}

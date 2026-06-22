import { z } from "zod"

const PendingActionSchema = z.object({
  kind: z.literal("save_place"),
  input: z.object({
    placeId: z.string(),
    sourceExperienceId: z.string().nullable(),
  }),
  placeName: z.string(),
})

const AuthRouteStateSchema = z.object({
  returnTo: z.string().default("/home"),
  pendingAction: PendingActionSchema.nullable().optional(),
})

export type AuthRouteState = z.infer<typeof AuthRouteStateSchema>

export function parseAuthRouteState(state: unknown): AuthRouteState {
  const parsed = AuthRouteStateSchema.safeParse(state)
  if (!parsed.success) return { returnTo: "/home", pendingAction: null }
  return parsed.data
}

import { useQueryClient } from "@tanstack/react-query"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../app/auth-context"
import { useRepository } from "../app/repository-context"
import { useToast } from "../app/toast-context"
import type { SavePlaceInput } from "../repositories/contracts/loca-repository"

export function useSavePlaceAction() {
  const { viewer } = useAuth()
  const repository = useRepository()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast()

  return async (input: SavePlaceInput, placeName: string): Promise<void> => {
    if (viewer === null) {
      navigate("/auth", {
        state: {
          returnTo: location.pathname,
          pendingAction: { kind: "save_place", input, placeName },
        },
      })
      return
    }
    await repository.savePlace(input)
    await queryClient.invalidateQueries()
    showToast({
      message: `${placeName}를 내 장소에 담았어요.`,
      action: { label: "지도에도 추가", to: "/maps/new" },
    })
  }
}

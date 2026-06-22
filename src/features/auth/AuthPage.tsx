import { zodResolver } from "@hookform/resolvers/zod"
import { Mail } from "lucide-react"
import { useForm } from "react-hook-form"
import { useLocation, useNavigate } from "react-router-dom"
import { z } from "zod"
import { useAuth } from "../../app/auth-context"
import { useRepository } from "../../app/repository-context"
import { useToast } from "../../app/toast-context"
import { trackEvent } from "../../lib/analytics/analytics"
import { parseAuthRouteState } from "./auth-route-state"

const SignInSchema = z.object({
  email: z.string().email("이메일 주소를 입력해주세요."),
})

type SignInForm = z.infer<typeof SignInSchema>

export function AuthPage() {
  const { signIn } = useAuth()
  const repository = useRepository()
  const navigate = useNavigate()
  const location = useLocation()
  const routeState = parseAuthRouteState(location.state)
  const { showToast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInForm>({
    resolver: zodResolver(SignInSchema),
    defaultValues: { email: "yuna@loca.test" },
  })

  const onSubmit = handleSubmit(async (values) => {
    await signIn(values.email)
    if (routeState.pendingAction?.kind === "save_place") {
      await repository.savePlace(routeState.pendingAction.input)
      showToast({
        message: `${routeState.pendingAction.placeName}를 내 장소에 담았어요.`,
        action: { label: "지도에도 추가", to: "/maps/new" },
      })
    }
    trackEvent("place_saved", { mode: "demo" })
    navigate(routeState.returnTo, { replace: true })
  })

  return (
    <section className="page auth-page">
      <div className="page-kicker">로그인</div>
      <h1>원래 하려던 행동으로 돌아갈게요.</h1>
      <p className="lead">
        데모에서는 이메일 입력 즉시 로그인됩니다. Supabase 모드에서는 magic link가 발송됩니다.
      </p>
      <form className="form-card" onSubmit={(event) => void onSubmit(event)}>
        <label>
          <span>이메일</span>
          <input type="email" autoComplete="email" {...register("email")} />
          {errors.email === undefined ? null : (
            <small className="field-error">{errors.email.message}</small>
          )}
        </label>
        <button type="submit" className="primary-button" disabled={isSubmitting}>
          <Mail aria-hidden="true" size={18} />
          {isSubmitting ? "확인 중" : "이메일로 계속"}
        </button>
      </form>
    </section>
  )
}

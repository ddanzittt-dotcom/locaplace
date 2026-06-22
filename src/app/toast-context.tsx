import { createContext, type ReactNode, useContext, useMemo, useState } from "react"
import { Link } from "react-router-dom"

type ToastAction = {
  readonly label: string
  readonly to: string
}

type Toast = {
  readonly message: string
  readonly action: ToastAction | null
}

type ToastApi = {
  readonly showToast: (toast: Toast) => void
}

const ToastContext = createContext<ToastApi | null>(null)

export function ToastProvider({ children }: { readonly children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null)
  const value = useMemo<ToastApi>(
    () => ({
      showToast: (nextToast) => {
        setToast(nextToast)
        window.setTimeout(() => setToast(null), 4200)
      },
    }),
    [],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast === null ? null : (
        <div className="toast" role="status">
          <span>{toast.message}</span>
          {toast.action === null ? null : <Link to={toast.action.to}>{toast.action.label}</Link>}
          <button type="button" onClick={() => setToast(null)} aria-label="토스트 닫기">
            닫기
          </button>
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast(): ToastApi {
  const toast = useContext(ToastContext)
  if (toast === null) throw new Error("ToastProvider is missing")
  return toast
}

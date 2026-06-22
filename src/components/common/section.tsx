import type { ReactNode } from "react"

export function Section({
  title,
  subtitle,
  children,
}: {
  readonly title: string
  readonly subtitle?: string
  readonly children: ReactNode
}) {
  return (
    <section className="section-block">
      <div className="section-heading">
        <h2>{title}</h2>
        {subtitle === undefined ? null : <p>{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}

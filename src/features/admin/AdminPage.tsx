import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ShieldCheck } from "lucide-react"
import { useAuth } from "../../app/auth-context"
import { useRepository } from "../../app/repository-context"

export function AdminPage() {
  const { viewer } = useAuth()
  const repository = useRepository()
  const queryClient = useQueryClient()
  const { data: adminData } = useQuery({
    queryKey: ["admin"],
    queryFn: () => repository.getAdminData(),
  })

  if (viewer?.role !== "admin") {
    return (
      <section className="page">
        <h1>관리자 권한이 필요합니다.</h1>
        <p className="lead">
          데모에서는 admin@loca.test 로 로그인하면 관리자 화면을 볼 수 있습니다.
        </p>
      </section>
    )
  }
  if (adminData === undefined)
    return <section className="page">관리자 데이터를 불러오는 중입니다.</section>

  const hideContent = async (reportId: string): Promise<void> => {
    await repository.hideReportedContent(reportId)
    await queryClient.invalidateQueries()
  }
  const restoreContent = async (reportId: string): Promise<void> => {
    await repository.restoreReportedContent(reportId)
    await queryClient.invalidateQueries()
  }

  return (
    <section className="page admin-page">
      <div className="page-kicker">Admin</div>
      <h1>신고와 featured 콘텐츠를 관리합니다.</h1>
      <div className="admin-metrics">
        <span>사용자 {adminData.profiles.length}</span>
        <span>경험 {adminData.experiences.length}</span>
        <span>지도 {adminData.maps.length}</span>
        <span>장소 {adminData.places.length}</span>
      </div>
      <section className="section-block">
        <div className="section-heading">
          <h2>신고 목록</h2>
          <p>콘텐츠 ID와 작성자를 확인한 뒤 숨김 또는 복원을 실행합니다.</p>
        </div>
        <div className="place-list">
          {adminData.reports.map((report) => (
            <article className="admin-report" key={report.id}>
              <ShieldCheck aria-hidden="true" />
              <div>
                <strong>{report.reason}</strong>
                <span>
                  {report.targetType} · {report.targetId} · {report.status}
                </span>
                <p>{report.detail}</p>
              </div>
              <button type="button" onClick={() => void hideContent(report.id)}>
                숨김
              </button>
              <button type="button" onClick={() => void restoreContent(report.id)}>
                복원
              </button>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}

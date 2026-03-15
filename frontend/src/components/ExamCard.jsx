import { Link } from "react-router-dom"

/**
 * Reusable exam card used on both Admin and Student dashboards.
 * Props:
 *   exam        — exam object
 *   role        — "admin" | "student"
 *   isAttempted — (student only) whether student already submitted
 *   onDelete    — (admin only) delete handler
 */
export default function ExamCard({ exam, role, isAttempted, onDelete }) {
  const now      = new Date()
  const start    = new Date(exam.start_time)
  const end      = new Date(exam.end_time)
  const isLive   = now >= start && now <= end && exam.is_active
  const isPast   = now > end || !exam.is_active
  const isScheduled = now < start

  const statusLabel = isLive ? "🟢 Live" : isPast ? "🔴 Ended" : "🟡 Scheduled"
  const cardClass   = `exam-card ${isLive ? "live" : isPast ? "ended" : "scheduled"}`

  return (
    <div className={cardClass}>
      <div className="exam-card-top">
        <h3>{exam.title}</h3>
        <span className="exam-status">{statusLabel}</span>
      </div>

      <div className="exam-card-meta">
        <span>📅 Start: {new Date(exam.start_time).toLocaleString()}</span>
        <span>⏰ End: {new Date(exam.end_time).toLocaleString()}</span>
        <span>❓ {exam.total_questions} Questions</span>
      </div>

      <div className="exam-card-actions">
        {role === "admin" && (
          <>
            <Link to={`/admin/exams/${exam.id}/questions`} className="btn-sm btn-primary">
              Add Questions
            </Link>
            <Link to={`/admin/exams/${exam.id}/modify`} className="btn-sm btn-outline">
              Modify
            </Link>
            <Link to={`/admin/exams/${exam.id}/leaderboard`} className="btn-sm btn-outline">
              Leaderboard
            </Link>
            <button onClick={() => onDelete(exam.id)} className="btn-sm btn-danger">
              Delete
            </button>
          </>
        )}

        {role === "student" && (
          <>
            {isLive && !isAttempted && (
              <Link to={`/student/exams/${exam.id}/note`} className="btn-sm btn-primary">
                Attempt
              </Link>
            )}
            {isAttempted && (
              <Link to={`/student/exams/${exam.id}/score`} className="btn-sm btn-success">
                View Score
              </Link>
            )}
            <Link to={`/student/exams/${exam.id}/leaderboard`} className="btn-sm btn-outline">
              Leaderboard
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

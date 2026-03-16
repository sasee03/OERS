import { Link } from "react-router-dom"
import { Exam } from "../types"

interface Props {
  exam: Exam
  role: "admin" | "student"
  isAttempted?: boolean
  onDelete?: (id: number) => void
}

export default function ExamCard({ exam, role, isAttempted, onDelete }: Props) {
  const now       = new Date()
  const start     = new Date(exam.start_time)
  const end       = new Date(exam.end_time)
  const isLive    = now >= start && now <= end && exam.is_active
  const isPast    = now > end || !exam.is_active
  const isScheduled = now < start

  // ── Color schema from your diagram ──────────────────────
  // Green  = live and not yet attempted
  // Blue   = attempted
  // Red    = expired and not attempted (missed)
  // Gray   = scheduled (not started yet)
  // Admin always shows green for active, red for inactive

  const getCardStyle = () => {
    if (role === "admin") {
      return isLive
        ? "border-green-200 bg-green-50"
        : isScheduled
        ? "border-zinc-200 bg-zinc-50"
        : "border-red-200 bg-red-50"
    }
    if (isAttempted)  return "border-blue-200 bg-blue-50"
    if (isLive)       return "border-green-200 bg-green-50"
    if (isPast)       return "border-red-200 bg-red-50"
    if (isScheduled)  return "border-zinc-200 bg-zinc-50"
    return "border-zinc-200 bg-white"
  }

  const getStatusLabel = () => {
    if (role === "admin") return isLive ? "Active" : isScheduled ? "Scheduled" : "Inactive"
    if (isAttempted)  return "Attempted"
    if (isLive)       return "Attempt Now"
    if (isPast)       return "Missed"
    if (isScheduled)  return "Upcoming"
    return ""
  }

  const getStatusColor = () => {
    if (role === "admin") return isLive ? "text-green-700" : isScheduled ? "text-zinc-500" : "text-red-600"
    if (isAttempted)  return "text-blue-700"
    if (isLive)       return "text-green-700"
    if (isPast)       return "text-red-600"
    if (isScheduled)  return "text-zinc-500"
    return "text-zinc-400"
  }

  const getDotColor = () => {
    if (role === "admin") return isLive ? "bg-green-500" : isScheduled ? "bg-zinc-400" : "bg-red-500"
    if (isAttempted)  return "bg-blue-500"
    if (isLive)       return "bg-green-500"
    if (isPast)       return "bg-red-500"
    return "bg-zinc-400"
  }

  return (
    <div className={`border rounded-lg p-5 transition-all ${getCardStyle()}`}>

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-semibold pr-3 leading-snug">{exam.title}</h3>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`w-1.5 h-1.5 rounded-full ${getDotColor()}`} />
          <span className={`text-[10px] uppercase tracking-[0.15em] font-medium ${getStatusColor()}`}>
            {getStatusLabel()}
          </span>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-1 mb-4">
        <span className="text-[10px] uppercase tracking-[0.15em] text-zinc-500">
          Start — {new Date(exam.start_time).toLocaleString()}
        </span>
        <span className="text-[10px] uppercase tracking-[0.15em] text-zinc-500">
          End — {new Date(exam.end_time).toLocaleString()}
        </span>
        <span className="text-[10px] uppercase tracking-[0.15em] text-zinc-500">
          {exam.total_questions} Questions
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">

        {/* ── ADMIN buttons ── */}
        {role === "admin" && (
          <>
            <Link to={`/admin/exams/${exam.id}/questions`}
              className="text-[10px] uppercase tracking-widest bg-black text-white px-3 py-1.5 rounded hover:bg-zinc-800 transition-all">
              Questions
            </Link>
            <Link to={`/admin/exams/${exam.id}/modify`}
              className="text-[10px] uppercase tracking-widest border border-zinc-300 px-3 py-1.5 rounded hover:border-black transition-all">
              Modify
            </Link>
            <Link to={`/admin/exams/${exam.id}/leaderboard`}
              className="text-[10px] uppercase tracking-widest border border-zinc-300 px-3 py-1.5 rounded hover:border-black transition-all">
              Leaderboard
            </Link>
            <button onClick={() => onDelete?.(exam.id)}
              className="text-[10px] uppercase tracking-widest border border-zinc-200 text-zinc-400 px-3 py-1.5 rounded hover:border-red-400 hover:text-red-500 transition-all">
              Delete
            </button>
          </>
        )}

        {/* ── STUDENT buttons ── */}
        {role === "student" && (
          <>
            {/* Green card — live and not attempted */}
            {isLive && !isAttempted && (
              <Link to={`/student/exams/${exam.id}/note`}
                className="text-[10px] uppercase tracking-widest bg-green-600 text-white px-4 py-1.5 rounded hover:bg-green-700 transition-all">
                Attempt
              </Link>
            )}

            {/* Blue card — already attempted */}
            {isAttempted && (
              <>
                <Link to={`/student/exams/${exam.id}/score`}
                  className="text-[10px] uppercase tracking-widest bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition-all">
                  View Score
                </Link>
                <Link to={`/student/exams/${exam.id}/leaderboard`}
                  className="text-[10px] uppercase tracking-widest border border-blue-300 text-blue-700 px-3 py-1.5 rounded hover:bg-blue-50 transition-all">
                  Leaderboard
                </Link>
              </>
            )}

            {/* Red card — expired and not attempted (missed) */}
            {isPast && !isAttempted && (
              <Link to={`/student/exams/${exam.id}/score`}
                className="text-[10px] uppercase tracking-widest border border-red-300 text-red-600 px-3 py-1.5 rounded hover:bg-red-50 transition-all">
                Leaderboard
              </Link>
            )}

            {/* Gray card — scheduled, not started yet */}
            {isScheduled && (
              <span className="text-[10px] uppercase tracking-widest border border-zinc-200 text-zinc-400 px-3 py-1.5 rounded">
                Not started yet
              </span>
            )}
          </>
        )}
      </div>
    </div>
  )
}
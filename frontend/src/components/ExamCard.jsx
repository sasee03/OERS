import { Link } from "react-router-dom"

export default function ExamCard({ exam, role, isAttempted, onDelete }) {
  const now = new Date(), start = new Date(exam.start_time), end = new Date(exam.end_time)
  const isLive = now >= start && now <= end && exam.is_active
  const isPast = now > end || !exam.is_active

  const statusColor = isLive ? "text-black" : isPast ? "text-zinc-300" : "text-zinc-400"
  const statusLabel = isLive ? "Live" : isPast ? "Ended" : "Scheduled"

  return (
    <div className={`border border-zinc-100 p-6 ${isPast ? "opacity-60" : ""}`}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium pr-4">{exam.title}</h3>
        <span className={`text-[10px] uppercase tracking-[0.2em] whitespace-nowrap ${statusColor}`}>{statusLabel}</span>
      </div>

      <div className="flex flex-col gap-1 mb-6">
        <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">{new Date(exam.start_time).toLocaleString()}</span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">End — {new Date(exam.end_time).toLocaleString()}</span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">{exam.total_questions} Questions</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {role === "admin" && (<>
          <Link to={`/admin/exams/${exam.id}/questions`}
            className="text-[10px] uppercase tracking-widest bg-black text-white px-3 py-1.5 hover:bg-zinc-800 transition-all">
            Questions
          </Link>
          <Link to={`/admin/exams/${exam.id}/modify`}
            className="text-[10px] uppercase tracking-widest border border-zinc-200 px-3 py-1.5 hover:border-black transition-all">
            Modify
          </Link>
          <Link to={`/admin/exams/${exam.id}/leaderboard`}
            className="text-[10px] uppercase tracking-widest border border-zinc-200 px-3 py-1.5 hover:border-black transition-all">
            Leaderboard
          </Link>
          <button onClick={() => onDelete(exam.id)}
            className="text-[10px] uppercase tracking-widest border border-zinc-100 text-zinc-400 px-3 py-1.5 hover:border-red-300 hover:text-red-500 transition-all">
            Delete
          </button>
        </>)}

        {role === "student" && (<>
          {isLive && !isAttempted && (
            <Link to={`/student/exams/${exam.id}/note`}
              className="text-[10px] uppercase tracking-widest bg-black text-white px-3 py-1.5 hover:bg-zinc-800 transition-all">
              Attempt
            </Link>
          )}
          {isAttempted && (
            <Link to={`/student/exams/${exam.id}/score`}
              className="text-[10px] uppercase tracking-widest border border-black px-3 py-1.5 hover:bg-black hover:text-white transition-all">
              View Score
            </Link>
          )}
          <Link to={`/student/exams/${exam.id}/leaderboard`}
            className="text-[10px] uppercase tracking-widest border border-zinc-200 px-3 py-1.5 hover:border-black transition-all">
            Leaderboard
          </Link>
        </>)}
      </div>
    </div>
  )
}
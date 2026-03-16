import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getLeaderboard, getExam } from "../../services/adminService"
import Navbar from "../../components/Navbar"
import { Exam, LeaderboardEntry } from "../../types"

export default function AdminLeaderboard() {
  const { id }   = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [board, setBoard] = useState<LeaderboardEntry[]>([])
  const [exam,  setExam]  = useState<Exam | null>(null)

  useEffect(() => {
    getExam(id!).then(r => setExam(r.data))
    getLeaderboard(id!).then(r => setBoard(r.data))
  }, [id])

  const medals = ["🥇","🥈","🥉"]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="max-w-2xl">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-2">{exam?.title}</p>
              <h1 className="text-4xl font-light uppercase tracking-[0.2em]">Leaderboard</h1>
            </div>
            <button onClick={() => navigate("/admin")}
              className="text-[10px] uppercase tracking-widest border border-zinc-200 px-6 py-3 hover:border-black transition-all">
              ← Back
            </button>
          </div>

          {board.length === 0 ? (
            <div className="border border-zinc-100 py-16 text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">No submissions yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {board.map(entry => (
                <div key={entry.student_id}
                  className={`flex items-center gap-6 px-6 py-4 border transition-colors ${entry.rank <= 3 ? "border-zinc-200" : "border-zinc-100"}`}>
                  <span className="text-lg w-8 text-center">
                    {entry.rank <= 3 ? medals[entry.rank - 1] : `#${entry.rank}`}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{entry.username}</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">{entry.time_taken}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{entry.score}/{entry.total_marks}</p>
                    <p className={`text-[10px] uppercase tracking-[0.2em] ${entry.percentage >= 60 ? "text-black" : "text-zinc-400"}`}>
                      {entry.percentage}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
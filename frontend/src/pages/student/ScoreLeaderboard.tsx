import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { getMyScore, getLeaderboard, getExam } from "../../services/studentService"
import { useAuth } from "../../context/AuthContext"
import Navbar from "../../components/Navbar"
import { Exam, Submission, LeaderboardEntry } from "../../types"

export default function ScoreLeaderboard() {
  const { id }   = useParams<{ id: string }>()
  const { user } = useAuth()

  const [score,  setScore]  = useState<Submission | null>(null)
  const [board,  setBoard]  = useState<LeaderboardEntry[]>([])
  const [exam,   setExam]   = useState<Exam | null>(null)
  const [tab,    setTab]    = useState<"score" | "board">("score")
  const [missed, setMissed] = useState(false)

  useEffect(() => {
    getExam(id!).then(r => setExam(r.data))
    getLeaderboard(id!).then(r => setBoard(r.data))
    getMyScore(id!).then(r => setScore(r.data)).catch(() => setMissed(true))
  }, [id])

  const medals   = ["🥇","🥈","🥉"]
  const myEntry  = board.find(e => e.student_id === user?.id)
  const pct      = score ? ((score.score / score.total_marks) * 100).toFixed(1) : "0"
  const passed   = parseFloat(pct) >= 60

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="max-w-2xl">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-2">{exam?.title}</p>
              <h1 className="text-4xl font-light uppercase tracking-[0.2em]">Results</h1>
            </div>
            <Link to="/student"
              className="text-[10px] uppercase tracking-widest border border-zinc-200 px-6 py-3 hover:border-black transition-all">
              ← Dashboard
            </Link>
          </div>

          <div className="flex gap-0 border-b border-zinc-100 mb-8">
            {(["score","board"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`text-[10px] uppercase tracking-[0.2em] px-6 py-3 border-b-2 -mb-px transition-colors ${tab === t ? "border-black text-black" : "border-transparent text-zinc-400 hover:text-black"}`}>
                {t === "score" ? "My Score" : "Leaderboard"}
              </button>
            ))}
          </div>

          {tab === "score" && (
            missed ? (
              <div className="border border-zinc-100 py-16 text-center">
                <p className="text-4xl mb-4">😔</p>
                <h2 className="text-xl font-light uppercase tracking-[0.2em] mb-2">Missed the timing</h2>
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-8">The exam window has closed</p>
                <button onClick={() => setTab("board")}
                  className="text-[10px] uppercase tracking-widest border border-zinc-200 px-6 py-3 hover:border-black transition-all">
                  View Leaderboard
                </button>
              </div>
            ) : score ? (
              <div className="border border-zinc-100 p-10">
                <div className="text-center mb-10">
                  <p className={`text-6xl font-light mb-2 ${passed ? "text-black" : "text-zinc-300"}`}>{pct}%</p>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400">{passed ? "Passed" : "Failed"}</p>
                </div>
                <div className="grid grid-cols-3 gap-px bg-zinc-100 mb-8">
                  {([[score.score,"Your Score"],[score.total_marks,"Total"],[`${pct}%`,"Percentage"]] as [string|number, string][]).map(([val, label]) => (
                    <div key={label} className="bg-white p-6 text-center">
                      <p className="text-2xl font-light mb-1">{val}</p>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">{label}</p>
                    </div>
                  ))}
                </div>
                {myEntry && (
                  <p className="text-center text-[10px] uppercase tracking-[0.2em] text-zinc-500 border border-zinc-100 py-4">
                    Ranked <span className="text-black font-medium">#{myEntry.rank}</span> out of{" "}
                    <span className="text-black font-medium">{board.length}</span> students
                  </p>
                )}
              </div>
            ) : (
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">Loading score...</p>
            )
          )}

          {tab === "board" && (
            board.length === 0 ? (
              <div className="border border-zinc-100 py-16 text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">No submissions yet</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {board.map(entry => (
                  <div key={entry.student_id}
                    className={`flex items-center gap-6 px-6 py-4 border transition-colors ${entry.student_id === user?.id ? "border-black" : "border-zinc-100 hover:border-zinc-200"}`}>
                    <span className="text-lg w-8 text-center">
                      {entry.rank <= 3 ? medals[entry.rank - 1] : `#${entry.rank}`}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium flex items-center gap-2">
                        {entry.username}
                        {entry.student_id === user?.id && (
                          <span className="text-[10px] uppercase tracking-[0.2em] bg-black text-white px-2 py-0.5">You</span>
                        )}
                      </p>
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
            )
          )}
        </div>
      </div>
    </div>
  )
}
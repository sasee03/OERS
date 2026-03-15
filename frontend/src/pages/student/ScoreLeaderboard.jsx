import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { getMyScore, getLeaderboard, getExam } from "../../services/studentService"
import { useAuth } from "../../context/AuthContext"
import Navbar from "../../components/Navbar"

export default function ScoreLeaderboard() {
  const { id }   = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [score,  setScore]  = useState(null)
  const [board,  setBoard]  = useState([])
  const [exam,   setExam]   = useState(null)
  const [tab,    setTab]    = useState("score")
  const [missed, setMissed] = useState(false)

  useEffect(() => {
    getExam(id).then(r => setExam(r.data))
    getLeaderboard(id).then(r => setBoard(r.data))
    getMyScore(id)
      .then(r => setScore(r.data))
      .catch(() => setMissed(true))
  }, [id])

  const medals = ["🥇","🥈","🥉"]
  const myEntry = board.find(e => e.student_id === user?.id)

  const pct    = score ? ((score.score / score.total_marks) * 100).toFixed(1) : 0
  const passed = pct >= 60

  return (
    <div className="page">
      <Navbar />
      <div className="container narrow">
        <div className="page-header flex-between">
          <div><h1>{exam?.title}</h1></div>
          <Link to="/student" className="btn-outline">← Dashboard</Link>
        </div>

        <div className="tabs">
          <button className={`tab ${tab === "score" ? "active" : ""}`} onClick={() => setTab("score")}>My Score</button>
          <button className={`tab ${tab === "board" ? "active" : ""}`} onClick={() => setTab("board")}>Leaderboard</button>
        </div>

        {tab === "score" && (
          missed ? (
            <div className="missed-card">
              <span>😔</span>
              <h2>Oops! You have missed the timing</h2>
              <p>The exam window has closed and you did not submit.</p>
              <button onClick={() => setTab("board")} className="btn-outline">View Leaderboard</button>
            </div>
          ) : score ? (
            <div className="score-card">
              <div className={`score-circle ${passed ? "pass" : "fail"}`}>
                <span className="score-pct">{pct}%</span>
                <span className="score-label">{passed ? "Passed ✓" : "Failed ✗"}</span>
              </div>
              <h2>{exam?.title}</h2>
              <div className="score-stats">
                <div className="score-stat"><h3>{score.score}</h3><p>Your Score</p></div>
                <div className="score-stat"><h3>{score.total_marks}</h3><p>Total</p></div>
                <div className="score-stat"><h3>{pct}%</h3><p>Percentage</p></div>
              </div>
              {myEntry && (
                <div className="rank-banner">
                  You have been ranked <strong>#{myEntry.rank}</strong> out of <strong>{board.length}</strong> students
                </div>
              )}
              <p className="muted">Submitted: {score.submitted_at ? new Date(score.submitted_at).toLocaleString() : "—"}</p>
            </div>
          ) : <div className="loading">Loading score...</div>
        )}

        {tab === "board" && (
          board.length === 0 ? (
            <div className="empty-state"><span>🏆</span><h3>No submissions yet</h3></div>
          ) : (
            <div className="leaderboard">
              {board.map(entry => (
                <div key={entry.student_id}
                  className={`leaderboard-row rank-${entry.rank <= 3 ? entry.rank : "other"} ${entry.student_id === user?.id ? "my-row" : ""}`}>
                  <span className="rank-badge">{entry.rank <= 3 ? medals[entry.rank-1] : `#${entry.rank}`}</span>
                  <div className="lb-info">
                    <strong>{entry.username}</strong>
                    {entry.student_id === user?.id && <span className="you-tag">You</span>}
                    <span className="muted">{entry.time_taken}</span>
                  </div>
                  <div className="lb-score">
                    <span>{entry.score}/{entry.total_marks}</span>
                    <span className={`badge ${entry.percentage >= 60 ? "badge-success" : "badge-danger"}`}>{entry.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}

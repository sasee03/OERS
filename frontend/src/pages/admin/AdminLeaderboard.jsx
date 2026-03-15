import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getLeaderboard, getExam } from "../../services/adminService"
import Navbar from "../../components/Navbar"

export default function AdminLeaderboard() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [board, setBoard] = useState([])
  const [exam,  setExam]  = useState(null)

  useEffect(() => {
    getExam(id).then(r => setExam(r.data))
    getLeaderboard(id).then(r => setBoard(r.data))
  }, [id])

  const medals = ["🥇","🥈","🥉"]

  return (
    <div className="page">
      <Navbar />
      <div className="container narrow">
        <div className="page-header flex-between">
          <div><h1>🏆 Leaderboard</h1><p>{exam?.title}</p></div>
          <button onClick={() => navigate("/admin")} className="btn-outline">← Back</button>
        </div>
        {board.length === 0 ? (
          <div className="empty-state"><span>🏆</span><h3>No submissions yet</h3></div>
        ) : (
          <div className="leaderboard">
            {board.map(entry => (
              <div key={entry.student_id} className={`leaderboard-row rank-${entry.rank <= 3 ? entry.rank : "other"}`}>
                <span className="rank-badge">{entry.rank <= 3 ? medals[entry.rank-1] : `#${entry.rank}`}</span>
                <div className="lb-info">
                  <strong>{entry.username}</strong>
                  <span className="muted">{entry.time_taken}</span>
                </div>
                <div className="lb-score">
                  <span>{entry.score}/{entry.total_marks}</span>
                  <span className={`badge ${entry.percentage >= 60 ? "badge-success" : "badge-danger"}`}>{entry.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

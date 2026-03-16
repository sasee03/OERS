import { useState, useEffect } from "react"
import { getStudents } from "../../services/adminService"
import Navbar from "../../components/Navbar"

export default function Students() {
  const [students, setStudents] = useState([])
  useEffect(() => { getStudents().then(r => setStudents(r.data)) }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="mb-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-2">{students.length} enrolled</p>
          <h1 className="text-4xl font-light uppercase tracking-[0.2em]">Students</h1>
        </div>
        <div className="border border-zinc-100">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100">
                {["#","Username","Email","ID"].map(h => (
                  <th key={h} className="text-left text-[10px] uppercase tracking-[0.2em] text-zinc-400 px-6 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={s.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4 text-[10px] text-zinc-400">{i + 1}</td>
                  <td className="px-6 py-4 text-sm font-medium">{s.username}</td>
                  <td className="px-6 py-4 text-sm text-zinc-500">{s.email}</td>
                  <td className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-zinc-400">#{s.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
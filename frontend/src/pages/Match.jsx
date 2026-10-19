import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../api'

const LEVELS = { 0: 'Not yet', 1: 'Beginner', 2: 'Intermediate', 3: 'Advanced' }

function SkillRow({ s }) {
  return (
    <li className="py-2 flex items-center justify-between">
      <span className="text-slate-800">{s.skill}</span>
      <span className="text-sm text-slate-500">
        {s.importance === 'required' ? 'Required' : 'Nice to have'} · {LEVELS[s.your_level]}
      </span>
    </li>
  )
}

export default function Match() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get(`/jobs/${id}/match/`)
      .then((res) => setData(res.data))
      .catch(() => setError('Could not load this job.'))
  }, [id])

  if (error) return <p className="p-6 text-red-600">{error}</p>
  if (!data) return <p className="p-6 text-slate-600">Loading...</p>

  const score = data.match_score
  const color = score >= 75 ? 'bg-green-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500'

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">{data.job}</h1>
          <Link to="/jobs" className="text-sm text-indigo-600 font-medium">
            Back to jobs
          </Link>
        </div>

        <p className="mt-6 text-5xl font-bold text-slate-800">{score}%</p>
        <p className="text-slate-500">ready for this role</p>
        <div className="mt-3 h-3 w-full rounded-full bg-slate-200">
          <div className={`h-3 rounded-full ${color}`} style={{ width: `${score}%` }} />
        </div>

        <h2 className="mt-8 font-semibold text-slate-800">Missing skills (learn these next)</h2>
        <ul className="divide-y divide-slate-200">
          {data.missing_skills.length === 0 && (
            <li className="py-2 text-slate-500">Nothing missing. Great work!</li>
          )}
          {data.missing_skills.map((s) => (
            <SkillRow key={s.skill} s={s} />
          ))}
        </ul>

        <h2 className="mt-6 font-semibold text-slate-800">Skills you already have</h2>
        <ul className="divide-y divide-slate-200">
          {data.matched_skills.length === 0 && (
            <li className="py-2 text-slate-500">No matching skills yet.</li>
          )}
          {data.matched_skills.map((s) => (
            <SkillRow key={s.skill} s={s} />
          ))}
        </ul>
      </div>
    </div>
  )
}
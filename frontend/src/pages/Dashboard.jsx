import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import api from '../api'
import Layout from '../components/Layout'
import Ring from '../components/Ring'

function ProgressTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null
  const p = payload[0].payload
  return (
    <div className="rounded-lg border border-line bg-white px-3 py-2 text-sm shadow">
      <p className="font-medium">{p.job}</p>
      <p className="text-slate-600">{p.match_score}% ready</p>
      <p className="text-slate-400">{p.created_at}</p>
    </div>
  )
}

const card = 'bg-white border border-line rounded-2xl p-6'

export default function Dashboard() {
  const [skills, setSkills] = useState([])
  const [progress, setProgress] = useState([])
  const [missing, setMissing] = useState([])

  useEffect(() => {
    api.get('/my-skills/').then((r) => setSkills(r.data))
    api.get('/analytics/progress/').then((r) => setProgress(r.data))
    api.get('/analytics/top-missing/').then((r) => setMissing(r.data))
  }, [])

  const last = progress.length ? progress[progress.length - 1] : null
  const maxScore = Math.max(...missing.map((m) => m.priority_score), 1)

  return (
    <Layout>
      <section className={card + ' flex flex-col sm:flex-row items-center gap-8 sm:p-8'}>
        <Ring value={last ? last.match_score : 0} size={180} label={last ? 'ready' : 'no score yet'} />
        <div>
          <h1 className="text-3xl font-bold">
            {last ? 'You are ' + last.match_score + '% ready for ' + last.job : 'Find out how ready you are'}
          </h1>
          <p className="mt-2 max-w-md text-slate-600">
            {last
              ? 'This is your latest match. Add skills or check another job to update it.'
              : 'Save a job description and we will compare it with your skills.'}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/jobs"
              className="rounded-lg bg-ink px-5 py-2.5 font-medium text-white hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-ready"
            >
              {last ? 'Check another job' : 'Add a job'}
            </Link>
            <Link
              to="/skills"
              className="rounded-lg border border-line px-5 py-2.5 font-medium hover:bg-paper focus-visible:outline-2 focus-visible:outline-ready"
            >
              Update my skills ({skills.length})
            </Link>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className={card + ' lg:col-span-2'}>
          <h2 className="text-lg font-bold">Your readiness over time</h2>
          {progress.length === 0 ? (
            <p className="mt-3 text-slate-500">Open a job match to record your first score.</p>
          ) : (
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dde3ec" />
                  <XAxis dataKey="created_at" tick={false} />
                  <YAxis domain={[0, 100]} unit="%" />
                  <Tooltip content={<ProgressTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="match_score"
                    stroke="#14213d"
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#0f9d8a', stroke: '#0f9d8a' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section className={card}>
          <h2 className="text-lg font-bold">Learn these next</h2>
          {missing.length === 0 ? (
            <p className="mt-3 text-slate-500">
              No gaps across your saved jobs yet. Add more jobs to get suggestions.
            </p>
          ) : (
            <ul className="mt-4 space-y-4">
              {missing.map((m) => (
                <li key={m.skill}>
                  <div className="flex items-baseline justify-between">
                    <span className="font-medium">{m.skill}</span>
                    <span className="text-sm text-slate-500">
                      {m.jobs_needing} {m.jobs_needing === 1 ? 'job' : 'jobs'}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-paper">
                    <div
                      className="h-1.5 rounded-full bg-gap"
                      style={{ width: (m.priority_score / maxScore) * 100 + '%' }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Layout>
  )
}
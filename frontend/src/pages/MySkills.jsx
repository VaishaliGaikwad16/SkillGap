import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

const LEVELS = { 1: 'Beginner', 2: 'Intermediate', 3: 'Advanced' }

export default function MySkills() {
  const [mine, setMine] = useState([])
  const [catalog, setCatalog] = useState([])
  const [name, setName] = useState('')
  const [level, setLevel] = useState(1)
  const [error, setError] = useState('')

  const load = async () => {
    const [a, b] = await Promise.all([api.get('/my-skills/'), api.get('/skills/')])
    setMine(a.data)
    setCatalog(b.data)
  }

  useEffect(() => {
    load()
  }, [])

  const add = async (e) => {
    e.preventDefault()
    setError('')
    const clean = name.trim()
    if (!clean) return
    try {
      let skill = catalog.find((s) => s.name.toLowerCase() === clean.toLowerCase())
      if (!skill) {
        const { data } = await api.post('/skills/', { name: clean })
        skill = data
      }
      await api.post('/my-skills/', { skill: skill.id, level })
      setName('')
      setLevel(1)
      await load()
    } catch (err) {
      const d = err.response?.data
      setError(d ? Object.values(d).flat().join(' ') : 'Something went wrong.')
    }
  }

  const changeLevel = async (item, newLevel) => {
    await api.patch(`/my-skills/${item.id}/`, { level: Number(newLevel) })
    await load()
  }

  const remove = async (item) => {
    await api.delete(`/my-skills/${item.id}/`)
    await load()
  }

  const field =
    'rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">My Skills</h1>
          <Link to="/dashboard" className="text-sm text-indigo-600 font-medium">
            Back to dashboard
          </Link>
        </div>

        <form onSubmit={add} className="mt-6 flex flex-wrap gap-2">
          <input
            className={`${field} flex-1 min-w-40`}
            list="skill-options"
            placeholder="Skill name (e.g. Python)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <datalist id="skill-options">
            {catalog.map((s) => (
              <option key={s.id} value={s.name} />
            ))}
          </datalist>
          <select className={field} value={level} onChange={(e) => setLevel(Number(e.target.value))}>
            {Object.entries(LEVELS).map(([v, label]) => (
              <option key={v} value={v}>{label}</option>
            ))}
          </select>
          <button className="rounded-lg bg-indigo-600 text-white px-4 py-2 font-medium hover:bg-indigo-700">
            Add
          </button>
        </form>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        <ul className="mt-6 divide-y divide-slate-200">
          {mine.length === 0 && (
            <li className="py-3 text-slate-500">No skills yet. Add your first one above.</li>
          )}
          {mine.map((s) => (
            <li key={s.id} className="py-3 flex items-center justify-between gap-3">
              <span className="font-medium text-slate-800">{s.skill_name}</span>
              <div className="flex items-center gap-3">
                <select
                  className={field}
                  value={s.level}
                  onChange={(e) => changeLevel(s, e.target.value)}
                >
                  {Object.entries(LEVELS).map(([v, label]) => (
                    <option key={v} value={v}>{label}</option>
                  ))}
                </select>
                <button onClick={() => remove(s)} className="text-sm text-red-600 font-medium">
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

const field =
  'w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [catalog, setCatalog] = useState([])
  const [form, setForm] = useState({ title: '', company: '', raw_text: '' })
  const [picked, setPicked] = useState([])
  const [skillName, setSkillName] = useState('')
  const [importance, setImportance] = useState('required')
  const [error, setError] = useState('')
  const [note, setNote] = useState('')
  const [detecting, setDetecting] = useState(false)

  const load = async () => {
    const [a, b] = await Promise.all([api.get('/jobs/'), api.get('/skills/')])
    setJobs(a.data)
    setCatalog(b.data)
  }

  useEffect(() => {
    load()
  }, [])

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const addSkill = async () => {
    const clean = skillName.trim()
    if (!clean) return
    let skill = catalog.find((s) => s.name.toLowerCase() === clean.toLowerCase())
    if (!skill) {
      const res = await api.post('/skills/', { name: clean })
      skill = res.data
      setCatalog([...catalog, skill])
    }
    if (!picked.some((p) => p.skill === skill.id)) {
      setPicked([...picked, { skill: skill.id, skill_name: skill.name, importance }])
    }
    setSkillName('')
  }

  const removePicked = (id) => setPicked(picked.filter((p) => p.skill !== id))

  const detect = async () => {
    setError('')
    setNote('')
    if (!form.raw_text.trim()) {
      setError('Paste the job description first.')
      return
    }
    setDetecting(true)
    try {
      const res = await api.post('/jobs/extract-skills/', { raw_text: form.raw_text })
      const found = res.data.skills
      const merged = [...picked]
      found.forEach((s) => {
        if (!merged.some((p) => p.skill === s.skill)) merged.push(s)
      })
      setPicked(merged)
      const refreshed = await api.get('/skills/')
      setCatalog(refreshed.data)
      const how = res.data.method === 'ai' ? 'AI' : 'keyword matching'
      if (found.length > 0) {
        setNote('Found ' + found.length + ' skills using ' + how + '. Review them below.')
      } else {
        setNote('No skills found. Add them manually.')
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not detect skills.')
    }
    setDetecting(false)
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (picked.length === 0) {
      setError('Add at least one skill the job needs.')
      return
    }
    try {
      await api.post('/jobs/', {
        ...form,
        skills: picked.map((p) => ({ skill: p.skill, importance: p.importance })),
      })
      setForm({ title: '', company: '', raw_text: '' })
      setPicked([])
      setNote('')
      await load()
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Something went wrong.'))
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">Jobs</h1>
          <Link to="/dashboard" className="text-sm text-indigo-600 font-medium">Back to dashboard</Link>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <input className={field} name="title" placeholder="Job title" value={form.title} onChange={change} required />
          <input className={field} name="company" placeholder="Company (optional)" value={form.company} onChange={change} />
          <textarea className={field} name="raw_text" rows="4" placeholder="Paste the job description here" value={form.raw_text} onChange={change} required />

          <button
            type="button"
            onClick={detect}
            disabled={detecting}
            className="rounded-lg border border-indigo-600 text-indigo-600 px-4 py-2 font-medium hover:bg-indigo-50 disabled:opacity-50"
          >
            {detecting ? 'Detecting...' : 'Auto-detect skills'}
          </button>
          {note && <p className="text-sm text-green-700">{note}</p>}

          <p className="text-sm font-medium text-slate-700">Skills this job needs</p>
          <div className="flex flex-wrap gap-2">
                <input
              className="flex-1 min-w-40 rounded-lg border border-slate-300 px-3 py-2"
              list="job-skill-options"
              placeholder="Skill name"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
            />

                        <datalist id="job-skill-options">
              {catalog.map((s) => (
                <option key={s.id} value={s.name} />
              ))}
            </datalist>
            <select
              className="rounded-lg border border-slate-300 px-3 py-2"
              value={importance}
              onChange={(e) => setImportance(e.target.value)}
            >
              <option value="required">Required</option>
              <option value="nice">Nice to have</option>
            </select>
            <button type="button" onClick={addSkill} className="rounded-lg bg-slate-800 text-white px-4 py-2 font-medium">
              Add skill
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {picked.map((p) => (
              <span key={p.skill} className="text-sm rounded-full px-3 py-1 bg-indigo-100 text-indigo-800">
                {p.skill_name} ({p.importance})
                <button type="button" onClick={() => removePicked(p.skill)} className="font-bold ml-2">x</button>
              </span>
            ))}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button className="rounded-lg bg-indigo-600 text-white px-4 py-2 font-medium hover:bg-indigo-700">
            Save job
          </button>
        </form>

        <h2 className="mt-8 text-lg font-semibold text-slate-800">Your saved jobs</h2>
        <ul className="mt-2 divide-y divide-slate-200">
          {jobs.length === 0 && <li className="py-3 text-slate-500">No jobs yet.</li>}
          {jobs.map((j) => (
            <li key={j.id} className="py-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">{j.title}</p>
                <p className="text-sm text-slate-500">{j.company || 'No company'}</p>
              </div>
              <Link to={'/jobs/' + j.id} className="text-sm text-indigo-600 font-medium">View match</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
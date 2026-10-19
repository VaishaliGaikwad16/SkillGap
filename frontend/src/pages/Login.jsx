import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

const input =
  'w-full rounded-lg border border-line bg-white px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-ready'

const steps = [
  { title: 'Add your skills', text: 'List what you know and how well you know it.' },
  { title: 'Paste a job description', text: 'We pick out the skills the job asks for.' },
  { title: 'See your gaps', text: 'Get a readiness score and a list of what to learn next.' },
]

export default function Login() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'register') {
        await api.post('/auth/register/', form)
      }
      const { data } = await api.post('/auth/login/', {
        username: form.username,
        password: form.password,
      })
      localStorage.setItem('access', data.access)
      localStorage.setItem('refresh', data.refresh)
      navigate('/dashboard')
    } catch (err) {
      const d = err.response?.data
      setError(d ? Object.values(d).flat().join(' ') : 'Cannot reach the server. Is Django running?')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-center gap-10 bg-ink px-16 text-white">
        <div>
          <h1 className="text-4xl font-bold leading-tight">Know where you stand before you apply.</h1>
          <p className="mt-3 max-w-md text-slate-300">
            Compare your skills with any job description and see exactly what to learn next.
          </p>
        </div>
        <ol className="max-w-md space-y-5">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 font-display font-bold">
                {i + 1}
              </span>
              <div>
                <p className="font-medium">{s.title}</p>
                <p className="text-sm text-slate-300">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-sm space-y-4">
          <h2 className="text-3xl font-bold">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
          <p className="text-slate-500">
            {mode === 'login' ? 'Log in to see your readiness.' : 'It takes less than a minute.'}
          </p>

          <input className={input} name="username" placeholder="Username" value={form.username} onChange={change} required />
          {mode === 'register' && (
            <input className={input} name="email" type="email" placeholder="Email" value={form.email} onChange={change} />
          )}
          <input className={input} name="password" type="password" placeholder="Password" value={form.password} onChange={change} required />

          {error && <p className="text-sm text-gap">{error}</p>}

          <button
            disabled={loading}
            className="w-full rounded-lg bg-ink py-2.5 font-medium text-white hover:bg-slate-800 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-ready"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Create account'}
          </button>

          <p className="text-sm text-slate-500">
            {mode === 'login' ? 'New here?' : 'Already have an account?'}{' '}
            <button
              type="button"
              className="font-medium text-ready"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login')
                setError('')
              }}
            >
              {mode === 'login' ? 'Create an account' : 'Log in'}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}
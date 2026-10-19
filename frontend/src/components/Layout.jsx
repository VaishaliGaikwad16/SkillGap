import { NavLink, useNavigate } from 'react-router-dom'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/skills', label: 'My skills' },
  { to: '/jobs', label: 'Jobs' },
]

export default function Layout({ children }) {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    navigate('/login')
  }

  const linkClass = ({ isActive }) =>
    'rounded-lg px-3 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-white ' +
    (isActive ? 'bg-white/15 text-white' : 'text-slate-300 hover:text-white')

  return (
    <div className="min-h-screen">
      <header className="bg-ink">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-display text-xl font-bold text-white">SkillGap</span>
          <nav className="flex items-center gap-1">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
            <button
              onClick={logout}
              className="ml-2 rounded-lg border border-white/30 px-3 py-2 text-sm font-medium text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
            >
              Log out
            </button>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}
export default function Ring({ value = 0, size = 160, label = 'ready', dark = false }) {
  const stroke = 12
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const v = Math.min(Math.max(value, 0), 100)
  const offset = c - (v / 100) * c
  const color = v >= 75 ? '#0f9d8a' : v >= 50 ? '#e9a23b' : '#e4572e'
  const track = dark ? '#2b3b5f' : '#dde3ec'

  return (
    <div
      className="relative inline-flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="absolute text-center">
        <p className={'font-display text-4xl font-bold ' + (dark ? 'text-white' : 'text-ink')}>
          {Math.round(v)}%
        </p>
        <p className={'text-sm ' + (dark ? 'text-slate-300' : 'text-slate-500')}>{label}</p>
      </div>
    </div>
  )
}
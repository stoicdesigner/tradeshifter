interface ProgressBarProps {
  value: number
  max?: number
  complete?: boolean
  label?: string
  className?: string
}

export function ProgressBar({ value, max = 100, complete, label, className }: ProgressBarProps) {
  const pct = Math.round((value / max) * 100)
  return (
    <div className={className}>
      {label && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="section-label">{label}</span>
          <span className="text-xs" style={{ color: 'var(--fcs-output-dim)' }}>{pct}%</span>
        </div>
      )}
      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Progress'}
      >
        <div
          className={`progress-fill${complete ? ' progress-fill-complete' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

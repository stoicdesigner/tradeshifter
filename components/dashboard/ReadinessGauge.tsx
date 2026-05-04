'use client'

import { useEffect, useState } from 'react'

interface ReadinessGaugeProps {
  score: number // 0-100
  size?: number
}

function getScoreColor(score: number): string {
  if (score >= 75) return '#00D4AA' // ts-accent
  if (score >= 50) return '#0066FF' // ts-accent2
  if (score >= 25) return '#F59E0B' // ts-warn
  return '#EF4444' // ts-danger
}

function getScoreLabel(score: number): string {
  if (score >= 75) return 'Export Ready'
  if (score >= 50) return 'On Track'
  if (score >= 25) return 'Getting Started'
  return 'Just Beginning'
}

export function ReadinessGauge({ score, size = 140 }: ReadinessGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const radius = size / 2 - 12
  const circumference = 2 * Math.PI * radius
  // Only use 270° arc (leave gap at bottom)
  const arcLength = circumference * 0.75
  const offset = circumference * 0.125 // start at 8 o'clock
  const dashOffset = arcLength - (animatedScore / 100) * arcLength
  const color = getScoreColor(score)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score)
    }, 100)
    return () => clearTimeout(timer)
  }, [score])

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="rotate-[135deg]">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1E2433"
          strokeWidth={10}
          strokeDasharray={`${arcLength} ${circumference - arcLength}`}
          strokeDashoffset={-offset}
          strokeLinecap="round"
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeDasharray={`${arcLength} ${circumference - arcLength}`}
          strokeDashoffset={-offset + dashOffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)',
            filter: `drop-shadow(0 0 6px ${color}60)`,
          }}
        />
      </svg>

      {/* Score text overlay */}
      <div className="-mt-[calc(50%+8px)] text-center pointer-events-none">
        <p
          className="font-syne font-extrabold text-3xl leading-none"
          style={{ color }}
        >
          {animatedScore}
        </p>
        <p className="text-ts-muted text-xs mt-1">{getScoreLabel(score)}</p>
      </div>
    </div>
  )
}

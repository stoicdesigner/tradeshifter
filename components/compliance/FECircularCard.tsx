'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, ExternalLink, Shield } from 'lucide-react'
import type { FECircular } from '@/types'

interface FECircularCardProps {
  circular: FECircular
}

export function FECircularCard({ circular }: FECircularCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border border-ts-border rounded-ts-lg bg-ts-surface overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-4 p-5 text-left hover:bg-ts-surface2/50 transition-colors"
      >
        <div className="w-10 h-10 rounded-ts bg-ts-accent/10 flex items-center justify-center shrink-0">
          <Shield size={18} className="text-ts-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-ts-accent uppercase tracking-wider">
              {circular.id}
            </span>
            <span className="text-xs text-ts-muted">{circular.issuer} · {circular.date}</span>
          </div>
          <h3 className="font-syne font-bold text-sm leading-snug">{circular.title}</h3>
          <p className="text-ts-muted text-xs mt-1 leading-relaxed">{circular.summary}</p>
        </div>
        <div className="shrink-0 text-ts-muted mt-1">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-ts-border px-5 pb-5">
          <div className="pt-4">
            <p className="text-xs font-bold text-ts-muted uppercase tracking-wider mb-3">Key Points</p>
            <ul className="space-y-2">
              {circular.key_points.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ts-muted">
                  <span className="text-ts-accent mt-1 shrink-0">›</span>
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>

            {circular.applicability && (
              <div className="mt-4 p-3 rounded-ts bg-ts-accent/5 border border-ts-accent/20">
                <p className="text-xs font-semibold text-ts-accent mb-1">Applies to</p>
                <p className="text-xs text-ts-muted">{circular.applicability}</p>
              </div>
            )}

            <a
              href="https://www.bb.org.bd"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-ts-accent mt-4 hover:underline"
            >
              Official source: Bangladesh Bank
              <ExternalLink size={11} />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Download, Loader2, FileText } from 'lucide-react'

interface ReportDownloadButtonProps {
  sessionId?: string
}

export function ReportDownloadButton({ sessionId }: ReportDownloadButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      // In MVP: print the report page to PDF via browser
      window.print()
    } finally {
      setLoading(false)
    }
  }

  if (process.env.NEXT_PUBLIC_PDF_EXPORT_ENABLED !== 'true') {
    return (
      <button
        onClick={handleDownload}
        className="flex items-center gap-2 px-4 py-2 rounded-ts border border-ts-border bg-ts-surface text-ts-muted text-sm hover:border-ts-accent/50 hover:text-ts-text transition-all"
        title="Print / Save as PDF"
      >
        {loading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <FileText size={14} />
        )}
        Save as PDF
      </button>
    )
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 rounded-ts bg-ts-accent text-ts-bg font-syne font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <Download size={14} />
      )}
      Download Report
    </button>
  )
}

import Link from 'next/link'
import { Shield, AlertTriangle } from 'lucide-react'

interface DisclaimerBannerProps {
  variant?: 'full' | 'compact'
}

export function DisclaimerBanner({ variant = 'compact' }: DisclaimerBannerProps) {
  if (variant === 'compact') {
    return (
      <div className="flex items-start gap-2.5 p-3 rounded-ts bg-ts-warn/5 border border-ts-warn/25">
        <Shield size={13} className="text-ts-warn mt-0.5 shrink-0" />
        <p className="text-xs text-ts-muted leading-relaxed">
          <span className="text-ts-warn font-semibold">Educational guidance only.</span>{' '}
          Not financial, legal, or tax advice. Always verify requirements with Bangladesh Bank and a
          qualified export advisor.{' '}
          <Link href="/compliance" className="text-ts-accent underline">
            Full disclaimer
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="p-5 rounded-ts-lg bg-ts-warn/5 border border-ts-warn/30">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={16} className="text-ts-warn" />
        <p className="font-syne font-bold text-sm text-ts-warn">Important Regulatory Notice</p>
      </div>
      <p className="text-sm text-ts-muted leading-relaxed mb-3">
        All content on this platform is provided for <strong className="text-ts-text">educational and
        informational purposes only</strong>. Nothing on this platform constitutes financial, legal, tax,
        or regulatory advice. Tradeshifters is not a licensed financial advisor, export consultant, or
        Bangladesh Bank authorised entity.
      </p>
      <p className="text-sm text-ts-muted leading-relaxed mb-3">
        Export regulations, FE Circular provisions, and platform requirements change frequently.
        Exporters <strong className="text-ts-text">must independently verify</strong> all requirements
        with Bangladesh Bank, EPB, and the relevant marketplace before taking any action.
      </p>
      <p className="text-xs text-ts-muted">
        References to FE Circular 42, 43, and 48 are summaries only.{' '}
        <a
          href="https://www.bb.org.bd"
          target="_blank"
          rel="noopener noreferrer"
          className="text-ts-accent underline"
        >
          Visit Bangladesh Bank
        </a>{' '}
        for official documentation.
      </p>
    </div>
  )
}

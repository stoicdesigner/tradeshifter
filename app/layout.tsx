import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Tradeshifter — Register as an exporter and get paid internationally',
  description:
    'Get Bangladesh Bank compliant. Get marketplace-ready. Get growing. Built for Bangladeshi SME exporters.',
  keywords: ['Bangladesh export', 'Payoneer', 'Alibaba', 'FE Circular 42 43 48'],
  openGraph: {
    title: 'Tradeshifter',
    description: 'Register as an exporter and start getting payments from international buyers',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased" style={{ background: '#0a0a0a', color: '#f5f3ee', minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  )
}

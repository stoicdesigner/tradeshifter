import Link from 'next/link'
import { Nav } from '@/components/layout/Nav'
import { ArrowRight, Shield, FileText, CheckCircle, MessageCircle } from 'lucide-react'

const VALUE_CARDS = [
  { icon: FileText,      title: 'Platform recommendations',             desc: 'Alibaba, Amazon, Etsy — matched to your product and target markets' },
  { icon: Shield,        title: 'Bangladesh Bank compliance checklist', desc: 'FE Circulars 42, 43, 48 — explained in plain language, no jargon' },
  { icon: CheckCircle,   title: 'KYC setup guide',                     desc: 'Step-by-step Payoneer and platform account setup with direct links' },
  { icon: MessageCircle, title: 'AD bank engagement script',           desc: 'Exactly what to say to your relationship manager at City Bank or EBL' },
]

const STEPS = [
  { n: '1', title: 'Tell us about your business', sub: '2 minutes · 5 questions about your products, markets and goals' },
  { n: '2', title: 'Get your personalised report', sub: 'Which platforms fit your business. What documents you need.' },
  { n: '3', title: 'Start selling globally',       sub: 'Step-by-step KYC and marketplace setup, guided at every stage.' },
]

export default function LandingPage() {
  return (
    <div style={{ background:'var(--fcs-void)', minHeight:'100vh' }}>
      <Nav />

      {/* ── Hero ── */}
      <section aria-labelledby="hero-heading" style={{ maxWidth:'1140px', margin:'0 auto', padding:'72px 24px 64px' }}>
        <div style={{ display:'flex', gap:'8px', marginBottom:'22px', flexWrap:'wrap' }}>
          <span className="badge badge-depth">Bangladesh Bank FE Circular compliant</span>
          <span className="badge badge-muted">8+ global marketplaces</span>
          <span className="badge badge-muted">Free forever · Phase 1</span>
        </div>
        <h1 id="hero-heading" style={{ fontSize:'clamp(26px,5vw,40px)', fontWeight:700, color:'var(--fcs-output)', lineHeight:1.15, maxWidth:'620px', marginBottom:'18px' }}>
          Register as an exporter and start getting payments from international buyers
        </h1>
        <p style={{ fontSize:'16px', color:'var(--fcs-output-dim)', maxWidth:'460px', lineHeight:1.65, marginBottom:'32px' }}>
          Get Bangladesh Bank compliant. Get marketplace-ready. Get growing.
        </p>
        <div style={{ display:'flex', gap:'12px', alignItems:'center', flexWrap:'wrap' }}>
          <Link href="/auth/sign-up" className="btn-primary" style={{ fontSize:'15px', padding:'13px 28px', textDecoration:'none' }}>
            Start free assessment <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <span style={{ fontSize:'13px', color:'var(--fcs-output-faint)' }}>Takes 2 minutes · No sign-up needed</span>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" aria-labelledby="hiw-heading" style={{ borderTop:'1px solid var(--fcs-output-ghost)', borderBottom:'1px solid var(--fcs-output-ghost)', padding:'52px 24px' }}>
        <div style={{ maxWidth:'1140px', margin:'0 auto' }}>
          <p id="hiw-heading" className="section-label" style={{ marginBottom:'28px' }}>How it works</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'32px' }}>
            {STEPS.map(s => (
              <div key={s.n} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:'var(--fcs-signal)', color:'var(--fcs-void)', fontSize:'15px', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }} aria-hidden="true">{s.n}</div>
                <p style={{ fontSize:'15px', fontWeight:600, color:'var(--fcs-output)' }}>{s.title}</p>
                <p style={{ fontSize:'13px', color:'var(--fcs-output-dim)', lineHeight:1.6 }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Value cards ── */}
      <section aria-labelledby="value-heading" style={{ maxWidth:'1140px', margin:'0 auto', padding:'52px 24px' }}>
        <p id="value-heading" className="section-label" style={{ marginBottom:'24px' }}>What you get</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:'14px' }}>
          {VALUE_CARDS.map(c => (
            <div key={c.title} className="card-depth" style={{ display:'flex', gap:'14px' }}>
              <div style={{ width:'38px', height:'38px', borderRadius:'8px', background:'rgba(200,168,75,0.12)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }} aria-hidden="true">
                <c.icon size={18} color="var(--fcs-signal)" strokeWidth={1.6} />
              </div>
              <div>
                <p style={{ fontSize:'14px', fontWeight:600, color:'var(--fcs-output)', marginBottom:'5px' }}>{c.title}</p>
                <p style={{ fontSize:'12px', color:'var(--fcs-output-dim)', lineHeight:1.55 }}>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section aria-label="Call to action" style={{ borderTop:'1px solid var(--fcs-output-ghost)', background:'#111', padding:'32px 24px' }}>
        <div style={{ maxWidth:'1140px', margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'16px' }}>
          <div>
            <p style={{ fontSize:'16px', fontWeight:600, color:'var(--fcs-output)', marginBottom:'4px' }}>Ready to start receiving international payments?</p>
            <p style={{ fontSize:'13px', color:'var(--fcs-output-dim)' }}>Free for all Bangladeshi exporters. No credit card required.</p>
          </div>
          <Link href="/auth/sign-up" className="btn-primary" style={{ textDecoration:'none' }}>
            Start free assessment <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* ── Regulatory footer ── */}
      <footer style={{ borderTop:'1px solid var(--fcs-output-ghost)', padding:'20px 24px' }}>
        <div style={{ maxWidth:'1140px', margin:'0 auto', display:'flex', alignItems:'flex-start', gap:'10px' }}>
          <Shield size={13} color="var(--fcs-signal)" style={{ flexShrink:0, marginTop:'2px' }} aria-hidden="true" />
          <p style={{ fontSize:'11px', color:'var(--fcs-output-faint)', lineHeight:1.65 }}>
            Regulatory notice: All guidance references Bangladesh Bank FE Circular Nos. 42, 43, and 48. Tradeshifter provides educational guidance only and does not constitute legal, tax, or financial advice. Consult your Authorised Dealer (AD) bank before any export transaction.{' '}
            <Link href="/compliance" style={{ color:'var(--fcs-signal)', textDecoration:'underline' }}>View full disclaimer</Link>
          </p>
        </div>
      </footer>
    </div>
  )
}

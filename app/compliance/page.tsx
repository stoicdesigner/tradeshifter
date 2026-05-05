import { Nav } from '@/components/layout/Nav'
import Link from 'next/link'
import { FE_CIRCULARS, PLATFORM_COMPLIANCE, DOCUMENTATION_CHECKLIST } from '@/lib/compliance'
import { Shield, ExternalLink } from 'lucide-react'

export const metadata = { title: 'Compliance — Tradeshifter', description: 'Bangladesh Bank FE Circular 42, 43, 48 guidance for Bangladeshi exporters.' }

export default function CompliancePage() {
  return (
    <div style={{ background:'var(--fcs-void)', minHeight:'100vh' }}>
      <Nav />
      <main style={{ maxWidth:'900px', margin:'0 auto', padding:'40px 24px 80px' }}>

        <div style={{ marginBottom:'28px' }}>
          <span className="badge badge-depth" style={{ marginBottom:'12px', display:'inline-flex' }}>Regulatory reference</span>
          <h1 style={{ fontSize:'26px', fontWeight:700, color:'var(--fcs-output)', marginBottom:'8px' }}>Compliance resources</h1>
          <p style={{ fontSize:'14px', color:'var(--fcs-output-dim)', lineHeight:1.65, maxWidth:'540px' }}>
            Reference material for Bangladesh Bank Foreign Exchange Circulars relevant to online exporters. Always verify with your AD bank.
          </p>
        </div>

        {/* ── Prominent disclaimer ── */}
        <div role="note" aria-label="Regulatory disclaimer" className="disclaimer-block" style={{ marginBottom:'24px' }}>
          <div style={{ display:'flex', gap:'10px', alignItems:'flex-start' }}>
            <Shield size={16} color="var(--fcs-signal)" style={{ flexShrink:0, marginTop:'2px' }} aria-hidden="true" />
            <div>
              <p style={{ fontSize:'13px', fontWeight:600, color:'var(--fcs-signal-light)', marginBottom:'5px' }}>Important regulatory notice</p>
              <p style={{ fontSize:'12px', color:'var(--fcs-output-dim)', lineHeight:1.7 }}>
                All guidance on Tradeshifter references Bangladesh Bank FE Circular Nos. 42, 43, and 48. This platform does not provide legal, tax, or financial advice. Consult your Authorised Dealer (AD) bank before proceeding with any export transaction. Information is provided for educational purposes only.
              </p>
              <a href="https://www.bb.org.bd" target="_blank" rel="noopener noreferrer" style={{ display:'inline-flex', alignItems:'center', gap:'4px', fontSize:'12px', color:'var(--fcs-signal)', textDecoration:'none', marginTop:'8px' }}>
                Bangladesh Bank official site <ExternalLink size={11} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* ── FE Circular cards ── */}
        <section aria-labelledby="circulars-heading" style={{ marginBottom:'28px' }}>
          <p id="circulars-heading" className="section-label" style={{ marginBottom:'14px' }}>FE Circular reference</p>
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {FE_CIRCULARS.map((c, i) => (
              <details key={c.number} className="card-depth" style={{ cursor:'pointer' }}>
                <summary style={{ display:'flex', alignItems:'center', gap:'10px', listStyle:'none', userSelect:'none', outline:'none' }}
                  aria-label={`${c.number}: ${c.title} — expand for details`}>
                  <span className={`badge ${i===0?'badge-signal':i===1?'badge-depth':'badge-muted'}`}>{c.number}</span>
                  <p style={{ fontSize:'14px', fontWeight:500, color:'var(--fcs-output)', flex:1 }}>{c.title}</p>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink:0, color:'var(--fcs-signal)', transition:'transform 200ms' }}><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                </summary>
                <div style={{ marginTop:'14px', borderTop:'1px solid var(--fcs-output-ghost)', paddingTop:'14px' }}>
                  <p style={{ fontSize:'13px', color:'var(--fcs-output-dim)', lineHeight:1.7, marginBottom:'12px' }}>{c.summary}</p>
                  <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'6px', marginBottom:'12px' }} aria-label={`Key points for ${c.number}`}>
                    {c.key_points.map((pt,j) => (
                      <li key={j} style={{ display:'flex', gap:'8px', alignItems:'flex-start', fontSize:'12px', color:'var(--fcs-output-dim)' }}>
                        <span style={{ color:'var(--fcs-signal)', flexShrink:0 }} aria-hidden="true">›</span>{pt}
                      </li>
                    ))}
                  </ul>
                  {c.applicability && (
                    <div style={{ background:'var(--fcs-signal-glow)', border:'1px solid rgba(200,168,75,0.2)', borderRadius:'6px', padding:'10px 12px' }}>
                      <p style={{ fontSize:'11px', fontWeight:600, color:'var(--fcs-signal)', marginBottom:'3px' }}>Applies to</p>
                      <p style={{ fontSize:'12px', color:'var(--fcs-output-dim)' }}>{c.applicability}</p>
                    </div>
                  )}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ── Platform compliance ── */}
        <section aria-labelledby="platform-heading" style={{ marginBottom:'28px' }}>
          <p id="platform-heading" className="section-label" style={{ marginBottom:'14px' }}>Platform compliance notes</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'12px' }}>
            {PLATFORM_COMPLIANCE.map(p => (
              <div key={p.platform} className="card-void">
                <p style={{ fontSize:'14px', fontWeight:600, color:'var(--fcs-output)', marginBottom:'10px' }}>{p.platform}</p>
                <div style={{ marginBottom:'8px' }}>
                  <p style={{ fontSize:'11px', fontWeight:600, color:'var(--fcs-signal)', marginBottom:'5px' }}>Compliant routes</p>
                  {p.compliant_routes.map((r,i)=>(
                    <p key={i} style={{ fontSize:'12px', color:'var(--fcs-output-dim)', marginBottom:'3px' }}>· {r}</p>
                  ))}
                </div>
                {p.cautions.length>0 && (
                  <div>
                    <p style={{ fontSize:'11px', fontWeight:600, color:'var(--fcs-signal-dark)', marginBottom:'5px' }}>Cautions</p>
                    {p.cautions.map((r,i)=>(
                      <p key={i} style={{ fontSize:'12px', color:'var(--fcs-output-dim)', marginBottom:'3px' }}>· {r}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Doc checklist ── */}
        <section aria-labelledby="docs-heading">
          <p id="docs-heading" className="section-label" style={{ marginBottom:'14px' }}>Documentation reference</p>
          <div className="card-depth">
            <div style={{ display:'flex', flexDirection:'column', gap:'0' }}>
              {DOCUMENTATION_CHECKLIST.map((d,i) => (
                <div key={d.id} style={{ display:'grid', gridTemplateColumns:'1fr auto auto', gap:'12px', alignItems:'center', padding:'10px 0', borderBottom:i<DOCUMENTATION_CHECKLIST.length-1?'1px solid var(--fcs-output-ghost)':'none' }}>
                  <div>
                    <p style={{ fontSize:'13px', fontWeight:500, color:'var(--fcs-output)' }}>{d.name}</p>
                    <p style={{ fontSize:'11px', color:'var(--fcs-output-dim)' }}>{d.issuer}</p>
                  </div>
                  <span className="badge badge-muted">{d.est_cost}</span>
                  <span style={{ fontSize:'11px', color:'var(--fcs-output-dim)', whiteSpace:'nowrap' }}>{d.est_time}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div style={{ marginTop:'32px', textAlign:'center' }}>
          <Link href="/auth/sign-up" className="btn-primary" style={{ textDecoration:'none', display:'inline-flex' }}>
            Start free compliance assessment
          </Link>
        </div>
      </main>
    </div>
  )
}

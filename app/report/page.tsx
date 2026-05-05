import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import Link from 'next/link'
import { Shield, ArrowRight } from 'lucide-react'
import { scoreRegions, generateADBankScript } from '@/lib/ai-prompts'
import { DOCUMENTATION_CHECKLIST } from '@/lib/compliance'

export default async function ReportPage() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in?redirect=/report')

  const { data: session } = await supabase
    .from('assessment_sessions').select('*').eq('user_id', user.id)
    .order('created_at', { ascending: false }).limit(1).single()

  const aiData        = (session?.ai_interview_data as Record<string,unknown>) ?? {}
  const alibabaWanted = ((aiData.selected_platforms as string[]) ?? []).includes('alibaba')
  const top3          = scoreRegions(aiData.product_category as string ?? 'General', aiData.avg_order_value as string ?? 'Under $500').slice(0, 3)
  const adScript      = generateADBankScript(aiData.product_category as string ?? 'General', alibabaWanted)
  const scoreColor    = (s: number) => s>=80?'var(--fcs-signal-light)':s>=65?'var(--fcs-signal)':'var(--fcs-signal-dark)'

  return (
    <div style={{ background:'var(--fcs-void)', minHeight:'100vh', fontFamily:'Inter,system-ui,sans-serif' }}>
      <header className="no-print" style={{ borderBottom:'1px solid var(--fcs-output-ghost)', padding:'14px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(10,10,10,0.95)', position:'sticky', top:0, zIndex:40, backdropFilter:'blur(8px)' }}>
        <a href="/" style={{ fontSize:'17px', fontWeight:700, color:'var(--fcs-output)', textDecoration:'none' }}>Tradeshifter</a>
        <div style={{ display:'flex', gap:'10px' }}>
          <Link href="/dashboard" style={{ textDecoration:'none' }}><button className="btn-ghost">Dashboard</button></Link>
        </div>
      </header>

      <main style={{ maxWidth:'900px', margin:'0 auto', padding:'40px 24px 80px' }}>
        <div style={{ marginBottom:'28px' }}>
          <div style={{ display:'flex', gap:'8px', marginBottom:'8px' }}>
            <span className="badge badge-signal">Report ready</span>
            <span style={{ fontSize:'12px', color:'var(--fcs-output-dim)' }}>{aiData.product_category as string || 'General'} assessment</span>
          </div>
          <h1 style={{ fontSize:'26px', fontWeight:700, color:'var(--fcs-output)' }}>Your export opportunity report</h1>
        </div>

        {/* Top 3 markets */}
        <section style={{ marginBottom:'20px' }}>
          <div className="card-depth">
            <p className="section-label" style={{ marginBottom:'14px' }}>Top 3 market opportunities</p>
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              {top3.map((m, i) => (
                <div key={m.region} style={{ display:'flex', alignItems:'center', gap:'14px', padding:'14px', background:i===0?'var(--fcs-signal-glow)':'#111', border:`1px solid ${i===0?'rgba(200,168,75,0.25)':'var(--fcs-output-ghost)'}`, borderRadius:'8px' }}>
                  <div style={{ fontSize:'18px', width:'28px', textAlign:'center', fontWeight:700, color:i===0?'var(--fcs-signal-light)':'var(--fcs-output-dim)' }}>{i+1}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
                      <p style={{ fontSize:'14px', fontWeight:600, color:'var(--fcs-output)' }}>{m.name}</p>
                      {i===0 && <span className="badge badge-signal" style={{ fontSize:'10px' }}>Best match</span>}
                    </div>
                    <p style={{ fontSize:'12px', color:'var(--fcs-output-dim)', marginBottom:'8px' }}>{m.platforms.join(', ')}</p>
                    <div style={{ width:'140px', height:'4px', background:'rgba(245,243,238,0.1)', borderRadius:'2px', overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${m.score}%`, background:scoreColor(m.score), borderRadius:'2px' }}/>
                    </div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:'22px', fontWeight:700, color:scoreColor(m.score) }}>{m.score}</div>
                    <div style={{ fontSize:'10px', color:'var(--fcs-output-dim)' }}>fit score</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'14px', marginBottom:'20px' }}>
          {/* FE Circulars */}
          <div className="card-depth">
            <p className="section-label" style={{ marginBottom:'14px' }}>Bangladesh Bank compliance</p>
            {[
              { id:'FE-42', text:"Exports under $1,000 don't need an EXP form — you're covered", accent:'var(--fcs-signal-light)' },
              { id:'FE-43', text:'Payoneer is an approved provider for receiving international payments', accent:'var(--fcs-signal)' },
              { id:'FE-48', text:'B2B2C via global platforms — your business model qualifies', accent:'var(--fcs-signal-dark)' },
            ].map(c => (
              <div key={c.id} style={{ paddingLeft:'12px', borderLeft:`3px solid ${c.accent}`, marginBottom:'10px' }}>
                <span className="badge badge-depth" style={{ fontSize:'10px', marginBottom:'5px', display:'inline-flex' }}>{c.id}</span>
                <p style={{ fontSize:'12px', color:'var(--fcs-output-dim)', lineHeight:1.55 }}>{c.text}</p>
              </div>
            ))}
          </div>

          {/* Cost snapshot */}
          <div className="card-depth">
            <p className="section-label" style={{ marginBottom:'4px' }}>Cost snapshot</p>
            <p style={{ fontSize:'11px', color:'var(--fcs-output-dim)', marginBottom:'14px' }}>Illustrative — $1,000 order via Payoneer to Etsy buyer</p>
            {[
              { label:'Buyer pays',           value:'$1,000', bdt:'৳১,১০,০০০', muted:false },
              { label:'Platform fee (~6.5%)', value:'– $65',  muted:true },
              { label:'Payoneer fee (~1%)',    value:'– $10',  muted:true },
              { label:'FX conversion (est.)', value:'– $5',   muted:true },
            ].map(r => (
              <div key={r.label} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid var(--fcs-output-ghost)', fontSize:'12px' }}>
                <span style={{ color:'var(--fcs-output-dim)' }}>{r.label}</span>
                <span style={{ color:r.muted?'var(--fcs-output-dim)':'var(--fcs-output)', fontWeight:r.muted?400:500 }}>
                  {r.value}{r.bdt && <span style={{ color:'var(--fcs-output-dim)', fontWeight:400 }}> {r.bdt}</span>}
                </span>
              </div>
            ))}
            <div style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', fontSize:'13px', fontWeight:600 }}>
              <span style={{ color:'var(--fcs-signal-light)' }}>You receive</span>
              <span style={{ color:'var(--fcs-signal-light)' }}>~$920 ৳১,০১,২০০</span>
            </div>
            <p style={{ fontSize:'10px', color:'var(--fcs-output-faint)', marginTop:'4px' }}>Fees scale with order size. Rates illustrative only.</p>
          </div>
        </div>

        {/* AD Bank Script */}
        <section style={{ marginBottom:'20px' }}>
          <div className="card-depth">
            <p className="section-label" style={{ marginBottom:'12px' }}>What to tell your AD bank</p>
            <blockquote style={{ background:'#111', borderRadius:'8px', padding:'14px 16px', fontSize:'13px', lineHeight:1.75, color:'var(--fcs-output-dim)', fontStyle:'italic', border:'1px solid var(--fcs-output-ghost)', margin:0 }}>
              &ldquo;{adScript}&rdquo;
            </blockquote>
            <p style={{ fontSize:'11px', color:'var(--fcs-output-dim)', marginTop:'10px' }}>Recommended AD banks: City Bank, EBL, BRAC Bank</p>
          </div>
        </section>

        {/* GGS CTA — conditional */}
        {alibabaWanted && (
          <section style={{ marginBottom:'20px' }}>
            <div style={{ background:'rgba(200,168,75,0.08)', border:'1px solid rgba(200,168,75,0.3)', borderRadius:'12px', padding:'24px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'14px' }}>
              <div>
                <p style={{ fontSize:'16px', fontWeight:600, color:'var(--fcs-output)', marginBottom:'4px' }}>Ready to become an Alibaba Gold Supplier?</p>
                <p style={{ fontSize:'13px', color:'var(--fcs-output-dim)' }}>Free 30-min consultation · Trade Assurance walkthrough · No commitment</p>
              </div>
              <button className="btn-primary">Book free GGS consultation <ArrowRight size={15}/></button>
            </div>
          </section>
        )}

        <div style={{ display:'flex', alignItems:'flex-start', gap:'8px' }}>
          <Shield size={13} color="var(--fcs-signal)" style={{ flexShrink:0, marginTop:'2px' }}/>
          <p style={{ fontSize:'11px', color:'var(--fcs-output-faint)', lineHeight:1.65 }}>
            All recommendations reference Bangladesh Bank FE Circular Nos. 42, 43, and 48. Educational guidance only — not legal, tax, or financial advice.{' '}
            <Link href="/compliance" style={{ color:'var(--fcs-signal)' }}>Full disclaimer</Link>
          </p>
        </div>
      </main>
    </div>
  )
}

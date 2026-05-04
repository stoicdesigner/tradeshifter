import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import Link from 'next/link'
import { ArrowRight, Shield, FileText, CheckCircle, Brain, Globe } from 'lucide-react'

function readinessScore(session: Record<string,unknown>|null): number {
  if (!session) return 0
  let score = 0
  const regions = (session.selected_regions as string[]|null) ?? []
  const kycP    = (session.kyc_payoneer as Record<string,boolean>|null) ?? {}
  const kycA    = (session.kyc_alibaba as Record<string,boolean>|null) ?? {}
  const aiData  = (session.ai_interview_data as Record<string,unknown>|null) ?? {}
  const report  = session.report_generated as boolean|null
  if (regions.length>0)                                            score += 20
  const kycItems = Object.values({...kycP,...kycA}).filter(Boolean).length
  if (kycItems>0) score += Math.min(30, Math.round((kycItems/7)*30))
  if (aiData.product_category)                                     score += 30
  if (report)                                                      score += 20
  return score
}

export default async function DashboardPage() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies:{ getAll:()=>cookieStore.getAll(), setAll:()=>{} } }
  )
  const { data:{ user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in?redirect=/dashboard')

  const { data:profile  } = await supabase.from('user_profiles').select('*').eq('id',user.id).single()
  const { data:session  } = await supabase.from('assessment_sessions').select('*').eq('user_id',user.id).order('created_at',{ascending:false}).limit(1).single()
  const score = readinessScore(session as Record<string,unknown>|null)

  const STEPS = [
    { label:'Select target markets',  done:((session?.selected_regions as string[]|null)??[]).length>0,  href:'/onboarding',    icon:Globe },
    { label:'Complete KYC checklist', done:Object.keys((session?.kyc_payoneer as object|null)??{}).length>0, href:'/onboarding', icon:CheckCircle },
    { label:'AI interview',           done:!!(session?.ai_interview_data as Record<string,unknown>|null)?.product_category, href:'/ai-interview', icon:Brain },
    { label:'View export report',     done:!!(session?.report_generated),  href:'/report',      icon:FileText },
  ]
  const scoreColor = score>=75?'var(--fcs-signal-light)':score>=50?'var(--fcs-signal)':score>=25?'var(--fcs-signal-dark)':'rgba(245,243,238,0.4)'

  return (
    <div style={{ background:'var(--fcs-void)', minHeight:'100vh', fontFamily:'Inter,system-ui,sans-serif' }}>
      <header style={{ borderBottom:'1px solid var(--fcs-output-ghost)', background:'rgba(10,10,10,0.95)', backdropFilter:'blur(8px)', position:'sticky', top:0, zIndex:40, padding:'0 24px' }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto', height:'60px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <a href="/" style={{ fontSize:'17px', fontWeight:700, color:'var(--fcs-output)', textDecoration:'none' }}>Tradeshifter</a>
          <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
            <Link href="/compliance" style={{ textDecoration:'none' }}><button className="btn-ghost" style={{ fontSize:'12px' }}>Compliance</button></Link>
            <form action="/auth/sign-out" method="POST"><button type="submit" className="btn-ghost" style={{ fontSize:'12px' }}>Sign out</button></form>
          </div>
        </div>
      </header>

      <main style={{ maxWidth:'1100px', margin:'0 auto', padding:'36px 24px 80px' }}>
        <div style={{ marginBottom:'28px' }}>
          <h1 style={{ fontSize:'24px', fontWeight:700, color:'var(--fcs-output)', marginBottom:'4px' }}>Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}</h1>
          <p style={{ fontSize:'14px', color:'var(--fcs-output-dim)' }}>Your export readiness dashboard</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'16px', marginBottom:'24px' }}>
          {/* Readiness score */}
          <div className="card-depth" style={{ display:'flex', gap:'20px', alignItems:'center' }}>
            <div style={{ position:'relative', width:'80px', height:'80px', flexShrink:0 }}>
              <svg width="80" height="80" viewBox="0 0 80 80" aria-label={`Export readiness score: ${score} out of 100`}>
                <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(245,243,238,0.1)" strokeWidth="8" />
                <circle cx="40" cy="40" r="32" fill="none" stroke={scoreColor} strokeWidth="8"
                  strokeDasharray={`${(score/100)*201} 201`} strokeDashoffset="50" strokeLinecap="round"
                  style={{ transition:'stroke-dasharray 1s ease-out', transformOrigin:'center', transform:'rotate(-90deg) scaleX(-1)' }} />
              </svg>
              <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontSize:'20px', fontWeight:700, color:scoreColor, lineHeight:1 }}>{score}</span>
              </div>
            </div>
            <div>
              <p style={{ fontSize:'11px', fontWeight:600, color:'var(--fcs-output-dim)', marginBottom:'4px' }}>EXPORT READINESS</p>
              <p style={{ fontSize:'16px', fontWeight:600, color:'var(--fcs-output)', marginBottom:'4px' }}>
                {score>=75?'Export ready':score>=50?'On track':score>=25?'Getting started':'Just beginning'}
              </p>
              <p style={{ fontSize:'12px', color:'var(--fcs-output-dim)' }}>{score}% of assessment complete</p>
            </div>
          </div>

          {/* Quick action */}
          <div className="card-signal" style={{ display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
            <div>
              <p style={{ fontSize:'12px', fontWeight:600, color:'var(--fcs-signal)', marginBottom:'4px' }}>Next step</p>
              <p style={{ fontSize:'14px', fontWeight:500, color:'var(--fcs-output)', marginBottom:'6px' }}>
                {STEPS.find(s=>!s.done)?.label ?? 'View your full report'}
              </p>
              <p style={{ fontSize:'12px', color:'var(--fcs-output-dim)' }}>Continue your export assessment</p>
            </div>
            <Link href={STEPS.find(s=>!s.done)?.href ?? '/report'} className="btn-primary" style={{ textDecoration:'none', marginTop:'14px', fontSize:'13px', display:'inline-flex' }}>
              Continue <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Progress steps */}
        <div className="card-depth" style={{ marginBottom:'16px' }}>
          <p className="section-label" style={{ marginBottom:'16px' }}>Your assessment progress</p>
          <div style={{ display:'flex', flexDirection:'column', gap:'0' }}>
            {STEPS.map((s, i) => (
              <div key={s.label} style={{ display:'flex', alignItems:'center', gap:'14px', padding:'13px 0', borderBottom:i<STEPS.length-1?'1px solid var(--fcs-output-ghost)':'none' }}>
                <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:s.done?'var(--fcs-signal)':'rgba(245,243,238,0.08)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, border:s.done?'none':'1px solid var(--fcs-output-ghost)' }} aria-hidden="true">
                  {s.done ? <svg width="14" height="11" viewBox="0 0 14 11" fill="none"><path d="M1 5l4 4 8-8" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round"/></svg>
                   : <s.icon size={15} color="var(--fcs-output-dim)" />}
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:'13px', fontWeight:500, color:s.done?'var(--fcs-output-dim)':'var(--fcs-output)' }}>{s.label}</p>
                </div>
                {!s.done && (
                  <Link href={s.href} style={{ textDecoration:'none' }}>
                    <button className="btn-ghost" style={{ fontSize:'12px', padding:'6px 12px' }}>Start</button>
                  </Link>
                )}
                {s.done && <span className="badge badge-signal" style={{ fontSize:'10px' }}>Done</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Compliance quick ref */}
        <div className="card-void">
          <div style={{ display:'flex', gap:'8px', alignItems:'flex-start' }}>
            <Shield size={14} color="var(--fcs-signal)" style={{ flexShrink:0, marginTop:'2px' }} aria-hidden="true" />
            <div>
              <p style={{ fontSize:'13px', fontWeight:500, color:'var(--fcs-output)', marginBottom:'4px' }}>Bangladesh Bank compliance reference</p>
              <p style={{ fontSize:'12px', color:'var(--fcs-output-dim)', lineHeight:1.65 }}>FE Circular 42 · FE Circular 43 · FE Circular 48</p>
              <Link href="/compliance" style={{ fontSize:'12px', color:'var(--fcs-signal)', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'4px', marginTop:'6px' }}>
                View compliance resources <ArrowRight size={12} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Globe, CheckCircle, Brain, FileText, ChevronLeft, ChevronRight, Shield, ArrowRight } from 'lucide-react'
import type { Region } from '@/types'

const STEP_CONFIG = [
  { id: 1, label: 'Markets',      icon: Globe },
  { id: 2, label: 'Business',     icon: FileText },
  { id: 3, label: 'Platforms',    icon: CheckCircle },
  { id: 4, label: 'KYC',          icon: Brain },
]

const REGIONS: { id: Region; label: string; platforms: string }[] = [
  { id:'usa_canada',    label:'USA & Canada',         platforms:'Amazon, Etsy, eBay' },
  { id:'eu',            label:'European Union',        platforms:'Zalando, Amazon EU' },
  { id:'southeast_asia',label:'Southeast Asia',        platforms:'Shopee, Lazada' },
  { id:'east_asia',     label:'East Asia',             platforms:'Alibaba, JD Global' },
  { id:'japan',         label:'Japan',                 platforms:'Rakuten, Amazon JP' },
  { id:'aus_nz',        label:'Australia & NZ',        platforms:'Amazon AU, Trade Me' },
  { id:'south_america', label:'South America',         platforms:'MercadoLibre' },
  { id:'mea',           label:'Middle East & Africa',  platforms:'Noon, Jumia' },
]

const PAYONEER_ITEMS = [
  { id:'p1', label:'Sign up at payoneer.com',                   url:'https://www.payoneer.com/signup/', required:true },
  { id:'p2', label:'Submit trade licence and NID',              url:null, required:true },
  { id:'p3', label:'Link to your Bangladesh bank account',      url:null, required:true },
  { id:'p4', label:'Complete identity verification',            url:null, required:true },
]
const ALIBABA_ITEMS = [
  { id:'a1', label:'Apply at alibaba.com/seller',               url:'https://seller.alibaba.com/', required:true },
  { id:'a2', label:'Upload business licence and ERC',           url:null, required:true },
  { id:'a3', label:'Add 10+ product listings',                  url:null, required:false },
]

const AOV_OPTIONS  = ['Under $500','$500 – $1,000','$1,000 – $5,000','Above $5,000']
const EXP_OPTIONS  = ['Yes','No','Not sure']
const GOAL_OPTIONS = ['Reach new international markets','Increase export volume','Get Bangladesh Bank compliant']
const PLATFORMS    = [
  { id:'alibaba', label:'Alibaba.com',           sub:'B2B wholesale — best for bulk international buyers' },
  { id:'amazon',  label:'Amazon (B2C retail)',   sub:'Direct to consumer — USA, EU, Japan' },
  { id:'etsy',    label:'Etsy',                  sub:'Handicrafts & artisan products — strong USA buyer base' },
  { id:'payoneer',label:'Payoneer Marketplace',  sub:'Receive USD directly to your Bangladesh bank account' },
]

type KycState = Record<string, boolean>

function CheckItem({ id, label, url, checked, onChange }: { id:string; label:string; url:string|null; checked:boolean; onChange:(id:string)=>void }) {
  return (
    <div
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={() => onChange(id)}
      onKeyDown={e => (e.key===' '||e.key==='Enter') && onChange(id)}
      style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 0', cursor:'pointer', borderBottom:'1px solid var(--fcs-output-ghost)' }}
    >
      <div
        aria-hidden="true"
        style={{ width:'18px', height:'18px', borderRadius:'4px', border:`1.5px solid ${checked?'var(--fcs-signal)':'var(--fcs-signal-dark)'}`, background:checked?'var(--fcs-signal)':'transparent', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', transition:'all 150ms' }}
      >
        {checked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </div>
      <div>
        <p style={{ fontSize:'13px', color:'var(--fcs-output)' }}>{label}</p>
        {url && <a href={url} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{ fontSize:'11px', color:'var(--fcs-signal)', textDecoration:'none' }}>Open official site <ArrowRight size={10} style={{display:'inline'}} aria-hidden="true"/></a>}
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep]             = useState(1)
  const [regions, setRegions]       = useState<Region[]>([])
  const [category, setCategory]     = useState('')
  const [aov, setAov]               = useState('')
  const [exp, setExp]               = useState('')
  const [goal, setGoal]             = useState('')
  const [platforms, setPlatforms]   = useState<string[]>([])
  const [kycP, setKycP]             = useState<KycState>({})
  const [kycA, setKycA]             = useState<KycState>({})
  const [saving, setSaving]         = useState(false)
  const [error, setError]           = useState<string|null>(null)

  const alibabaSelected = platforms.includes('alibaba')

  const toggleRegion = (r: Region) => setRegions(prev => prev.includes(r) ? prev.filter(x=>x!==r) : [...prev,r])
  const togglePlatform = (p: string) => setPlatforms(prev => prev.includes(p) ? prev.filter(x=>x!==p) : [...prev,p])

  const saveAndAdvance = useCallback(async () => {
    if (step < 4) { setStep(s=>s+1); return }
    setSaving(true); setError(null)
    try {
      const { data:{ user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/sign-in'); return }
      const { data:existing } = await supabase.from('assessment_sessions').select('id').eq('user_id',user.id).order('created_at',{ascending:false}).limit(1).single()
      const payload = { user_id:user.id, selected_regions:regions, kyc_payoneer:kycP, kyc_alibaba:kycA, ai_interview_data:{ product_category:category, avg_order_value:aov, exp_form_status:exp, growth_goals:goal, selected_platforms:platforms }, status:'interview', updated_at:new Date().toISOString() }
      if (existing?.id) await supabase.from('assessment_sessions').update(payload).eq('id',existing.id)
      else              await supabase.from('assessment_sessions').insert(payload)
      router.push('/ai-interview')
    } catch { setError('Could not save progress. Please try again.') }
    finally   { setSaving(false) }
  }, [step, regions, category, aov, exp, goal, platforms, kycP, kycA, supabase, router])

  const pct = (step/4)*100
  const canContinue = step===1 ? regions.length>0 : true

  return (
    <div style={{ background:'var(--fcs-void)', minHeight:'100vh', fontFamily:'Inter,system-ui,sans-serif' }}>
      {/* Header */}
      <header style={{ borderBottom:'1px solid var(--fcs-output-ghost)', padding:'14px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(10,10,10,0.95)', position:'sticky', top:0, zIndex:40, backdropFilter:'blur(8px)' }}>
        <a href="/" style={{ fontSize:'17px', fontWeight:700, color:'var(--fcs-output)', textDecoration:'none', letterSpacing:'-0.02em' }}>Tradeshifter</a>
        <div style={{ display:'flex', gap:'6px' }} role="list" aria-label="Wizard steps">
          {STEP_CONFIG.map((s,i) => (
            <div key={s.id} role="listitem" style={{ display:'flex', alignItems:'center', gap:'4px' }}>
              <div
                aria-current={step===s.id?'step':undefined}
                aria-label={`Step ${s.id}: ${s.label}${step>s.id?' (complete)':step===s.id?' (current)':''}`}
                style={{ width:'28px', height:'28px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:700, background:step===s.id?'var(--fcs-signal)':step>s.id?'rgba(200,168,75,0.25)':'rgba(245,243,238,0.08)', color:step===s.id?'var(--fcs-void)':step>s.id?'var(--fcs-signal)':'var(--fcs-output-dim)', transition:'all 200ms' }}
              >{step>s.id?'✓':s.id}</div>
              {i<STEP_CONFIG.length-1 && <div style={{ width:'16px', height:'1px', background:step>s.id?'var(--fcs-signal-dark)':'var(--fcs-output-ghost)' }} aria-hidden="true" />}
            </div>
          ))}
        </div>
      </header>

      <main style={{ maxWidth:'680px', margin:'0 auto', padding:'40px 24px 80px' }}>
        {error && <div role="alert" style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'8px', padding:'12px 16px', marginBottom:'20px', fontSize:'13px', color:'#f87171' }}>{error}</div>}

        {/* Progress */}
        <div style={{ marginBottom:'8px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span className="section-label">Step {step} of 4</span>
          <span style={{ fontSize:'12px', color:'var(--fcs-output-dim)' }}>{Math.round(100-pct)}% remaining</span>
        </div>
        <div className="progress-track" style={{ marginBottom:'24px' }}>
          <div className={`progress-fill${step===4?' progress-fill-complete':''}`} style={{ width:`${pct}%` }} />
        </div>

        {/* ── STEP 1 ── */}
        {step===1 && (
          <section aria-labelledby="s1-heading">
            <h1 id="s1-heading" style={{ fontSize:'22px', fontWeight:700, color:'var(--fcs-output)', marginBottom:'8px' }}>Where do you want to sell?</h1>
            <p style={{ fontSize:'13px', color:'var(--fcs-output-dim)', marginBottom:'24px', lineHeight:1.6 }}>Select all regions where you want to receive payments from buyers</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'10px', marginBottom:'28px' }} role="group" aria-label="Target market regions">
              {REGIONS.map(r => (
                <div key={r.id} role="checkbox" aria-checked={regions.includes(r.id)} tabIndex={0}
                  onClick={() => toggleRegion(r.id)}
                  onKeyDown={e=>(e.key===' '||e.key==='Enter')&&toggleRegion(r.id)}
                  className="select-card" aria-selected={regions.includes(r.id)?'true':'false'}
                  style={{ background:regions.includes(r.id)?'var(--fcs-signal-glow)':'#111', border:regions.includes(r.id)?'1.5px solid var(--fcs-signal)':'1px solid var(--fcs-output-ghost)' }}
                >
                  <p style={{ fontSize:'13px', fontWeight:regions.includes(r.id)?600:500, color:regions.includes(r.id)?'var(--fcs-signal-light)':'var(--fcs-output)', marginBottom:'3px' }}>{r.label}</p>
                  <p style={{ fontSize:'11px', color:'var(--fcs-output-dim)' }}>{r.platforms}</p>
                </div>
              ))}
            </div>
            {regions.length>0 && <p style={{ fontSize:'12px', color:'var(--fcs-signal)', marginBottom:'16px' }}>✓ {regions.length} market{regions.length>1?'s':''} selected</p>}
          </section>
        )}

        {/* ── STEP 2 ── */}
        {step===2 && (
          <section aria-labelledby="s2-heading">
            <h1 id="s2-heading" style={{ fontSize:'22px', fontWeight:700, color:'var(--fcs-output)', marginBottom:'24px' }}>Tell us about your business</h1>
            <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
              <div>
                <label htmlFor="category" style={{ fontSize:'12px', fontWeight:600, color:'var(--fcs-output-dim)', display:'block', marginBottom:'7px' }}>What do you export?</label>
                <select id="category" value={category} onChange={e=>setCategory(e.target.value)} className="input-fcs" aria-required="true">
                  <option value="">Select category…</option>
                  {['RMG / Garments','Handicrafts','IT Services','Agri-products','Other'].map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <p style={{ fontSize:'12px', fontWeight:600, color:'var(--fcs-output-dim)', marginBottom:'8px' }}>Typical order value from one buyer</p>
                <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }} role="radiogroup" aria-label="Average order value">
                  {AOV_OPTIONS.map(o=>(
                    <button key={o} role="radio" aria-checked={aov===o} onClick={()=>setAov(o)}
                      style={{ padding:'8px 14px', borderRadius:'20px', fontSize:'12px', fontWeight:aov===o?600:400, cursor:'pointer', border:aov===o?'1.5px solid var(--fcs-signal)':'1px solid rgba(245,243,238,0.2)', background:aov===o?'var(--fcs-signal-glow)':'transparent', color:aov===o?'var(--fcs-signal-light)':'var(--fcs-output-dim)', minHeight:'44px', transition:'all 150ms' }}
                    >{o}</button>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontSize:'12px', fontWeight:600, color:'var(--fcs-output-dim)', marginBottom:'8px' }}>Do you currently file EXP forms?</p>
                <div style={{ display:'flex', gap:'8px' }} role="radiogroup" aria-label="EXP form status">
                  {EXP_OPTIONS.map(o=>(
                    <button key={o} role="radio" aria-checked={exp===o} onClick={()=>setExp(o)}
                      style={{ padding:'8px 16px', borderRadius:'8px', fontSize:'13px', fontWeight:exp===o?600:400, cursor:'pointer', border:exp===o?'1.5px solid var(--fcs-signal)':'1px solid rgba(245,243,238,0.2)', background:exp===o?'var(--fcs-signal-glow)':'transparent', color:exp===o?'var(--fcs-signal-light)':'var(--fcs-output-dim)', minHeight:'44px', transition:'all 150ms' }}
                    >{o}</button>
                  ))}
                </div>
                <p style={{ fontSize:'11px', color:'var(--fcs-signal)', marginTop:'6px' }}>For orders under $1,000 you may not need one — we'll explain in your report</p>
              </div>
              <div>
                <label htmlFor="goal" style={{ fontSize:'12px', fontWeight:600, color:'var(--fcs-output-dim)', display:'block', marginBottom:'7px' }}>Your main goal</label>
                <select id="goal" value={goal} onChange={e=>setGoal(e.target.value)} className="input-fcs">
                  <option value="">Select goal…</option>
                  {GOAL_OPTIONS.map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
          </section>
        )}

        {/* ── STEP 3 ── */}
        {step===3 && (
          <section aria-labelledby="s3-heading">
            <h1 id="s3-heading" style={{ fontSize:'22px', fontWeight:700, color:'var(--fcs-output)', marginBottom:'8px' }}>Which platforms interest you?</h1>
            <p style={{ fontSize:'13px', color:'var(--fcs-output-dim)', marginBottom:'22px', lineHeight:1.6 }}>Select all that apply. We'll tell you which ones fit best.</p>
            <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginBottom:'20px' }} role="group" aria-label="Platform selection">
              {PLATFORMS.map(p => {
                const sel = platforms.includes(p.id)
                const isAli = p.id==='alibaba'
                return (
                  <div key={p.id}>
                    <div role="checkbox" aria-checked={sel} tabIndex={0}
                      onClick={()=>togglePlatform(p.id)}
                      onKeyDown={e=>(e.key===' '||e.key==='Enter')&&togglePlatform(p.id)}
                      style={{ background:sel?'var(--fcs-signal-glow)':'#111', border:sel?'1.5px solid var(--fcs-signal)':'1px solid var(--fcs-output-ghost)', borderRadius:'10px', padding:'14px 16px', cursor:'pointer', transition:'all 150ms' }}
                    >
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                        <div>
                          <p style={{ fontSize:'14px', fontWeight:sel?600:500, color:sel?'var(--fcs-signal-light)':'var(--fcs-output)', marginBottom:'3px' }}>{p.label}</p>
                          <p style={{ fontSize:'12px', color:'var(--fcs-output-dim)' }}>{p.sub}</p>
                        </div>
                        {isAli && sel && <span className="badge badge-signal" style={{ fontSize:'10px', flexShrink:0 }}>Selected</span>}
                      </div>
                    </div>
                    {/* ── GGS CTA — conditional on Alibaba selected ── */}
                    {isAli && sel && (
                      <div role="complementary" aria-label="Gold Supplier consultation" style={{ marginTop:'-2px', background:'rgba(200,168,75,0.06)', border:'1px solid rgba(200,168,75,0.2)', borderTop:'none', borderRadius:'0 0 10px 10px', padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'10px' }} className="animate-slide-up">
                        <div>
                          <p style={{ fontSize:'12px', fontWeight:600, color:'var(--fcs-signal-light)', marginBottom:'2px' }}>Trade Assurance requires Gold Supplier membership</p>
                          <p style={{ fontSize:'11px', color:'var(--fcs-output-dim)' }}>Book a free consultation to learn how to qualify</p>
                        </div>
                        <button className="btn-primary" style={{ fontSize:'11px', padding:'7px 14px' }}>Book free GGS call</button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ── STEP 4 ── */}
        {step===4 && (
          <section aria-labelledby="s4-heading">
            <h1 id="s4-heading" style={{ fontSize:'22px', fontWeight:700, color:'var(--fcs-output)', marginBottom:'8px' }}>Your KYC setup checklist</h1>
            <p style={{ fontSize:'13px', color:'var(--fcs-output-dim)', marginBottom:'24px', lineHeight:1.6 }}>Tick each item as you complete it. You can return anytime.</p>

            <div className="card-depth" style={{ marginBottom:'16px' }}>
              <p style={{ fontSize:'12px', fontWeight:600, color:'var(--fcs-signal)', marginBottom:'4px' }}>Payoneer account</p>
              <p style={{ fontSize:'11px', color:'var(--fcs-output-dim)', marginBottom:'12px' }}>Required to receive international payments into your Bangladesh bank account</p>
              {PAYONEER_ITEMS.map(item => (
                <CheckItem key={item.id} id={item.id} label={item.label} url={item.url} checked={!!kycP[item.id]} onChange={id=>setKycP(p=>({...p,[id]:!p[id]}))} />
              ))}
            </div>

            <div className="card-depth" style={{ marginBottom:'20px' }}>
              <p style={{ fontSize:'12px', fontWeight:600, color:'var(--fcs-signal)', marginBottom:'4px' }}>Alibaba.com seller account</p>
              <p style={{ fontSize:'11px', color:'var(--fcs-output-dim)', marginBottom:'12px' }}>Required to list products and receive B2B orders from global buyers</p>
              {ALIBABA_ITEMS.map(item => (
                <CheckItem key={item.id} id={item.id} label={item.label} url={item.url} checked={!!kycA[item.id]} onChange={id=>setKycA(p=>({...p,[id]:!p[id]}))} />
              ))}
            </div>

            <div style={{ background:'rgba(200,168,75,0.08)', border:'1px solid rgba(200,168,75,0.25)', borderRadius:'10px', padding:'16px' }}>
              <div style={{ display:'flex', gap:'8px', marginBottom:'4px' }}>
                <Brain size={16} color="var(--fcs-signal)" aria-hidden="true" />
                <p style={{ fontSize:'13px', fontWeight:600, color:'var(--fcs-signal-light)' }}>Next: chat with ExportGuide AI</p>
              </div>
              <p style={{ fontSize:'12px', color:'var(--fcs-output-dim)', marginBottom:'0' }}>Get personalised recommendations based on your answers. Takes 3–5 minutes.</p>
            </div>

            {/* Compliance note */}
            <div style={{ display:'flex', alignItems:'flex-start', gap:'8px', marginTop:'16px' }}>
              <Shield size={13} color="var(--fcs-signal)" style={{ flexShrink:0, marginTop:'2px' }} aria-hidden="true" />
              <p style={{ fontSize:'11px', color:'var(--fcs-output-faint)', lineHeight:1.65 }}>All guidance references Bangladesh Bank FE Circular Nos. 42, 43, and 48. This platform does not provide legal or financial advice.</p>
            </div>
          </section>
        )}

        {/* Navigation */}
        <div style={{ marginTop:'32px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <button
            onClick={()=>setStep(s=>Math.max(1,s-1))}
            disabled={step===1}
            className="btn-ghost"
            aria-label="Go to previous step"
          >
            <ChevronLeft size={16} aria-hidden="true" /> Back
          </button>
          <button
            onClick={saveAndAdvance}
            disabled={saving||!canContinue}
            className="btn-primary"
            aria-label={step===4?'Complete checklist and start AI interview':'Go to next step'}
          >
            {saving ? 'Saving…' : step===4 ? 'Launch AI interview' : 'Continue'}
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </div>
      </main>
    </div>
  )
}

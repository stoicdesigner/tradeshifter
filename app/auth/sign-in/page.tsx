'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignInSchema } from '@/lib/validators'
import type { z } from 'zod'
import { ArrowRight, Eye, EyeOff, Loader2, Mail } from 'lucide-react'

type F = z.infer<typeof SignInSchema>

export default function SignInPage() {
  const router = useRouter()
  const params = useSearchParams()
  const redirect = params.get('redirect') ?? '/dashboard'
  const supabase = createClient()
  const [showPw, setShowPw] = useState(false)
  const [serverError, setServerError] = useState<string|null>(null)
  const [magicSent, setMagicSent] = useState(false)
  const [magicLoading, setMagicLoading] = useState(false)
  const { register, handleSubmit, getValues, formState:{errors,isSubmitting} } = useForm<F>({ resolver:zodResolver(SignInSchema) })

  const onSubmit = async (data: F) => {
    setServerError(null)
    const { error } = await supabase.auth.signInWithPassword({ email:data.email, password:data.password })
    if (error) { setServerError(error.message); return }
    router.push(redirect); router.refresh()
  }

  const sendMagic = async () => {
    const email = getValues('email')
    if (!email) { setServerError('Enter your email address first.'); return }
    setMagicLoading(true); setServerError(null)
    const { error } = await supabase.auth.signInWithOtp({ email, options:{ emailRedirectTo:`${location.origin}/auth/callback` } })
    setMagicLoading(false)
    if (error) { setServerError(error.message); return }
    setMagicSent(true)
  }

  if (magicSent) return (
    <div style={{ background:'var(--fcs-void)', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}>
      <div style={{ maxWidth:'400px', width:'100%', textAlign:'center' }}>
        <div style={{ width:'56px', height:'56px', borderRadius:'50%', background:'var(--fcs-signal-glow)', border:'1px solid rgba(200,168,75,0.3)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}><Mail size={24} color="var(--fcs-signal)" /></div>
        <h2 style={{ fontSize:'22px', fontWeight:700, color:'var(--fcs-output)', marginBottom:'10px' }}>Magic link sent</h2>
        <p style={{ fontSize:'14px', color:'var(--fcs-output-dim)', marginBottom:'20px', lineHeight:1.65 }}>Check your inbox and click the link to sign in. No password needed.</p>
        <button onClick={()=>setMagicSent(false)} style={{ background:'none', border:'none', color:'var(--fcs-signal)', fontSize:'13px', cursor:'pointer' }}>Try again</button>
      </div>
    </div>
  )

  return (
    <div style={{ background:'var(--fcs-void)', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}>
      <div style={{ maxWidth:'420px', width:'100%' }}>
        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <Link href="/" style={{ fontSize:'20px', fontWeight:700, color:'var(--fcs-output)', textDecoration:'none' }}>Tradeshifter</Link>
          <p style={{ fontSize:'13px', color:'var(--fcs-output-dim)', marginTop:'6px' }}>Sign in to your account</p>
        </div>
        <div className="card-depth">
          <h1 style={{ fontSize:'20px', fontWeight:700, color:'var(--fcs-output)', marginBottom:'20px' }}>Welcome back</h1>
          {serverError && <div role="alert" style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'8px', padding:'10px 14px', marginBottom:'16px', fontSize:'13px', color:'#f87171' }}>{serverError}</div>}
          <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            <div>
              <label htmlFor="email" style={{ fontSize:'12px', fontWeight:600, color:'var(--fcs-output-dim)', display:'block', marginBottom:'6px' }}>Email address</label>
              <input id="email" type="email" {...register('email')} placeholder="you@company.com" className="input-fcs" aria-invalid={!!errors.email} />
              {errors.email && <p role="alert" style={{ fontSize:'11px', color:'#f87171', marginTop:'4px' }}>{errors.email.message}</p>}
            </div>
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'6px' }}>
                <label htmlFor="password" style={{ fontSize:'12px', fontWeight:600, color:'var(--fcs-output-dim)' }}>Password</label>
                <button type="button" onClick={sendMagic} disabled={magicLoading} style={{ background:'none', border:'none', fontSize:'11px', color:'var(--fcs-signal)', cursor:'pointer' }}>{magicLoading?'Sending…':'Send magic link instead'}</button>
              </div>
              <div style={{ position:'relative' }}>
                <input id="password" type={showPw?'text':'password'} {...register('password')} placeholder="Your password" className="input-fcs" style={{ paddingRight:'40px' }} />
                <button type="button" onClick={()=>setShowPw(!showPw)} aria-label={showPw?'Hide password':'Show password'} style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--fcs-output-dim)', padding:'4px' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ width:'100%' }}>
              {isSubmitting ? <><Loader2 size={15} className="animate-spin" /> Signing in…</> : <>Sign in <ArrowRight size={15} /></>}
            </button>
          </form>
          <p style={{ textAlign:'center', fontSize:'12px', color:'var(--fcs-output-dim)', marginTop:'20px' }}>
            Don&apos;t have an account?{' '}
            <Link href="/auth/sign-up" style={{ color:'var(--fcs-signal)', textDecoration:'none' }}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

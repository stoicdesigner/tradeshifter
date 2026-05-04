'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignUpSchema } from '@/lib/validators'
import type { z } from 'zod'
import { ArrowRight, Eye, EyeOff, Loader2, Globe } from 'lucide-react'

type F = z.infer<typeof SignUpSchema>

export default function SignUpPage() {
  const supabase = createClient()
  const [showPw, setShowPw] = useState(false)
  const [serverError, setServerError] = useState<string|null>(null)
  const [success, setSuccess] = useState(false)
  const { register, handleSubmit, formState:{errors,isSubmitting} } = useForm<F>({ resolver:zodResolver(SignUpSchema) })

  const onSubmit = async (data: F) => {
    setServerError(null)
    const { error } = await supabase.auth.signUp({ email:data.email, password:data.password, options:{ data:{ full_name:data.full_name }, emailRedirectTo:`${location.origin}/auth/callback` } })
    if (error) { setServerError(error.message); return }
    setSuccess(true)
  }

  if (success) return (
    <div style={{ background:'var(--fcs-void)', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}>
      <div style={{ maxWidth:'400px', width:'100%', textAlign:'center' }}>
        <div style={{ width:'56px', height:'56px', borderRadius:'50%', background:'var(--fcs-signal-glow)', border:'1px solid rgba(200,168,75,0.3)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }} aria-hidden="true">
          <Globe size={24} color="var(--fcs-signal)" />
        </div>
        <h2 style={{ fontSize:'22px', fontWeight:700, color:'var(--fcs-output)', marginBottom:'10px' }}>Check your email</h2>
        <p style={{ fontSize:'14px', color:'var(--fcs-output-dim)', lineHeight:1.65, marginBottom:'20px' }}>We sent a confirmation link. Click it to activate your account and start your assessment.</p>
        <Link href="/auth/sign-in" style={{ color:'var(--fcs-signal)', fontSize:'13px', textDecoration:'none' }}>Back to sign in</Link>
      </div>
    </div>
  )

  return (
    <div style={{ background:'var(--fcs-void)', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}>
      <div style={{ maxWidth:'420px', width:'100%' }}>
        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <Link href="/" style={{ fontSize:'20px', fontWeight:700, color:'var(--fcs-output)', textDecoration:'none', letterSpacing:'-0.02em' }}>Tradeshifter</Link>
          <p style={{ fontSize:'13px', color:'var(--fcs-output-dim)', marginTop:'6px' }}>Start your free export assessment</p>
        </div>
        <div className="card-depth">
          <h1 style={{ fontSize:'20px', fontWeight:700, color:'var(--fcs-output)', marginBottom:'20px' }}>Create your account</h1>
          {serverError && <div role="alert" style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'8px', padding:'10px 14px', marginBottom:'16px', fontSize:'13px', color:'#f87171' }}>{serverError}</div>}
          <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            <div>
              <label htmlFor="full_name" style={{ fontSize:'12px', fontWeight:600, color:'var(--fcs-output-dim)', display:'block', marginBottom:'6px' }}>Full name</label>
              <input id="full_name" {...register('full_name')} placeholder="Md. Rahman" className="input-fcs" aria-describedby={errors.full_name?'fn-err':undefined} aria-invalid={!!errors.full_name} />
              {errors.full_name && <p id="fn-err" role="alert" style={{ fontSize:'11px', color:'#f87171', marginTop:'4px' }}>{errors.full_name.message}</p>}
            </div>
            <div>
              <label htmlFor="email" style={{ fontSize:'12px', fontWeight:600, color:'var(--fcs-output-dim)', display:'block', marginBottom:'6px' }}>Email address</label>
              <input id="email" type="email" {...register('email')} placeholder="you@company.com.bd" className="input-fcs" aria-invalid={!!errors.email} />
              {errors.email && <p role="alert" style={{ fontSize:'11px', color:'#f87171', marginTop:'4px' }}>{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="password" style={{ fontSize:'12px', fontWeight:600, color:'var(--fcs-output-dim)', display:'block', marginBottom:'6px' }}>Password</label>
              <div style={{ position:'relative' }}>
                <input id="password" type={showPw?'text':'password'} {...register('password')} placeholder="Min. 8 characters" className="input-fcs" style={{ paddingRight:'40px' }} aria-invalid={!!errors.password} />
                <button type="button" onClick={()=>setShowPw(!showPw)} aria-label={showPw?'Hide password':'Show password'} style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--fcs-output-dim)', padding:'4px' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p role="alert" style={{ fontSize:'11px', color:'#f87171', marginTop:'4px' }}>{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ width:'100%', marginTop:'4px' }}>
              {isSubmitting ? <><Loader2 size={15} className="animate-spin" /> Creating account…</> : <>Create account <ArrowRight size={15} /></>}
            </button>
          </form>
          <p style={{ textAlign:'center', fontSize:'12px', color:'var(--fcs-output-dim)', marginTop:'20px' }}>
            Already have an account?{' '}
            <Link href="/auth/sign-in" style={{ color:'var(--fcs-signal)', textDecoration:'none' }}>Sign in</Link>
          </p>
        </div>
        <p style={{ textAlign:'center', fontSize:'11px', color:'var(--fcs-output-faint)', marginTop:'16px', lineHeight:1.6 }}>
          By creating an account you acknowledge this platform provides educational guidance only.{' '}
          <Link href="/compliance" style={{ color:'var(--fcs-signal)' }}>Compliance disclaimer</Link>
        </p>
      </div>
    </div>
  )
}

'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Globe } from 'lucide-react'

export function Nav() {
  const [open, setOpen] = useState(false)
  const links = [
    { label: 'How it works', href: '/#how-it-works' },
    { label: 'Compliance',   href: '/compliance' },
  ]
  return (
    <nav role="navigation" aria-label="Main navigation" style={{ background:'rgba(10,10,10,0.95)', borderBottom:'1px solid var(--fcs-output-ghost)', backdropFilter:'blur(8px)', position:'sticky', top:0, zIndex:50 }}>
      <div style={{ maxWidth:'1140px', margin:'0 auto', padding:'0 24px', height:'60px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <Link href="/" aria-label="Tradeshifter home" style={{ display:'flex', alignItems:'center', gap:'8px', textDecoration:'none' }}>
          <div style={{ width:'32px', height:'32px', background:'var(--fcs-signal)', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center' }} aria-hidden="true">
            <Globe size={18} color="#0a0a0a" strokeWidth={1.8} />
          </div>
          <span style={{ fontSize:'17px', fontWeight:700, color:'var(--fcs-output)', letterSpacing:'-0.02em' }}>Tradeshifter</span>
        </Link>
        <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
          {links.map(l => (
            <Link key={l.href} href={l.href} className="nav-link" style={{ padding:'8px 12px', textDecoration:'none', display:'none' }}>
              {l.label}
            </Link>
          ))}
          <style>{`@media(min-width:640px){.nav-desktop{display:flex!important}}`}</style>
          <div className="nav-desktop" style={{ display:'none', gap:'8px', alignItems:'center' }}>
            {links.map(l => (
              <Link key={l.href} href={l.href} className="nav-link" style={{ padding:'8px 12px', textDecoration:'none' }}>{l.label}</Link>
            ))}
            <Link href="/auth/sign-in" className="nav-link" style={{ padding:'8px 12px', textDecoration:'none' }}>Sign in</Link>
            <Link href="/auth/sign-up" className="btn-primary" style={{ fontSize:'13px', padding:'9px 18px', textDecoration:'none' }}>Start free</Link>
          </div>
          <button className="btn-ghost" onClick={()=>setOpen(!open)} aria-expanded={open} aria-label={open?'Close menu':'Open menu'} style={{ padding:'8px', minWidth:'44px', minHeight:'44px' }}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {open && (
        <div style={{ borderTop:'1px solid var(--fcs-output-ghost)', padding:'12px 24px 20px' }}>
          {[...links, {label:'Sign in',href:'/auth/sign-in'}].map(l => (
            <Link key={l.href} href={l.href} className="nav-link" style={{ display:'block', padding:'12px 0', borderBottom:'1px solid var(--fcs-output-ghost)', textDecoration:'none' }} onClick={()=>setOpen(false)}>{l.label}</Link>
          ))}
          <Link href="/auth/sign-up" className="btn-primary" style={{ marginTop:'16px', width:'100%', textDecoration:'none', display:'flex', justifyContent:'center' }} onClick={()=>setOpen(false)}>Start free assessment</Link>
        </div>
      )}
    </nav>
  )
}

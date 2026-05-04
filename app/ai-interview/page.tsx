'use client'
import { useChat } from 'ai/react'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Send, RotateCcw, Shield, ArrowRight, Loader2 } from 'lucide-react'

const QUICK_REPLIES: Record<number, string[]> = {
  0: ['Apparel & Textiles','Handicrafts','Leather Goods','Jute Products','IT Services'],
  1: ['Under $500','$500 – $1,000','$1,000 – $5,000','Above $5,000'],
  2: ['Yes, EXP form obtained','Not yet, learning process','Unsure what EXP form is'],
  3: ['Yes, AD Bank authorised','No AD Bank yet','Currently setting up'],
  4: ['Scale to 3+ markets','First export, testing','Build a sustainable brand'],
}

export default function AIInterviewPage() {
  const router = useRouter()
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [qIdx, setQIdx] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput, reload } = useChat({
    api: '/api/ai-chat',
    initialMessages: [{
      id: 'init', role: 'assistant',
      content: "Hello! I'm ExportGuide, your AI export specialist. I'll ask you 5 focused questions to map your business to the best global market opportunities.\n\n**Question 1 of 5:** What product category best describes what you plan to export?",
    }],
    onFinish: (msg) => {
      if (msg.content.includes('INTERVIEW_COMPLETE')) setIsComplete(true)
      setQIdx(p => Math.min(p + 1, 5))
    },
  })

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages, isLoading])
  useEffect(() => { if (!isLoading) inputRef.current?.focus() }, [isLoading])

  const quickReply = (text: string) => {
    setInput(text)
    setTimeout(() => { const f = document.getElementById('chat-form') as HTMLFormElement; f?.requestSubmit() }, 50)
  }

  const suggestions = QUICK_REPLIES[qIdx] ?? []

  return (
    <div style={{ background:'var(--fcs-void)', minHeight:'100vh', display:'flex', flexDirection:'column', fontFamily:'Inter,system-ui,sans-serif' }}>
      {/* Header */}
      <header style={{ borderBottom:'1px solid var(--fcs-output-ghost)', background:'rgba(10,10,10,0.95)', backdropFilter:'blur(8px)', position:'sticky', top:0, zIndex:40, padding:'0 24px' }}>
        <div style={{ maxWidth:'720px', margin:'0 auto', height:'60px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:'var(--fcs-signal)', animation:'pulse-signal 1.4s cubic-bezier(0.4,0,0.6,1) infinite' }} aria-hidden="true" />
            <div>
              <p style={{ fontSize:'14px', fontWeight:600, color:'var(--fcs-output)', lineHeight:1 }}>ExportGuide AI</p>
              <p style={{ fontSize:'11px', color:'var(--fcs-output-dim)' }}>{isLoading?'Thinking…':isComplete?'Interview complete':'Question '+Math.min(qIdx+1,5)+' of 5'}</p>
            </div>
          </div>
          {/* Progress dots */}
          <div style={{ display:'flex', gap:'5px' }} role="progressbar" aria-valuenow={qIdx} aria-valuemax={5} aria-label="Interview progress">
            {[0,1,2,3,4].map(i=>(
              <div key={i} style={{ width:'6px', height:'6px', borderRadius:'50%', background:i<qIdx?'var(--fcs-signal)':i===qIdx?'rgba(200,168,75,0.5)':'rgba(245,243,238,0.15)', transition:'all 300ms' }} aria-hidden="true" />
            ))}
          </div>
        </div>
      </header>

      {/* Messages */}
      <main style={{ flex:1, maxWidth:'720px', margin:'0 auto', width:'100%', padding:'24px', overflowY:'auto' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
          {messages.map(m => (
            <div key={m.id} style={{ display:'flex', gap:'10px', justifyContent:m.role==='user'?'flex-end':'flex-start' }}>
              {m.role==='assistant' && (
                <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'var(--fcs-signal-glow)', border:'1px solid rgba(200,168,75,0.25)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'2px' }} aria-hidden="true">
                  <span style={{ fontSize:'13px', fontWeight:700, color:'var(--fcs-signal)' }}>EG</span>
                </div>
              )}
              <div style={{ maxWidth:'78%', padding:'11px 14px', borderRadius:m.role==='user'?'12px 12px 4px 12px':'12px 12px 12px 4px', fontSize:'13px', lineHeight:1.65, background:m.role==='user'?'var(--fcs-signal)':'var(--fcs-depth)', color:m.role==='user'?'var(--fcs-void)':'var(--fcs-output)', border:m.role==='assistant'?'1px solid rgba(245,243,238,0.1)':'none' }}>
                {m.content.split(/(\*\*[^*]+\*\*)/).map((p,i)=>p.startsWith('**')&&p.endsWith('**')?<strong key={i}>{p.slice(2,-2)}</strong>:<span key={i}>{p}</span>)}
              </div>
            </div>
          ))}
          {isLoading && (
            <div style={{ display:'flex', gap:'10px', justifyContent:'flex-start' }}>
              <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'var(--fcs-signal-glow)', border:'1px solid rgba(200,168,75,0.25)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }} aria-hidden="true">
                <span style={{ fontSize:'13px', fontWeight:700, color:'var(--fcs-signal)' }}>EG</span>
              </div>
              <div style={{ padding:'13px 16px', borderRadius:'12px 12px 12px 4px', background:'var(--fcs-depth)', border:'1px solid rgba(245,243,238,0.1)', display:'flex', gap:'5px', alignItems:'center' }} aria-label="ExportGuide is thinking">
                {[0,1,2].map(i=><div key={i} className="ai-dot" aria-hidden="true" />)}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </main>

      {/* Input area */}
      <div style={{ borderTop:'1px solid var(--fcs-output-ghost)', background:'rgba(10,10,10,0.95)', backdropFilter:'blur(8px)' }}>
        <div style={{ maxWidth:'720px', margin:'0 auto', padding:'14px 24px 20px' }}>
          {isComplete ? (
            <div style={{ textAlign:'center', padding:'8px 0' }}>
              <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'var(--fcs-signal)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 10px' }} aria-hidden="true">
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M1 6l5 5L15 1" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round"/></svg>
              </div>
              <p style={{ fontSize:'14px', fontWeight:600, color:'var(--fcs-output)', marginBottom:'4px' }}>Interview complete!</p>
              <p style={{ fontSize:'12px', color:'var(--fcs-output-dim)', marginBottom:'14px' }}>Your export opportunity report is ready.</p>
              <button onClick={()=>router.push('/report')} className="btn-primary">
                View my report <ArrowRight size={15} aria-hidden="true" />
              </button>
            </div>
          ) : (
            <>
              {/* Quick replies */}
              {suggestions.length>0 && !isLoading && qIdx<5 && (
                <div style={{ display:'flex', flexWrap:'wrap', gap:'6px', marginBottom:'10px' }} role="group" aria-label="Suggested answers">
                  {suggestions.map(s=>(
                    <button key={s} onClick={()=>quickReply(s)} style={{ padding:'6px 12px', borderRadius:'20px', border:'1px solid var(--fcs-output-ghost)', background:'transparent', fontSize:'12px', color:'var(--fcs-output-dim)', cursor:'pointer', minHeight:'32px', transition:'all 150ms' }}
                      onMouseEnter={e=>{(e.target as HTMLElement).style.borderColor='rgba(200,168,75,0.4)';(e.target as HTMLElement).style.color='var(--fcs-output)'}}
                      onMouseLeave={e=>{(e.target as HTMLElement).style.borderColor='var(--fcs-output-ghost)';(e.target as HTMLElement).style.color='var(--fcs-output-dim)'}}
                    >{s}</button>
                  ))}
                </div>
              )}
              <form id="chat-form" onSubmit={handleSubmit} style={{ display:'flex', gap:'10px' }}>
                <input ref={inputRef} value={input} onChange={handleInputChange} disabled={isLoading} placeholder="Type your answer or choose above…" className="input-fcs" style={{ flex:1 }} aria-label="Your answer" />
                <button type="submit" disabled={isLoading||!input.trim()} className="btn-primary" style={{ padding:'10px 14px' }} aria-label="Send answer">
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </form>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'10px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'5px' }}>
                  <Shield size={10} color="var(--fcs-signal)" aria-hidden="true" />
                  <span style={{ fontSize:'10px', color:'var(--fcs-output-faint)' }}>FE Circular 42/43/48 compliant · Educational guidance only</span>
                </div>
                <button onClick={()=>reload()} style={{ background:'none', border:'none', fontSize:'11px', color:'var(--fcs-output-dim)', cursor:'pointer', display:'flex', alignItems:'center', gap:'4px' }}>
                  <RotateCcw size={10} aria-hidden="true" /> Restart
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

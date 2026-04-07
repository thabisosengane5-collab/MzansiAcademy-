'use client'
import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { loadQBank, loadSubjects } from '@/lib/content/loader'
import { saveQuizResult } from '@/lib/supabase/quiz'
import { addPoints } from '@/lib/firestore/points'
import type { QuizQuestion } from '@/lib/content/types'

type Phase = 'setup' | 'playing' | 'feedback' | 'results'

export default function QuizPage() {
  const { sid } = useParams() as { sid: string }
  const { user } = useAuth()
  const router = useRouter()

  const [phase, setPhase]         = useState<Phase>('setup')
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [current, setCurrent]     = useState(0)
  const [selected, setSelected]   = useState<number | null>(null)
  const [score, setScore]         = useState(0)
  const [answers, setAnswers]     = useState<boolean[]>([])
  const [subjectLabel, setSubjectLabel] = useState(sid)
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    async function load() {
      const [qbank, subjects] = await Promise.all([loadQBank(sid), loadSubjects()])
      const subject = subjects.find(s => s.id === sid)
      if (subject) setSubjectLabel(subject.label)
      // Shuffle and take 10
      const shuffled = [...qbank].sort(() => Math.random() - 0.5).slice(0, 10)
      setQuestions(shuffled)
      setLoading(false)
    }
    load()
  }, [sid])

  function handleAnswer(idx: number) {
    if (selected !== null) return
    setSelected(idx)
    setPhase('feedback')
  }

  function handleNext() {
    const correct = selected === questions[current].a
    const newAnswers = [...answers, correct]
    const newScore = correct ? score + 1 : score
    setAnswers(newAnswers)
    setScore(newScore)

    if (current + 1 >= questions.length) {
      finishQuiz(newScore, newAnswers)
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
      setPhase('playing')
    }
  }

  async function finishQuiz(finalScore: number, finalAnswers: boolean[]) {
    setPhase('results')
    if (!user?.uid) return
    const total = questions.length
    const pct = Math.round((finalScore / total) * 100)
    let pts = 0
    if (pct === 100) pts = 50
    else if (pct >= 70) pts = 25
    else if (pct >= 50) pts = 10
    else pts = 5

    await Promise.all([
      saveQuizResult(user.uid, sid, finalScore, total, pts),
      addPoints(user.uid, pts, `Quiz: ${subjectLabel}`),
    ])
  }

  if (loading) return (
    <div style={{minHeight:'100dvh',background:'var(--bg-root)',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'0.75rem'}}>
      <div style={{fontSize:'2rem'}}>⚡</div>
      <div style={{fontSize:'0.8rem',color:'var(--txt-3)'}}>Loading quiz...</div>
    </div>
  )

  if (questions.length === 0) return (
    <div style={{minHeight:'100dvh',background:'var(--bg-root)',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'1rem',padding:'2rem',textAlign:'center'}}>
      <div style={{fontSize:'2.5rem'}}>🚧</div>
      <div style={{fontWeight:800,color:'var(--txt)'}}>Quiz coming soon</div>
      <div style={{fontSize:'0.8rem',color:'var(--txt-3)'}}>Questions for {subjectLabel} are being generated</div>
      <button onClick={() => router.back()} style={backBtnStyle}>← Go Back</button>
    </div>
  )

  // Results screen
  if (phase === 'results') {
    const pct = Math.round((score / questions.length) * 100)
    const emoji = pct === 100 ? '🏆' : pct >= 70 ? '🎉' : pct >= 50 ? '👍' : '💪'
    const msg = pct === 100 ? 'Perfect score!' : pct >= 70 ? 'Great work!' : pct >= 50 ? 'Good effort!' : 'Keep practising!'
    const pts = pct === 100 ? 50 : pct >= 70 ? 25 : pct >= 50 ? 10 : 5

    return (
      <div style={{minHeight:'100dvh',background:'var(--bg-root)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'2rem',textAlign:'center'}}>
        <div style={{fontSize:'4rem',marginBottom:'1rem'}}>{emoji}</div>
        <div style={{fontFamily:'var(--serif)',fontSize:'1.6rem',fontWeight:900,color:'var(--txt)',marginBottom:'0.25rem'}}>{msg}</div>
        <div style={{fontSize:'0.85rem',color:'var(--txt-3)',marginBottom:'1.5rem'}}>{subjectLabel} Quiz</div>

        <div style={{background:'var(--bg-2)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:'1.5rem',width:'100%',maxWidth:'340px',marginBottom:'1.5rem'}}>
          <div style={{fontFamily:'var(--mono)',fontSize:'3rem',fontWeight:900,color:'var(--dna-green)',marginBottom:'0.25rem'}}>{score}/{questions.length}</div>
          <div style={{fontSize:'0.75rem',color:'var(--txt-3)',marginBottom:'1rem'}}>{pct}% correct</div>
          <div style={{display:'flex',justifyContent:'center',gap:'0.75rem'}}>
            <div style={{background:'rgba(0,214,143,0.1)',border:'1px solid rgba(0,214,143,0.3)',borderRadius:'20px',padding:'0.35rem 0.875rem',fontSize:'0.75rem',fontWeight:700,color:'var(--dna-green)'}}>+{pts} pts earned</div>
          </div>
        </div>

        {/* Wrong answers review */}
        <div style={{width:'100%',maxWidth:'340px',marginBottom:'1.5rem'}}>
          {questions.map((q, i) => !answers[i] && (
            <div key={i} style={{background:'rgba(239,68,68,0.06)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:'10px',padding:'0.75rem',marginBottom:'0.5rem',textAlign:'left'}}>
              <div style={{fontSize:'0.75rem',fontWeight:700,color:'var(--dna-red)',marginBottom:'0.375rem'}}>✗ {q.q}</div>
              <div style={{fontSize:'0.72rem',color:'var(--dna-green)'}}>✓ {q.opts[q.a]}</div>
              <div style={{fontSize:'0.68rem',color:'var(--txt-3)',marginTop:'0.25rem'}}>{q.et}</div>
            </div>
          ))}
        </div>

        <div style={{display:'flex',gap:'0.75rem',width:'100%',maxWidth:'340px'}}>
          <button onClick={() => { setCurrent(0); setScore(0); setSelected(null); setAnswers([]); setPhase('playing') }} style={{flex:1,padding:'0.75rem',background:'var(--bg-2)',border:'1px solid var(--border)',borderRadius:'10px',color:'var(--txt)',fontWeight:700,fontSize:'0.82rem',cursor:'pointer',fontFamily:'var(--font)'}}>
            🔄 Retry
          </button>
          <button onClick={() => router.push('/home')} style={{flex:1,padding:'0.75rem',background:'linear-gradient(135deg,var(--dna-green),var(--dna-teal))',border:'none',borderRadius:'10px',color:'#000',fontWeight:800,fontSize:'0.82rem',cursor:'pointer',fontFamily:'var(--font)'}}>
            🏠 Home
          </button>
        </div>
      </div>
    )
  }

  const q = questions[current]
  const isCorrect = selected === q.a

  return (
    <div style={{minHeight:'100dvh',background:'var(--bg-root)',display:'flex',flexDirection:'column'}}>
      {/* Header */}
      <div style={{background:'var(--bg-2)',borderBottom:'1px solid var(--border)',padding:'0.875rem 1.25rem'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'0.625rem'}}>
          <button onClick={() => router.back()} style={{background:'none',border:'none',color:'var(--txt-3)',cursor:'pointer',fontFamily:'var(--font)',fontSize:'0.8rem',padding:0}}>✕</button>
          <div style={{fontSize:'0.75rem',fontWeight:700,color:'var(--txt-3)'}}>{current + 1} / {questions.length}</div>
          <div style={{fontSize:'0.75rem',fontWeight:700,color:'var(--dna-green)'}}>⚡ {score} correct</div>
        </div>
        {/* Progress bar */}
        <div style={{height:'4px',background:'var(--bg-4)',borderRadius:'2px',overflow:'hidden'}}>
          <div style={{height:'100%',background:'linear-gradient(90deg,var(--dna-green),var(--dna-teal))',borderRadius:'2px',width:`${((current) / questions.length) * 100}%`,transition:'width 0.3s'}}/>
        </div>
      </div>

      {/* Question */}
      <div style={{flex:1,padding:'1.5rem',display:'flex',flexDirection:'column'}}>
        <div style={{fontSize:'2rem',marginBottom:'0.875rem',textAlign:'center'}}>{q.em}</div>
        <div style={{fontFamily:'var(--serif)',fontSize:'1.15rem',fontWeight:700,color:'var(--txt)',marginBottom:'1.5rem',textAlign:'center',lineHeight:1.4}}>{q.q}</div>

        {/* Options */}
        <div style={{display:'flex',flexDirection:'column',gap:'0.625rem',flex:1}}>
          {q.opts.map((opt, i) => {
            let bg = 'var(--bg-2)'
            let border = 'var(--border)'
            let color = 'var(--txt)'

            if (phase === 'feedback') {
              if (i === q.a) { bg = 'rgba(0,214,143,0.12)'; border = 'rgba(0,214,143,0.5)'; color = 'var(--dna-green)' }
              else if (i === selected && i !== q.a) { bg = 'rgba(239,68,68,0.12)'; border = 'rgba(239,68,68,0.5)'; color = 'var(--dna-red)' }
            } else if (selected === i) {
              bg = 'rgba(0,214,143,0.08)'; border = 'rgba(0,214,143,0.4)'
            }

            return (
              <button key={i} onClick={() => handleAnswer(i)} style={{
                padding:'0.875rem 1rem',borderRadius:'var(--radius-sm)',
                background:bg,border:`1.5px solid ${border}`,
                color,fontFamily:'var(--font)',fontWeight:600,
                fontSize:'0.88rem',cursor:'pointer',textAlign:'left',
                transition:'all 0.15s',
              }}>
                <span style={{fontFamily:'var(--mono)',fontSize:'0.75rem',color:'var(--txt-4)',marginRight:'0.625rem'}}>{String.fromCharCode(65+i)}.</span>
                {opt}
              </button>
            )
          })}
        </div>

        {/* Feedback & Next */}
        {phase === 'feedback' && (
          <div style={{marginTop:'1rem'}}>
            <div style={{background:isCorrect?'rgba(0,214,143,0.08)':'rgba(239,68,68,0.08)',border:`1px solid ${isCorrect?'rgba(0,214,143,0.25)':'rgba(239,68,68,0.25)'}`,borderRadius:'var(--radius-sm)',padding:'0.875rem',marginBottom:'0.875rem'}}>
              <div style={{fontWeight:800,fontSize:'0.82rem',color:isCorrect?'var(--dna-green)':'var(--dna-red)',marginBottom:'0.375rem'}}>
                {isCorrect ? '✅ Correct!' : '❌ Not quite'}
              </div>
              <div style={{fontSize:'0.78rem',color:'var(--txt-2)',lineHeight:1.5}}>{q.et}</div>
            </div>
            <button onClick={handleNext} style={{width:'100%',padding:'0.875rem',background:'linear-gradient(135deg,var(--dna-green),var(--dna-teal))',border:'none',borderRadius:'10px',color:'#000',fontWeight:800,fontSize:'0.9rem',cursor:'pointer',fontFamily:'var(--font)'}}>
              {current + 1 >= questions.length ? 'See Results 🏆' : 'Next Question →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const backBtnStyle: React.CSSProperties = {background:'linear-gradient(135deg,var(--dna-green),var(--dna-teal))',border:'none',borderRadius:'10px',padding:'0.625rem 1.25rem',color:'#000',fontWeight:800,fontSize:'0.82rem',cursor:'pointer',fontFamily:'var(--font)'}

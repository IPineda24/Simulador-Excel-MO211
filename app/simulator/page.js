'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import questionsData from '../../data/questions.json'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pickRandomVariant(q) {
  return q.variants[Math.floor(Math.random() * q.variants.length)]
}

function buildSession(mode) {
  return questionsData[mode].map(project => ({
    ...project,
    resolvedQuestions: project.questions.map(q => ({
      id: q.id,
      text: pickRandomVariant(q),
    }))
  }))
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// Trigger browser download for a file in /public/projects/
function downloadFile(filePath) {
  const href = filePath.replace(/^\.\//, '/')
  const link = document.createElement('a')
  link.href = href
  link.download = href.split('/').pop()
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// ─── Question Text Renderer — *sheet* → bold blue ────────────────────────────

function QuestionText({ text }) {
  const parts = text.split(/(\*[^*]+\*)/g)
  return (
    <p className="text-[#1a1a2e] leading-snug" style={ { fontFamily: 'Arial, sans-serif', fontSize: '13px' } }>
      { parts.map((part, i) =>
        part.startsWith('*') && part.endsWith('*') ? (
          <strong key={ i } className="text-[#1a4e8c] font-bold italic">
            { part.slice(1, -1) }
          </strong>
        ) : (
          <span key={ i }>{ part }</span>
        )
      ) }
    </p>
  )
}

// ─── Summary Screen ───────────────────────────────────────────────────────────

function SummaryScreen({ session, questionStates, mode, onRestart, onHome }) {
  const totalQ = session.reduce((acc, p) => acc + p.resolvedQuestions.length, 0)
  const completedCount = Object.values(questionStates).filter(v => v === 'completed').length
  const reviewCount = Object.values(questionStates).filter(v => v === 'review').length
  const isChallenge = mode === 'challenges'
  const isExam = mode === 'exam'
  const isExam2 = mode === 'exam_project2'
  const isExam3 = mode === 'exam_project3'
  const isPractice2 = mode === 'Practice2'

  const modeLabel = isExam3 ? 'Exam 3' : isExam2 ? 'Exam 2' : isExam ? 'Exam' : isPractice2 ? 'Practice 2' : isChallenge ? 'Challenges' : 'Practice'
  const modeColor = isExam3 ? 'text-[#a855f7]' : (isExam || isExam2) ? 'text-[#c0392b]' : isPractice2 ? 'text-[#7c3aed]' : isChallenge ? 'text-challenge-accent' : 'text-sim-accent'
  const btnStyle = isExam3
    ? 'bg-[#7b1fa2]/10 border-[#7b1fa2]/30 text-[#a855f7] hover:bg-[#7b1fa2]/20'
    : isExam2
      ? 'bg-[#c0392b]/10 border-[#c0392b]/30 text-[#c0392b] hover:bg-[#c0392b]/20'
      : isExam
        ? 'bg-[#e05c00]/10 border-[#e05c00]/30 text-[#e05c00] hover:bg-[#e05c00]/20'
        : isPractice2
          ? 'bg-[#7c3aed]/10 border-[#7c3aed]/30 text-[#7c3aed] hover:bg-[#7c3aed]/20'
          : isChallenge
            ? 'bg-challenge-accent/10 border-challenge-accent/30 text-challenge-accent hover:bg-challenge-accent/20'
            : 'bg-sim-accent/10 border-sim-accent/30 text-sim-accent hover:bg-sim-accent/20'

  const handleHome = () => {
    if (window.opener && window.opener !== window) {
      window.close()
    } else {
      onHome()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative z-10">
      <div className="max-w-lg w-full text-center animate-fade-in">
        <div className="text-6xl mb-6">🎯</div>
        <h1 className="text-4xl font-extrabold text-sim-text mb-1" style={ { fontFamily: 'Syne, sans-serif' } }>
          Sesión completada
        </h1>
        <p className="text-sim-muted text-sm mb-10">
          Modo:{ ' ' }
          <span className={ `font-bold ${modeColor}` }>{ modeLabel }</span>
        </p>

        <div className="grid grid-cols-3 gap-4 mb-10">
          { [
            { label: 'Total preguntas', value: totalQ, color: 'text-sim-text' },
            { label: 'Completadas', value: completedCount, color: 'text-sim-green' },
            { label: 'En revisión', value: reviewCount, color: 'text-sim-yellow' },
          ].map(({ label, value, color }) => (
            <div key={ label } className="bg-sim-card border border-sim-border rounded-xl p-5">
              <div className={ `text-3xl font-bold ${color}` }>{ value }</div>
              <div className="text-sim-muted text-xs mt-1">{ label }</div>
            </div>
          )) }
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={ handleHome }
            className="px-6 py-2.5 rounded-xl bg-sim-card border border-sim-border text-sim-muted text-sm hover:text-sim-text hover:border-sim-accent/40 transition-all"
          >
            ← Inicio
          </button>
          <button
            onClick={ onRestart }
            className={ `px-6 py-2.5 rounded-xl border text-sm font-bold transition-all ${btnStyle}` }
          >
            Repetir sesión
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Simulator UI ────────────────────────────────────────────────────────

function SimulatorContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawMode = searchParams.get('mode')
  const mode = rawMode === 'challenges' ? 'challenges'
    : rawMode === 'exam' ? 'exam'
      : rawMode === 'exam_project2' ? 'exam_project2'
        : rawMode === 'exam_project3' ? 'exam_project3'
          : rawMode === 'Practice2' ? 'Practice2'
            : 'practice'

  const [session] = useState(() => buildSession(mode))
  const [projectIdx, setProjectIdx] = useState(0)
  const [questionIdx, setQuestionIdx] = useState(0)
  const [questionStates, setQuestionStates] = useState({})
  const [secondsLeft, setSecondsLeft] = useState(50 * 60)
  const [showSummary, setShowSummary] = useState(false)

  // Exam 3 intake popup
  const isExam3 = mode === 'exam_project3'
  const [intakeDone, setIntakeDone] = useState(!isExam3)
  const [studentName, setStudentName] = useState('')
  const [intakeChecked, setIntakeChecked] = useState(false)

  const currentProject = session[projectIdx]
  const totalProjects = session.length
  const totalQuestions = currentProject.resolvedQuestions.length
  const currentQuestion = currentProject.resolvedQuestions[questionIdx]
  const stateKey = `${currentProject.id}-${questionIdx}`
  const isChallenge = mode === 'challenges'
  const isExam = mode === 'exam'
  const isExam2 = mode === 'exam_project2'
  const isPractice2 = mode === 'Practice2'

  const accentColor = isExam3 ? '#7b1fa2' : isExam || isExam2 ? '#e05c00' : isPractice2 ? '#7c3aed' : isChallenge ? 'var(--challenge-accent)' : 'var(--sim-accent)'

  // ── Timer ──
  useEffect(() => {
    if (secondsLeft <= 0) return
    const id = setInterval(() => setSecondsLeft(s => s - 1), 1000)
    return () => clearInterval(id)
  }, [secondsLeft])

  // ── Toggle question state ──
  const toggleState = useCallback((newState) => {
    setQuestionStates(prev => {
      const copy = { ...prev }
      copy[stateKey] === newState ? delete copy[stateKey] : (copy[stateKey] = newState)
      return copy
    })
  }, [stateKey])

  // ── Submit project: advance + download the NEXT project's file ──
  const handleSubmit = () => {
    if (projectIdx < totalProjects - 1) {
      const nextProject = session[projectIdx + 1]
      downloadFile(nextProject.file)
      setProjectIdx(i => i + 1)
      setQuestionIdx(0)
    } else {
      setShowSummary(true)
    }
  }

  if (showSummary) {
    return (
      <SummaryScreen
        session={ session }
        questionStates={ questionStates }
        mode={ mode }
        onRestart={ () => window.location.reload() }
        onHome={ () => router.push('/') }
      />
    )
  }

  // ── Exam 3 intake popup ──
  if (!intakeDone) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#0a0e1a]">
        <div className="w-full max-w-md bg-[#111827] border border-[#7b1fa2]/30 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(123,31,162,0.15)]">

          {/* Header */ }
          <div className="bg-[#7b1fa2]/10 border-b border-[#7b1fa2]/20 px-6 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#7b1fa2]/20 border border-[#7b1fa2]/40 flex items-center justify-center text-lg">🏅</div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-[#a855f7]/60">Certiport MO-211</p>
              <h2 className="text-white font-bold text-sm" style={ { fontFamily: 'Syne, sans-serif' } }>Exam 3 — Simulación Oficial</h2>
            </div>
          </div>

          <div className="px-6 py-5 space-y-5">

            {/* Name input */ }
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-widest text-[#a855f7]/70 mb-1.5">
                Tu nombre completo
              </label>
              <input
                type="text"
                value={ studentName }
                onChange={ e => setStudentName(e.target.value) }
                placeholder="Ej. Juan Pérez"
                className="w-full bg-[#0d1117] border border-[#7b1fa2]/30 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#a855f7]/60 transition-colors"
              />
            </div>

            {/* Warning box */ }
            <div className="bg-[#7b1fa2]/8 border border-[#7b1fa2]/25 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">⚠️</span>
                <span className="text-[#d8b4fe] font-bold text-xs uppercase tracking-widest font-mono">Aviso importante</span>
              </div>
              <p className="text-gray-300 text-xs leading-relaxed">
                Este examen está diseñado para evaluar tu nivel <strong className="text-white">sin ayuda externa</strong>. Su propósito es darte una nota lo más cercana posible a la que obtendrías en el examen de certificación real de Certiport.
              </p>
              <p className="text-gray-300 text-xs leading-relaxed">
                Resolver las preguntas con asistencia —compañeros, apuntes, internet o IA— <strong className="text-[#f9a8d4]">invalida completamente el resultado</strong> y solo te perjudica a ti. Esta es <strong className="text-white">tu oportunidad de medirte honestamente</strong>.
              </p>
              <p className="text-[#a855f7] text-xs leading-relaxed font-medium">
                Tienes 50 minutos. Trabaja en Excel con los archivos descargados. Buena suerte.
              </p>
            </div>

            {/* Checkbox */ }
            <label className="flex items-start gap-3 cursor-pointer group">
              <div
                onClick={ () => setIntakeChecked(v => !v) }
                className={ `mt-0.5 w-4 h-4 shrink-0 rounded border-2 flex items-center justify-center transition-all ${intakeChecked ? 'bg-[#7b1fa2] border-[#7b1fa2]' : 'border-gray-600 group-hover:border-[#a855f7]/60'}` }
              >
                { intakeChecked && <span className="text-white text-[10px] leading-none">✓</span> }
              </div>
              <span className="text-gray-400 text-xs leading-relaxed">
                Entiendo que este es un examen de medición personal. Me comprometo a resolverlo de forma <span className="text-white font-medium">íntegra e independiente</span>.
              </span>
            </label>

            {/* CTA */ }
            <button
              disabled={ !studentName.trim() || !intakeChecked }
              onClick={ () => setIntakeDone(true) }
              className="w-full py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-[#7b1fa2] hover:bg-[#6a1b9a] text-white border border-[#a855f7]/30"
            >
              Comenzar examen →
            </button>
          </div>
        </div>
      </div>
    )
  }

  const qState = questionStates[stateKey]

  return (
    <div
      className="flex flex-col bg-[#f0f2f5] overflow-hidden"
      style={ { height: '100dvh', fontFamily: 'Arial, sans-serif' } }
    >

      {/* ══════════════════════════════════════════
          ROW 1 — TOP BAR (navy, ~32px)
      ══════════════════════════════════════════ */}
      <header
        className="bg-[#1e3a5f] text-white flex items-center justify-between shrink-0 select-none"
        style={ { padding: '3px 8px', minHeight: 0 } }
      >
        {/* Left: timer + Go to Summary */ }
        <div className="flex items-center gap-1.5">
          <div className={ `flex items-center gap-1 bg-[#162d4a] border rounded px-2 py-0.5 font-mono font-bold ${secondsLeft < 300
            ? 'border-red-400 text-red-300 animate-pulse'
            : 'border-[#2a4f7a] text-white'
            }` } style={ { fontSize: '11px' } }>
            <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <polyline points="12 6 12 12 16 14" strokeWidth="2" />
            </svg>
            { formatTime(secondsLeft) }
          </div>
          <button
            onClick={ () => setShowSummary(true) }
            className="bg-[#2563a8] hover:bg-[#1d4f8a] border border-[#3a74c0] text-white font-bold rounded transition-colors whitespace-nowrap"
            style={ { fontSize: '11px', padding: '2px 8px' } }
          >
            Go To Summary
          </button>
        </div>

        {/* Center: mode badge + Project title */ }
        <div className="flex items-center gap-2 mx-2 overflow-hidden">
          { isExam && (
            <span className="shrink-0 text-[9px] font-bold font-mono uppercase tracking-widest bg-[#e05c00]/20 border border-[#e05c00]/50 text-[#f08040] rounded px-1.5 py-0.5">
              EXAM
            </span>
          ) }
          { isExam2 && (
            <span className="shrink-0 text-[9px] font-bold font-mono uppercase tracking-widest bg-[#c0392b]/20 border border-[#c0392b]/50 text-[#e57373] rounded px-1.5 py-0.5">
              EXAM 2
            </span>
          ) }
          { isExam3 && (
            <span className="shrink-0 text-[9px] font-bold font-mono uppercase tracking-widest bg-[#7b1fa2]/20 border border-[#7b1fa2]/50 text-[#d8b4fe] rounded px-1.5 py-0.5">
              EXAM 3
            </span>
          ) }
          { isPractice2 && (
            <span className="shrink-0 text-[9px] font-bold font-mono uppercase tracking-widest bg-[#7c3aed]/20 border border-[#7c3aed]/50 text-[#a78bfa] rounded px-1.5 py-0.5">
              PRACTICE 2
            </span>
          ) }
          <h1 className="font-bold text-white tracking-wide truncate" style={ { fontSize: '12px' } }>
            Project { projectIdx + 1 } of { totalProjects }: { currentProject.name }
          </h1>
        </div>

        {/* Right: Restart + Submit + Download */ }
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={ () => { setProjectIdx(0); setQuestionIdx(0); setQuestionStates({}) } }
            className="bg-[#2563a8] hover:bg-[#1d4f8a] border border-[#3a74c0] text-white font-bold rounded transition-colors whitespace-nowrap"
            style={ { fontSize: '11px', padding: '2px 8px' } }
          >
            Restart Project
          </button>
          <button
            onClick={ handleSubmit }
            className="bg-[#2563a8] hover:bg-[#1d4f8a] border border-[#3a74c0] text-white font-bold rounded transition-colors whitespace-nowrap"
            style={ { fontSize: '11px', padding: '2px 8px' } }
          >
            Submit Project
          </button>
          <button
            onClick={ () => downloadFile(currentProject.file) }
            title="Download Excel file"
            className="bg-[#2563a8] hover:bg-[#1d4f8a] border border-[#3a74c0] text-white rounded transition-colors"
            style={ { padding: '3px 6px' } }
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
      </header>

      {/* ══════════════════════════════════════════
          ROW 2 — NAV BAR (navy, ~28px)
      ══════════════════════════════════════════ */}
      <nav
        className="bg-[#1e3a5f] border-t border-[#2a4f7a] flex items-center gap-1 shrink-0"
        style={ { padding: '3px 8px', minHeight: 0 } }
      >
        {/* Prev */ }
        <button
          onClick={ () => questionIdx > 0 && setQuestionIdx(i => i - 1) }
          disabled={ questionIdx === 0 }
          className="flex items-center justify-center bg-[#2563a8] hover:bg-[#1d4f8a] disabled:opacity-30 disabled:cursor-not-allowed text-white rounded font-bold shrink-0 transition-colors"
          style={ { width: '22px', height: '22px', fontSize: '14px' } }
        >
          ‹
        </button>

        {/* Question pills */ }
        <div className="flex gap-1 overflow-x-auto" style={ { scrollbarWidth: 'none' } }>
          { currentProject.resolvedQuestions.map((q, i) => {
            const sk = `${currentProject.id}-${i}`
            const st = questionStates[sk]
            const isActive = i === questionIdx
            return (
              <button
                key={ q.id }
                onClick={ () => setQuestionIdx(i) }
                className={ `shrink-0 flex items-center justify-center rounded font-bold transition-all border ${isActive
                  ? 'bg-white text-[#1e3a5f] border-white shadow'
                  : st === 'completed'
                    ? 'bg-[#1d6b3f] text-white border-[#2a8a52]'
                    : st === 'review'
                      ? 'bg-[#7a5c00] text-yellow-200 border-yellow-600'
                      : 'bg-[#162d4a] text-[#8db4da] border-[#2a4f7a] hover:bg-[#1f3d5c] hover:text-white'
                  }` }
                style={ { minWidth: '28px', height: '22px', fontSize: '11px', padding: '0 4px' } }
              >
                { st === 'completed' && !isActive && <span className="text-green-300 mr-0.5" style={ { fontSize: '9px' } }>✓</span> }
                { i + 1 }
              </button>
            )
          }) }
        </div>

        {/* Next */ }
        <button
          onClick={ () => questionIdx < totalQuestions - 1 && setQuestionIdx(i => i + 1) }
          disabled={ questionIdx === totalQuestions - 1 }
          className="flex items-center justify-center bg-[#2563a8] hover:bg-[#1d4f8a] disabled:opacity-30 disabled:cursor-not-allowed text-white rounded font-bold shrink-0 transition-colors"
          style={ { width: '22px', height: '22px', fontSize: '14px' } }
        >
          ›
        </button>
      </nav>

      {/* ══════════════════════════════════════════
          ROW 3 — QUESTION BODY (flex-1, scrollable)
      ══════════════════════════════════════════ */}
      <main className="flex-1 overflow-y-auto bg-white border-x-0" style={ { minHeight: 0 } }>
        <div
          key={ `${currentProject.id}-${questionIdx}` }
          className="h-full animate-fade-in"
          style={ { padding: '8px 14px' } }
        >
          { qState && (
            <span className={ `inline-flex items-center gap-1 font-bold rounded mr-2 mb-1 ${qState === 'completed'
              ? 'text-green-700'
              : 'text-yellow-700'
              }` } style={ { fontSize: '10px' } }>
              { qState === 'completed' ? '✓ Complete' : '! Review' }
            </span>
          ) }

          <QuestionText text={ currentQuestion.text } />
        </div>
      </main>

      {/* ══════════════════════════════════════════
          ROW 4 — ACTION FOOTER (~32px)
      ══════════════════════════════════════════ */}
      <footer
        className="bg-[#e8ecf0] border-t border-[#c8d6e5] flex shrink-0"
        style={ { minHeight: 0 } }
      >
        <button
          onClick={ () => toggleState('completed') }
          className={ `flex-1 font-bold border-r border-[#c8d6e5] transition-all ${qState === 'completed'
            ? 'bg-[#d4edda] text-[#1a6b35]'
            : 'text-[#3a5a7a] hover:bg-[#dce5ef]'
            }` }
          style={ { fontSize: '11px', padding: '5px 4px' } }
        >
          { qState === 'completed' ? '✓ ' : '' }Mark Complete
        </button>

        <button
          onClick={ () => toggleState('review') }
          className={ `flex-1 font-bold border-r border-[#c8d6e5] transition-all ${qState === 'review'
            ? 'bg-[#fff3cd] text-[#856404]'
            : 'text-[#3a5a7a] hover:bg-[#dce5ef]'
            }` }
          style={ { fontSize: '11px', padding: '5px 4px' } }
        >
          { qState === 'review' ? '! ' : '' }Mark for Review
        </button>

        <button
          className="flex-1 font-bold text-[#3a5a7a] hover:bg-[#dce5ef] transition-all"
          style={ { fontSize: '11px', padding: '5px 4px' } }
        >
          Mark for Feedback
        </button>
      </footer>
    </div>
  )
}

// ─── Page Export ──────────────────────────────────────────────────────────────

export default function SimulatorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a]">
        <span className="text-[#00d4ff] font-mono animate-pulse text-sm">Loading...</span>
      </div>
    }>
      <SimulatorContent />
    </Suspense>
  )
}
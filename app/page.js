'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleNavigation = (mode) => {
    const screenWidth = window.screen.availWidth
    const screenHeight = window.screen.availHeight
    const windowWidth = screenWidth
    const windowHeight = Math.round(screenHeight * 0.2)
    const left = 0
    const top = screenHeight - windowHeight

    window.open(
      `/simulator?mode=${mode}`,
      '_blank',
      `width=${windowWidth},height=${windowHeight},left=${left},top=${top},resizable=yes,scrollbars=yes`
    )
  }

  if (!mounted) {
    return (
      <div suppressHydrationWarning className="min-h-screen flex flex-col items-center justify-center px-6 relative z-10">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-gray-200 rounded mb-4 mx-auto"></div>
          <div className="h-4 w-64 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div suppressHydrationWarning className="min-h-screen flex flex-col items-center justify-center px-6 relative z-10">
      {/* Header */ }
      <div className="text-center mb-16 animate-fade-in">
        <div className="inline-flex items-center gap-2 bg-sim-card border border-sim-border rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 rounded-full bg-sim-accent animate-pulse-slow"></span>
          <span className="text-sim-accent text-xs font-mono tracking-widest uppercase">Certiport MOS</span>
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight mb-4"
          style={ { fontFamily: 'Syne, sans-serif' } }>
          <span className="text-sim-text">Excel </span>
          <span className="text-sim-accent glow-text">MO-211</span>
        </h1>
        <p className="text-sim-muted text-sm md:text-base max-w-md mx-auto leading-relaxed">
          Simulador de certificación. Elige tu modo de práctica.
        </p>
      </div>

      {/* Mode Cards */ }
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl animate-slide-up">

        {/* Practice Mode */ }
        <button
          onClick={ () => handleNavigation('practice') }
          className="group card-hover bg-sim-card border border-sim-border rounded-2xl p-8 text-left transition-all duration-300 hover:scale-[1.02]"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="w-12 h-12 rounded-xl bg-sim-accent/10 border border-sim-accent/20 flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <span className="text-sim-accent/60 text-xs font-mono uppercase tracking-widest pt-1">6 Projects</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-sim-text mb-2"
            style={ { fontFamily: 'Syne, sans-serif' } }>
            Practice
          </h2>
          <p className="text-sim-muted text-sm leading-relaxed mb-6">
            Preguntas de práctica estándar. Ideales para repasar todos los temas del examen MO-211.
          </p>
          <div className="flex gap-2 flex-wrap">
            { ['Pivot Tables', 'Formulas', 'Charts', 'Macros', 'Formatting'].map(tag => (
              <span key={ tag } className="text-xs bg-sim-accent/5 border border-sim-accent/15 text-sim-accent/70 rounded-full px-3 py-0.5">
                { tag }
              </span>
            )) }
          </div>
          <div className="mt-6 flex items-center gap-2 text-sim-accent text-sm font-mono group-hover:gap-3 transition-all">
            <span>Comenzar</span>
            <span>→</span>
          </div>
        </button>

        {/* Challenge Mode */ }
        <button
          onClick={ () => handleNavigation('challenges') }
          className="group challenge-hover bg-sim-card border border-sim-border rounded-2xl p-8 text-left transition-all duration-300 hover:scale-[1.02]"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="w-12 h-12 rounded-xl bg-challenge-accent/10 border border-challenge-accent/20 flex items-center justify-center">
              <span className="text-2xl">🏆</span>
            </div>
            <span className="text-challenge-accent/60 text-xs font-mono uppercase tracking-widest pt-1">3 Challenges</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-sim-text mb-2"
            style={ { fontFamily: 'Syne, sans-serif' } }>
            Challenges
          </h2>
          <p className="text-sim-muted text-sm leading-relaxed mb-6">
            Problemas avanzados de certificación MO-211. Para quienes ya dominan lo básico.
          </p>
          <div className="flex gap-2 flex-wrap">
            { ['Analytical', 'Consultants', 'Cruise'].map(tag => (
              <span key={ tag } className="text-xs bg-challenge-accent/5 border border-challenge-accent/15 text-challenge-accent/70 rounded-full px-3 py-0.5">
                { tag }
              </span>
            )) }
          </div>
          <div className="mt-6 flex items-center gap-2 text-challenge-accent text-sm font-mono group-hover:gap-3 transition-all">
            <span>Comenzar</span>
            <span>→</span>
          </div>
        </button>

        {/* Exam Mode */ }
        <button
          onClick={ () => handleNavigation('exam') }
          className="group bg-sim-card border border-sim-border rounded-2xl p-8 text-left transition-all duration-300 hover:scale-[1.02] hover:border-[#e05c00]/40 hover:shadow-[0_0_24px_rgba(224,92,0,0.08)]"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#e05c00]/10 border border-[#e05c00]/20 flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
            <span className="text-[#e05c00]/60 text-xs font-mono uppercase tracking-widest pt-1">3 Projects</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-sim-text mb-2"
            style={ { fontFamily: 'Syne, sans-serif' } }>
            Exam
          </h2>
          <p className="text-sim-muted text-sm leading-relaxed mb-6">
            Simulación completa del examen MO-211. Condiciones reales de certificación Certiport.
          </p>
          <div className="flex gap-2 flex-wrap">
            { ['Adventure Works', 'First Up', 'Wide World'].map(tag => (
              <span key={ tag } className="text-xs bg-[#e05c00]/5 border border-[#e05c00]/15 text-[#e05c00]/70 rounded-full px-3 py-0.5">
                { tag }
              </span>
            )) }
          </div>
          <div className="mt-6 flex items-center gap-2 text-[#e05c00] text-sm font-mono group-hover:gap-3 transition-all">
            <span>Comenzar</span>
            <span>→</span>
          </div>
        </button>

      </div>

      {/* Footer */ }
      <p className="mt-16 text-sim-muted/40 text-xs font-mono">
        Creado por Irvin Pineda · © 2026
      </p>
    </div>
  )
}
'use client'

import { useEffect, useState } from 'react'
import { Brain, MessageCircle, Sparkles } from 'lucide-react'

interface SplashScreenProps {
  onComplete: () => void
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true)
  const [animationPhase, setAnimationPhase] = useState(0)

  useEffect(() => {
    // Play sound effect
    const playSound = () => {
      try {
        const audio = new Audio('/sounds/splash.mp3')
        audio.volume = 0.3
        audio.play().catch(() => {
          // Fallback: create a simple beep sound
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()
          
          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)
          
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
          oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.3)
          
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
          
          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.3)
        })
      } catch (error) {
        console.log('Audio playback failed:', error)
      }
    }

    // Animation phases
    const phase1 = setTimeout(() => {
      setAnimationPhase(1)
      playSound()
    }, 300)

    const phase2 = setTimeout(() => {
      setAnimationPhase(2)
    }, 800)

    const phase3 = setTimeout(() => {
      setAnimationPhase(3)
    }, 1200)

    const complete = setTimeout(() => {
      setIsVisible(false)
      onComplete()
    }, 2500)

    return () => {
      clearTimeout(phase1)
      clearTimeout(phase2)
      clearTimeout(phase3)
      clearTimeout(complete)
    }
  }, [onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6">
        {/* Brain icon with animation */}
        <div className={`mb-8 transition-all duration-700 transform ${
          animationPhase >= 1 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}>
          <div className="relative">
            <Brain className="w-24 h-24 md:w-32 md:h-32 text-white mx-auto animate-pulse" />
            {/* Sparkles around brain */}
            <div className={`absolute inset-0 transition-all duration-500 ${
              animationPhase >= 2 ? 'scale-125 opacity-100' : 'scale-100 opacity-0'
            }`}>
              <Sparkles className="absolute -top-4 -left-4 w-8 h-8 text-yellow-300 animate-spin" />
              <Sparkles className="absolute -top-2 -right-4 w-6 h-6 text-blue-300 animate-bounce" />
              <Sparkles className="absolute -bottom-4 -left-2 w-7 h-7 text-purple-300 animate-pulse" />
              <Sparkles className="absolute -bottom-2 -right-2 w-5 h-5 text-pink-300 animate-bounce" />
            </div>
          </div>
        </div>

        {/* Title with typewriter effect */}
        <div className={`mb-4 transition-all duration-700 transform ${
          animationPhase >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
            AI CHAT BOT
          </h1>
        </div>

        {/* Subtitle with fade-in */}
        <div className={`transition-all duration-700 transform ${
          animationPhase >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <p className="text-lg md:text-xl text-blue-200 mb-6">
            MADE BY ABDI NAASIR
          </p>
        </div>

        {/* Loading indicator */}
        <div className={`transition-all duration-700 transform ${
          animationPhase >= 3 ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
        }`}>
          <div className="flex items-center justify-center space-x-2">
            <MessageCircle className="w-5 h-5 text-blue-300 animate-bounce" />
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <MessageCircle className="w-5 h-5 text-blue-300 animate-bounce" />
          </div>
        </div>

        {/* Progress bar */}
        <div className={`mt-8 w-48 md:w-64 mx-auto transition-all duration-700 ${
          animationPhase >= 2 ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-1000"
              style={{
                width: animationPhase >= 3 ? '100%' : '0%',
                transitionDelay: animationPhase >= 2 ? '500ms' : '0ms'
              }}
            />
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 text-white/10 animate-pulse">
          <MessageCircle className="w-16 h-16" />
        </div>
        <div className="absolute top-3/4 right-1/4 text-white/10 animate-pulse" style={{ animationDelay: '1s' }}>
          <Brain className="w-12 h-12" />
        </div>
        <div className="absolute bottom-1/4 left-1/3 text-white/10 animate-pulse" style={{ animationDelay: '0.5s' }}>
          <Sparkles className="w-8 h-8" />
        </div>
      </div>
    </div>
  )
}
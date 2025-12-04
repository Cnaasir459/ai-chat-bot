'use client'

export const playSound = (type: 'splash' | 'message' | 'notification' | 'click') => {
  try {
    const audio = new Audio(`/sounds/${type}.mp3`)
    audio.volume = 0.3
    audio.play().catch(() => {
      // Fallback sound generation
      generateFallbackSound(type)
    })
  } catch (error) {
    console.log('Audio playback failed:', error)
    generateFallbackSound(type)
  }
}

const generateFallbackSound = (type: string) => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    const currentTime = audioContext.currentTime
    
    switch (type) {
      case 'splash':
        oscillator.frequency.setValueAtTime(800, currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(400, currentTime + 0.3)
        gainNode.gain.setValueAtTime(0.1, currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.3)
        oscillator.start(currentTime)
        oscillator.stop(currentTime + 0.3)
        break
      case 'message':
        oscillator.frequency.setValueAtTime(600, currentTime)
        gainNode.gain.setValueAtTime(0.05, currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.1)
        oscillator.start(currentTime)
        oscillator.stop(currentTime + 0.1)
        break
      case 'notification':
        oscillator.frequency.setValueAtTime(1000, currentTime)
        oscillator.frequency.setValueAtTime(1200, currentTime + 0.1)
        gainNode.gain.setValueAtTime(0.08, currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.2)
        oscillator.start(currentTime)
        oscillator.stop(currentTime + 0.2)
        break
      case 'click':
        oscillator.frequency.setValueAtTime(1000, currentTime)
        gainNode.gain.setValueAtTime(0.03, currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.05)
        oscillator.start(currentTime)
        oscillator.stop(currentTime + 0.05)
        break
    }
  } catch (error) {
    console.log('Fallback sound generation failed:', error)
  }
}
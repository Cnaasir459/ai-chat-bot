'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Paperclip, Mic, Square, Upload } from 'lucide-react'
import { useTranslation } from '@/lib/translations'

interface InputAreaProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}

export const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, disabled = false }) => {
  const { t } = useTranslation()
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if ((message.trim() || selectedFile) && !disabled) {
      let finalMessage = message.trim()
      
      // Add file info to message if file is selected
      if (selectedFile) {
        finalMessage = finalMessage + (finalMessage ? ' ' : '') + `[File: ${selectedFile.name}]`
      }
      
      onSendMessage(finalMessage)
      setMessage('')
      setSelectedFile(null)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      setIsRecording(true)

      const chunks: Blob[] = []
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' })
        const text = await transcribeAudio(audioBlob)
        setMessage(prev => prev + (prev ? ' ' : '') + text)
        setIsRecording(false)
      }

      mediaRecorder.start()
    } catch (error) {
      console.error('Microphone access denied:', error)
      setMessage(prev => prev + (prev ? ' ' : '') + '[Microphone not available]')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
    }
  }

  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    // This would integrate with a speech-to-text service
    // For now, return a placeholder
    return new Promise((resolve) => {
      setTimeout(() => resolve('[Voice message - transcription service needed]'), 1000)
    })
  }

  return (
    <div className="border-t border-border bg-background p-2 sm:p-4">
      <form onSubmit={handleSubmit} className="flex gap-2 items-end">
        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('typeMessage')}
            disabled={disabled}
            className="min-h-[44px] sm:min-h-[60px] max-h-[120px] sm:max-h-[200px] resize-none pr-20 sm:pr-24 text-sm sm:text-base"
            rows={1}
          />
          
          {/* File attachment preview */}
          {selectedFile && (
            <div className="absolute bottom-2 left-2 bg-muted p-1 sm:p-2 rounded text-xs max-w-[200px] sm:max-w-none">
              <div className="flex items-center gap-1 sm:gap-2">
                <Upload className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate">{selectedFile.name}</span>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedFile(null)}
                  className="h-5 w-5 sm:h-8 sm:w-8 p-0"
                >
                  <Square className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2 flex gap-0 sm:gap-1">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="h-7 w-7 sm:h-8 sm:w-8 p-0"
            >
              <Paperclip className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
            
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              disabled={disabled}
              className={`h-7 w-7 sm:h-8 sm:w-8 p-0 ${isRecording ? 'bg-red-500 hover:bg-red-600' : ''}`}
            >
              <Mic className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>
        
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          accept="text/*,image/*,.pdf,.doc,.docx"
        />
        
        <Button
          type="submit"
          disabled={(!message.trim() && !selectedFile) || disabled}
          className="h-[44px] sm:h-[60px] px-2 sm:px-4 min-w-[44px] sm:min-w-auto"
        >
          <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline ml-2">{t('send')}</span>
        </Button>
      </form>
    </div>
  )
}
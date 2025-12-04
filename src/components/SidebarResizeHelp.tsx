'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X, GripVertical } from 'lucide-react'

export const SidebarResizeHelp: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show help on first visit
    const hasSeenHelp = localStorage.getItem('sidebar-resize-help-seen')
    if (!hasSeenHelp) {
      setIsVisible(true)
    }
  }, [])

  const dismissHelp = () => {
    setIsVisible(false)
    localStorage.setItem('sidebar-resize-help-seen', 'true')
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm bg-card border border-border rounded-lg shadow-lg p-4 animate-in slide-in-from-bottom-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <GripVertical className="w-4 h-4 text-primary" />
            <h4 className="font-semibold text-sm">Resizable Sidebar</h4>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Drag the right edge to resize</p>
            <p>• Double-click to reset to default</p>
            <p>• Use Ctrl+Arrow keys for fine-tuning</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={dismissHelp}
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    </div>
  )
}
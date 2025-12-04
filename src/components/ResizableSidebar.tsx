'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Sidebar } from './Sidebar'

interface ResizableSidebarProps {
  onNewChat: () => void
  onExploreGpts: () => void
  onSettings: () => void
}

const MIN_WIDTH = 200
const MAX_WIDTH = 400
const DEFAULT_WIDTH = 260

export const ResizableSidebar: React.FC<ResizableSidebarProps> = ({
  onNewChat,
  onExploreGpts,
  onSettings
}) => {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    // Load saved width from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-width')
      return saved ? Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, parseInt(saved))) : DEFAULT_WIDTH
    }
    return DEFAULT_WIDTH
  })
  
  const [isResizing, setIsResizing] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !sidebarRef.current) return

    const newWidth = e.clientX
    const clampedWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth))
    setSidebarWidth(clampedWidth)
  }, [isResizing])

  const handleMouseUp = useCallback(() => {
    if (isResizing) {
      setIsResizing(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      // Save width to localStorage
      localStorage.setItem('sidebar-width', sidebarWidth.toString())
    }
  }, [isResizing, sidebarWidth])

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  // Handle double click to reset width
  const handleDoubleClick = useCallback(() => {
    setSidebarWidth(DEFAULT_WIDTH)
    localStorage.setItem('sidebar-width', DEFAULT_WIDTH.toString())
  }, [])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Arrow keys to resize
      if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowLeft') {
        e.preventDefault()
        setSidebarWidth(prev => Math.max(MIN_WIDTH, prev - 20))
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowRight') {
        e.preventDefault()
        setSidebarWidth(prev => Math.min(MAX_WIDTH, prev + 20))
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div 
      ref={sidebarRef}
      className={`relative flex-shrink-0 bg-card border-r border-border transition-all duration-200 ease-in-out ${
        isResizing ? 'shadow-2xl z-50' : 'z-10'
      }`}
      style={{ width: `${sidebarWidth}px` }}
    >
      <Sidebar
        onNewChat={onNewChat}
        onExploreGpts={onExploreGpts}
        onSettings={onSettings}
      />
      
      {/* Resize Handle */}
      <div
        className={`absolute top-0 right-0 w-1 h-full bg-transparent transition-all duration-200 cursor-col-resize group ${
          isResizing ? 'bg-primary/70' : isHovering ? 'bg-primary/30' : 'hover:bg-primary/50'
        }`}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onDoubleClick={handleDoubleClick}
        title="Drag to resize, double-click to reset, Ctrl+Arrow keys to fine-tune"
      >
        {/* Visual indicator on hover */}
        <div className={`absolute top-1/2 right-0 transform -translate-y-1/2 w-1 h-8 bg-primary rounded-full transition-all duration-200 ${
          isHovering || isResizing ? 'opacity-100' : 'opacity-0'
        } ${isResizing ? 'h-12 bg-primary/80' : ''}`} />
        
        {/* Resize dots when hovering */}
        {(isHovering || isResizing) && (
          <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 flex flex-col gap-1">
            <div className="w-1 h-1 bg-primary rounded-full" />
            <div className="w-1 h-1 bg-primary rounded-full" />
            <div className="w-1 h-1 bg-primary rounded-full" />
          </div>
        )}
      </div>
      
      {/* Resize indicator when active */}
      {isResizing && (
        <>
          <div className="absolute top-0 right-0 w-0.5 h-full bg-primary pointer-events-none" />
          <div className="absolute bottom-4 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded pointer-events-none">
            {sidebarWidth}px
          </div>
        </>
      )}
      
      {/* Width indicator when hovering */}
      {isHovering && !isResizing && (
        <div className="absolute top-4 right-2 bg-muted text-muted-foreground text-xs px-2 py-1 rounded pointer-events-none opacity-70">
          {sidebarWidth}px
        </div>
      )}
    </div>
  )
}
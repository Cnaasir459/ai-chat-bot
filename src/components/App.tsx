'use client'

import React, { useState, useEffect } from 'react'
import { SplashScreen } from '@/components/SplashScreen'
import { ResizableSidebar } from '@/components/ResizableSidebar'
import { SidebarResizeHelp } from '@/components/SidebarResizeHelp'
import { InputArea } from '@/components/InputArea'
import { ExploreModal } from '@/components/ExploreModal'
import { SettingsModal } from '@/components/SettingsModal'
import { AuthModal } from '@/components/AuthModal'
import { EmailVerificationModal } from '@/components/EmailVerificationModal'
import { UserProfile } from '@/components/UserProfile'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MessageCircle, Sparkles, Bot, LogIn, Menu, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from '@/lib/translations'
import { createConversation, createMessage, getMessages, updateConversation, Conversation, Message } from '@/lib/database'
import { playSound } from '@/lib/sounds'

interface LocalMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export const App: React.FC = () => {
  const { t } = useTranslation()
  const { user, loading } = useAuth()
  
  const [showSplash, setShowSplash] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [messages, setMessages] = useState<LocalMessage[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [isExploreModalOpen, setIsExploreModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isEmailVerificationOpen, setIsEmailVerificationOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Check if user needs email verification
  useEffect(() => {
    if (user && !user.email_confirmed_at && !isEmailVerificationOpen) {
      setIsEmailVerificationOpen(true)
    }
  }, [user, isEmailVerificationOpen])
  // Load conversation messages when conversation changes
  useEffect(() => {
    if (currentConversation && user) {
      loadMessages(currentConversation.id)
    } else {
      setMessages([])
    }
  }, [currentConversation, user])

  const loadMessages = async (conversationId: string) => {
    const { data, error } = await getMessages(conversationId)
    if (data && !error) {
      const localMessages: LocalMessage[] = data.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.created_at)
      }))
      setMessages(localMessages)
    }
  }

  const handleNewChat = async () => {
    if (!user) {
      setIsAuthModalOpen(true)
      return
    }

    const { data, error } = await createConversation()
    if (data && !error) {
      setCurrentConversation(data)
      setMessages([])
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!user) {
      setIsAuthModalOpen(true)
      playSound('click')
      return
    }

    // Play message sound
    playSound('message')

    // Create conversation if none exists
    let conversation = currentConversation
    if (!conversation) {
      const { data, error } = await createConversation()
      if (error || !data) {
        console.error('Failed to create conversation:', error)
        return
      }
      conversation = data
      setCurrentConversation(data)
    }

    const userMessage: LocalMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Save user message to database
      await createMessage(conversation.id, 'user', content)

      // Call AI API with current messages including the new user message
      const currentMessages = messages || []
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...currentMessages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()
      
      const assistantMessage: LocalMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message.content,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, assistantMessage])

      // Save assistant message to database
      await createMessage(conversation.id, 'assistant', data.message.content)

      // Update conversation title with first message
      if (messages.length === 0) {
        const title = content.slice(0, 50) + (content.length > 50 ? '...' : '')
        // Update conversation title
        await updateConversation(conversation.id, { title })
      }
    } catch (error) {
      console.error('Error sending message:', error)
      
      const errorMessage: LocalMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your message. Please try again.',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Splash Screen */}
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}

      {/* Mobile Header */}
      {!showSplash && (
        <header className="lg:hidden bg-card border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-40">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <h1 className="text-lg font-semibold text-foreground">AI Chat</h1>
          <div className="w-9" /> {/* Spacer for centering */}
        </header>
      )}

      {/* Main Content */}
      {!showSplash && (
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Hidden on mobile, shown as overlay */}
          <div className={`
            fixed inset-y-0 left-0 z-50 lg:relative lg:z-auto
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            <ResizableSidebar
              onNewChat={handleNewChat}
              onExploreGpts={() => {
                setIsExploreModalOpen(true)
                setIsSidebarOpen(false)
                playSound('click')
              }}
              onSettings={() => {
                setIsSettingsModalOpen(true)
                setIsSidebarOpen(false)
                playSound('click')
              }}
            />
          </div>

          {/* Mobile Overlay */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center p-4">
                  <div className="max-w-lg w-full space-y-6">
                    {/* Welcome Header */}
                    <div className="text-center space-y-2">
                      <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        {user ? t('startNewConversation') : 'Welcome to AI Chat'}
                      </h1>
                      <p className="text-base md:text-xl text-muted-foreground">
                        {user ? t('askAnything') : 'Sign in to start chatting with AI'}
                      </p>
                    </div>

                    {!user && (
                      <div className="text-center">
                        <Button 
                          onClick={() => {
                            setIsAuthModalOpen(true)
                            playSound('click')
                          }} 
                          size="lg"
                          className="w-full max-w-xs"
                        >
                          <LogIn className="w-4 h-4 mr-2" />
                          Sign In to Start Chatting
                        </Button>
                      </div>
                    )}

                    {/* Empty State Cards - Mobile Optimized */}
                    {user && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                        <Card className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardHeader className="text-center">
                            <CardTitle className="flex items-center gap-2 text-lg justify-center">
                              <MessageCircle className="w-5 h-5" />
                              Chat
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="text-center">
                              Start a conversation about anything you're curious about.
                            </CardDescription>
                          </CardContent>
                        </Card>

                        <Card className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardHeader className="text-center">
                            <CardTitle className="flex items-center gap-2 text-lg justify-center">
                              <Sparkles className="w-5 h-5" />
                              Create
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="text-center">
                              Generate creative content, stories, and ideas.
                            </CardDescription>
                          </CardContent>
                        </Card>

                        <Card className="cursor-pointer hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
                          <CardHeader className="text-center">
                            <CardTitle className="flex items-center gap-2 text-lg justify-center">
                              <Bot className="w-5 h-5" />
                              Learn
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="text-center">
                              Get help with learning and understanding complex topics.
                            </CardDescription>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {/* Quick Actions - Mobile Optimized */}
                    {user && (
                      <div className="flex flex-wrap justify-center gap-2 mt-8">
                        <Badge 
                          variant="outline" 
                          className="cursor-pointer hover:bg-muted text-sm px-3 py-1"
                          onClick={() => playSound('click')}
                        >
                          "Explain quantum computing"
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className="cursor-pointer hover:bg-muted text-sm px-3 py-1"
                          onClick={() => playSound('click')}
                        >
                          "Write a poem about nature"
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className="cursor-pointer hover:bg-muted text-sm px-3 py-1"
                          onClick={() => playSound('click')}
                        >
                          "Help me plan a trip"
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className="cursor-pointer hover:bg-muted text-sm px-3 py-1"
                          onClick={() => playSound('click')}
                        >
                          "Code a simple website"
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4 p-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] md:max-w-[70%] rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm break-words">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[85%] md:max-w-[70%] rounded-lg p-3 bg-muted">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Input Area - Mobile Optimized */}
            <div className="border-t border-border bg-card p-4">
              <InputArea 
                onSendMessage={handleSendMessage} 
                disabled={isLoading || !user} 
              />
            </div>
          </div>
        </div>
      )}

      {/* User Profile in Sidebar */}
      {user && !showSplash && <UserProfile />}

      {/* Sidebar Resize Help */}
      {user && !showSplash && <SidebarResizeHelp />}

      {/* Modals */}
      {!showSplash && (
        <>
          <ExploreModal
            isOpen={isExploreModalOpen}
            onClose={() => {
              setIsExploreModalOpen(false)
              playSound('click')
            }}
          />
          <SettingsModal
            isOpen={isSettingsModalOpen}
            onClose={() => {
              setIsSettingsModalOpen(false)
              playSound('click')
            }}
          />
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => {
              setIsAuthModalOpen(false)
              playSound('click')
            }}
          />
          <EmailVerificationModal
            isOpen={isEmailVerificationOpen}
            onClose={() => {
              setIsEmailVerificationOpen(false)
              playSound('click')
            }}
            email={user?.email}
          />
        </>
      )}
    </div>
  )
}
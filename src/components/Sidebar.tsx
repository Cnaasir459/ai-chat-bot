'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { MessageSquarePlus, Compass, Settings, Plus, LogIn } from 'lucide-react'
import { useTranslation } from '@/lib/translations'
import { useAuth } from '@/contexts/AuthContext'

interface SidebarProps {
  onNewChat: () => void
  onExploreGpts: () => void
  onSettings: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ onNewChat, onExploreGpts, onSettings }) => {
  const { t } = useTranslation()
  const { user } = useAuth()

  return (
    <div className="w-64 h-full bg-background border-r border-border flex flex-col">
      <div className="p-4">
        <Button 
          onClick={onNewChat}
          className="w-full justify-start gap-2"
          variant="outline"
        >
          <Plus className="w-4 h-4" />
          {t('newChat')}
        </Button>
      </div>
      
      <Separator />
      
      <div className="flex-1 p-4">
        <div className="space-y-2">
          <Button 
            onClick={onExploreGpts}
            className="w-full justify-start gap-2"
            variant="ghost"
          >
            <Compass className="w-4 h-4" />
            {t('exploreGpts')}
          </Button>
          
          <Button 
            onClick={onSettings}
            className="w-full justify-start gap-2"
            variant="ghost"
          >
            <Settings className="w-4 h-4" />
            {t('settings')}
          </Button>
        </div>
      </div>
      
      <Separator />
      
      <div className="p-4">
        {user ? (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Signed In
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-xs">
                Ready to chat with AI
              </CardDescription>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{t('startNewConversation')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-xs mb-3">
                Sign in to save your chat history
              </CardDescription>
              <Button size="sm" className="w-full" onClick={onNewChat}>
                <LogIn className="w-3 h-3 mr-1" />
                Sign In
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
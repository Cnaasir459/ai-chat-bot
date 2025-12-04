'use client'

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Volume2, Globe, Mic, Languages } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTranslation } from '@/lib/translations'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { language, toggleLanguage } = useLanguage()
  const { t } = useTranslation()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('settingsTitle')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Volume2 className="w-4 h-4" />
                {t('speech')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div 
                className="flex items-center justify-between cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
                onClick={toggleLanguage}
              >
                <div className="flex items-center gap-2">
                  <Languages className="w-4 h-4" />
                  <Label htmlFor="language" className="cursor-pointer">
                    {t('mainLanguage')}
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {language === 'en' ? t('english') : t('somali')}
                  </span>
                  <Switch
                    id="language"
                    checked={language === 'so'}
                    onCheckedChange={toggleLanguage}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Separator />
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              {t('close')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
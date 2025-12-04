'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Star, Clock, TrendingUp, Compass } from 'lucide-react'
import { useTranslation } from '@/lib/translations'

interface GPTItem {
  id: string
  name: string
  description: string
  category: string
  rating: number
  uses: string
}

interface ExploreModalProps {
  isOpen: boolean
  onClose: () => void
}

const mockGPTs: GPTItem[] = [
  {
    id: '1',
    name: 'Code Assistant',
    description: 'Help with programming and code review',
    category: 'Development',
    rating: 4.8,
    uses: '10K+'
  },
  {
    id: '2',
    name: 'Language Tutor',
    description: 'Learn new languages with AI assistance',
    category: 'Education',
    rating: 4.9,
    uses: '5K+'
  },
  {
    id: '3',
    name: 'Creative Writer',
    description: 'Generate creative content and stories',
    category: 'Creative',
    rating: 4.7,
    uses: '8K+'
  }
]

export const ExploreModal: React.FC<ExploreModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredGPTs = mockGPTs.filter(gpt =>
    gpt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gpt.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Compass className="w-5 h-5" />
            {t('exploreGptsTitle')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('searchGpts')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGPTs.length > 0 ? (
              filteredGPTs.map((gpt) => (
                <Card key={gpt.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{gpt.name}</CardTitle>
                      <Badge variant="secondary">{gpt.category}</Badge>
                    </div>
                    <CardDescription>{gpt.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{gpt.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>{gpt.uses} uses</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                {t('noGptsFound')}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
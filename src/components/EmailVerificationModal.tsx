'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, CheckCircle, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from '@/lib/translations'

interface EmailVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  email?: string
}

export const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({ 
  isOpen, 
  onClose, 
  email 
}) => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [resent, setResent] = useState(false)

  const handleResendVerification = async () => {
    if (!email) return
    
    setLoading(true)
    setResent(false)
    
    try {
      // This would call Supabase to resend verification email
      // For now, simulate the action
      await new Promise(resolve => setTimeout(resolve, 1000))
      setResent(true)
      setTimeout(() => setResent(false), 3000)
    } catch (error) {
      console.error('Failed to resend verification email:', error)
    } finally {
      setLoading(false)
    }
  }

  const isEmailVerified = user?.email_confirmed_at

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Email Verification</DialogTitle>
        </DialogHeader>
        
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              {isEmailVerified ? (
                <CheckCircle className="w-16 h-16 text-green-500" />
              ) : (
                <Mail className="w-16 h-16 text-primary" />
              )}
            </div>
            <CardTitle className="text-lg">
              {isEmailVerified ? 'Email Verified!' : 'Verify Your Email'}
            </CardTitle>
            <CardDescription>
              {isEmailVerified 
                ? 'Your email address has been successfully verified. You can now use all features of the application.'
                : `We've sent a verification email to ${email || 'your email address'}. Please check your inbox and click the verification link to continue.`
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isEmailVerified && (
              <>
                <Alert>
                  <Mail className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Check your spam folder</strong> if you don't see the email in your inbox.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the email?
                  </p>
                  <Button 
                    onClick={handleResendVerification}
                    disabled={loading || resent}
                    className="w-full"
                    variant="outline"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : resent ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Email Sent!
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Resend Verification
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
            
            {isEmailVerified && (
              <Button onClick={onClose} className="w-full">
                Continue to App
              </Button>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
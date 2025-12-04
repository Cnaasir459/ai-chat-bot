'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session after OAuth callback
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          setError(error.message)
        } else if (session) {
          setSuccess(true)
          // Redirect to main app after a short delay
          setTimeout(() => {
            router.push('/')
          }, 2000)
        } else {
          setError('No session found. Please try signing in again.')
        }
      } catch (err) {
        setError('An error occurred during authentication.')
      } finally {
        setLoading(false)
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {loading && <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />}
          {success && <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />}
          {error && <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />}
          
          <CardTitle className="text-lg">
            {loading && 'Completing Authentication...'}
            {success && 'Authentication Successful!'}
            {error && 'Authentication Failed'}
          </CardTitle>
          
          <CardDescription>
            {loading && 'Please wait while we complete your authentication.'}
            {success && 'You have been successfully authenticated. Redirecting to the application...'}
            {error && error}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center">
          {error && (
            <Button onClick={() => router.push('/')} className="w-full">
              Back to Sign In
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
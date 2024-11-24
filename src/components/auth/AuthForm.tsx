import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MailCheck } from 'lucide-react'

export function AuthForm() {
  const { signIn, signUp, loading, resendVerificationEmail, resetPassword } = useStore()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [formError, setFormError] = useState('')
  const [showVerification, setShowVerification] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setShowVerification(false)
    setVerificationSent(false)

    try {
      if (isSignUp) {
        if (!name.trim()) {
          setFormError('Name is required')
          return
        }
        if (password.length < 6) {
          setFormError('Password must be at least 6 characters')
          return
        }
        await signUp(email, password, name)
        setShowVerification(true)
        setVerificationSent(true)
      } else {
        await signIn(email, password)
      }
    } catch (err: any) {
      if (err.message === 'Please verify your email before signing in') {
        setShowVerification(true)
      } else {
        const errorMessage = err.code === 'auth/invalid-credential' 
          ? 'Invalid email or password'
          : err.code === 'auth/email-already-in-use'
          ? 'Email is already registered'
          : err.message || 'An error occurred. Please try again.'
        setFormError(errorMessage)
      }
    }
  }

  const handleResendVerification = async () => {
    try {
      await resendVerificationEmail()
      setVerificationSent(true)
      setFormError('')
    } catch (err) {
      setFormError('Failed to send verification email. Please try again.')
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setResetSent(false)

    if (!email.trim()) {
      setFormError('Please enter your email address')
      return
    }

    try {
      await resetPassword(email)
      setResetSent(true)
    } catch (err: any) {
      setFormError(err.message || 'Failed to send password reset email. Please try again.')
    }
  }

  if (showResetPassword) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-sm space-y-4 p-4">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
              <CardDescription className="text-center">
                Enter your email to receive a password reset link
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                  />
                </div>

                {resetSent && (
                  <Alert>
                    <MailCheck className="h-4 w-4" />
                    <AlertDescription>
                      Password reset email sent. Please check your inbox.
                    </AlertDescription>
                  </Alert>
                )}

                {formError && (
                  <p className="text-sm text-red-500 text-center">{formError}</p>
                )}

                <div className="space-y-2">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setShowResetPassword(false)
                      setFormError('')
                      setResetSent(false)
                    }}
                  >
                    Back to Sign In
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (showVerification) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-sm space-y-4 p-4">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Verify Your Email</CardTitle>
              <CardDescription className="text-center">
                Please check your email to verify your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <MailCheck className="h-4 w-4" />
                <AlertDescription>
                  A verification email has been sent to {email}
                </AlertDescription>
              </Alert>

              {verificationSent && (
                <Alert>
                  <AlertDescription>
                    A new verification email has been sent. Please check your inbox.
                  </AlertDescription>
                </Alert>
              )}

              {formError && (
                <p className="text-sm text-red-500 text-center">{formError}</p>
              )}

              <div className="space-y-2">
                <Button
                  type="button"
                  className="w-full"
                  onClick={handleResendVerification}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Resend Verification Email'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setShowVerification(false)
                    setVerificationSent(false)
                    setFormError('')
                  }}
                >
                  Back to Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4 p-4">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">TipJar</CardTitle>
            <CardDescription className="text-center">
              {isSignUp ? 'Create an account' : 'Sign in to your account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={isSignUp ? 'signup' : 'signin'} onValueChange={(v) => {
              setIsSignUp(v === 'signup')
              setFormError('')
              setShowVerification(false)
              setEmail('')
              setPassword('')
              setName('')
            }}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={isSignUp}
                      placeholder="Enter your name"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder={isSignUp ? 'Create a password (min. 6 characters)' : 'Enter your password'}
                    minLength={6}
                  />
                </div>

                {formError && (
                  <p className="text-sm text-red-500 text-center">{formError}</p>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
                </Button>

                {!isSignUp && (
                  <Button
                    type="button"
                    variant="link"
                    className="w-full"
                    onClick={() => {
                      setShowResetPassword(true)
                      setFormError('')
                    }}
                  >
                    Forgot password?
                  </Button>
                )}
              </form>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, Mail, Lock, AlertCircle, CheckCircle2, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { account } from "@/lib/appwrite"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Email provider mapping
const getEmailProviderUrl = (email: string): string | null => {
  const domain = email.split("@")[1]?.toLowerCase()

  const providers: Record<string, string> = {
    "gmail.com": "https://mail.google.com",
    "googlemail.com": "https://mail.google.com",
    "yahoo.com": "https://mail.yahoo.com",
    "yahoo.co.uk": "https://mail.yahoo.com",
    "yahoo.ca": "https://mail.yahoo.com",
    "yahoo.com.au": "https://mail.yahoo.com",
    "outlook.com": "https://outlook.live.com",
    "hotmail.com": "https://outlook.live.com",
    "live.com": "https://outlook.live.com",
    "msn.com": "https://outlook.live.com",
    "aol.com": "https://mail.aol.com",
    "icloud.com": "https://www.icloud.com/mail",
    "me.com": "https://www.icloud.com/mail",
    "mac.com": "https://www.icloud.com/mail",
    "protonmail.com": "https://mail.protonmail.com",
    "proton.me": "https://mail.protonmail.com",
    "zoho.com": "https://mail.zoho.com",
    "yandex.com": "https://mail.yandex.com",
    "mail.com": "https://www.mail.com",
  }

  return providers[domain] || null
}

// Common email providers for fallback
const commonProviders = [
  { name: "Gmail", url: "https://mail.google.com", icon: "📧" },
  { name: "Outlook", url: "https://outlook.live.com", icon: "📨" },
  { name: "Yahoo", url: "https://mail.yahoo.com", icon: "📬" },
  { name: "Zoho", url: "https://mail.zoho.com", icon: "📮" },
  { name: "ProtonMail", url: "https://mail.protonmail.com", icon: "🔒" },
  { name: "iCloud", url: "https://www.icloud.com/mail", icon: "☁️" },
]

export default function PasswordRecoveryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Forgot password state
  const [email, setEmail] = useState("")
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [emailProviderUrl, setEmailProviderUrl] = useState<string | null>(null)
  const [showProviderOptions, setShowProviderOptions] = useState(false)

  // Reset password state
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Determine if we're in reset mode based on URL parameters
  const userId = searchParams.get("userId")
  const secret = searchParams.get("secret")
  const isResetMode = !!(userId && secret)

  useEffect(() => {
    if (isResetMode && (!userId || !secret)) {
      setError("Invalid or expired password reset link")
    }
  }, [userId, secret, isResetMode])

  const openEmailProvider = (url?: string) => {
    const targetUrl = url || emailProviderUrl
    if (targetUrl) {
      window.open(targetUrl, "_blank", "noopener,noreferrer")
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // URL to this same page (for reset password functionality)
      const redirectUrl = `${window.location.origin}/auth/password-recovery`

      await account.createRecovery(email, redirectUrl)

      // Get email provider URL
      const providerUrl = getEmailProviderUrl(email)
      setEmailProviderUrl(providerUrl)

      setIsEmailSent(true)
      setSuccess(true)

      // Auto-open email provider after a short delay if we can detect it
      if (providerUrl) {
        setTimeout(() => {
          window.open(providerUrl, "_blank", "noopener,noreferrer")
        }, 1000)
      } else {
        // If we can't detect the provider, show options after a delay
        setTimeout(() => {
          setShowProviderOptions(true)
        }, 1500)
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "Failed to send recovery email. Please try again.")
      } else {
        setError("An unknown error occurred.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const validateResetForm = () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return false
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return false
    }

    return true
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateResetForm() || !userId || !secret) {
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await account.updateRecovery(userId, secret, password)
      setSuccess(true)

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/auth/login")
      }, 2000)
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "Failed to reset password. Please try again.")
      } else {
        setError("Failed to reset password. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-gray-50">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="text-primary font-bold text-3xl flex items-center">
                <svg viewBox="0 0 24 24" width="32" height="32" className="mr-2">
                  <circle cx="12" cy="12" r="10" fill="#00a19b" />
                  <circle cx="12" cy="12" r="4" fill="white" />
                </svg>
                pulsehub
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
                {isResetMode ? "Reset Password" : "Forgot Password"}
              </h2>
              <p className="text-gray-500 text-center mb-6">
                {isResetMode
                    ? "Create a new password for your account"
                    : isEmailSent
                        ? "Check your email for reset instructions"
                        : "Enter your email to receive a password reset link"}
              </p>

              {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
              )}

              {success && isResetMode && (
                  <Alert className="mb-4 border-green-500 text-green-500">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>Password has been reset successfully! Redirecting to login...</AlertDescription>
                  </Alert>
              )}

              {isResetMode ? (
                  // Reset Password Form
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                        New Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 py-2 bg-gray-50 border border-gray-300"
                            required
                            disabled={success}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pl-10 py-2 bg-gray-50 border border-gray-300"
                            required
                            disabled={success}
                        />
                      </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-white"
                        disabled={isLoading || success}
                    >
                      {isLoading ? "Resetting..." : "Reset Password"}
                    </Button>
                  </form>
              ) : !isEmailSent ? (
                  // Forgot Password Form
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 py-2 bg-gray-50 border border-gray-300"
                            required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" disabled={isLoading}>
                      {isLoading ? "Sending..." : "Send Reset Link"}
                    </Button>
                  </form>
              ) : (
                  // Email Sent Confirmation
                  <div className="text-center space-y-4 py-4">
                    <Alert className="mb-4 border-green-500 text-green-500">
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertDescription>Recovery email sent successfully!</AlertDescription>
                    </Alert>
                    <p className="text-gray-600">
                      We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the
                      instructions.
                    </p>

                    {emailProviderUrl ? (
                        // Direct provider link
                        <Button
                            onClick={() => openEmailProvider()}
                            variant="outline"
                            className="mt-4 border-primary text-primary hover:bg-primary hover:text-white"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Open Email
                        </Button>
                    ) : (
                        // Show provider options for custom domains
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-3">Choose your email provider:</p>
                          <div className="grid grid-cols-2 gap-2">
                            {commonProviders.map((provider) => (
                                <Button
                                    key={provider.name}
                                    onClick={() => openEmailProvider(provider.url)}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs border-gray-300 hover:border-primary hover:text-primary"
                                >
                                  <span className="mr-1">{provider.icon}</span>
                                  {provider.name}
                                </Button>
                            ))}
                          </div>
                        </div>
                    )}

                    <Button
                        variant="outline"
                        onClick={() => setIsEmailSent(false)}
                        className="mt-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Try another email
                    </Button>
                  </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-center">
              <Link href="/auth/login" className="flex items-center text-sm text-primary hover:underline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </main>
  )
}

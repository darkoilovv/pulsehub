"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { account } from "@/lib/appwrite"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const userId = searchParams.get("userId")
  const secret = searchParams.get("secret")

  useEffect(() => {
    if (!userId || !secret) {
      setError("Invalid or expired password reset link")
    }
  }, [userId, secret])

  const validateForm = () => {
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

    if (!validateForm() || !userId || !secret) {
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await account.updateRecovery(userId, secret, password)

      setSuccess(true)
      router.push("/auth/login")
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
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>Create a new password for your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleResetPassword}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-500 text-green-500">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>Password has been reset successfully! Redirecting to login...</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={!userId || !secret || success}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={!userId || !secret || success}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading || !userId || !secret || success}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
            <div className="text-center text-sm">
              <Link href="/auth/login" className="font-medium text-primary underline-offset-4 hover:underline">
                Back to login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

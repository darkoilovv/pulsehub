"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ID } from "appwrite"
import { account, databases } from "@/lib/appwrite"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    setIsLoading(true);
    setError("");
  
    try {
      const user = await account.create(ID.unique(), email, password, name);
      console.log('User Created:', user);
  
      const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID; 
      const collectionId = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID;
      if (!databaseId || !collectionId) {
        throw new Error("Appwrite database or collection ID is not defined");
      }
  
      const userData = {
        name,
        email,
        userId: user.$id
      };
  
      const document = await databases.createDocument(
        databaseId,
        collectionId,
        ID.unique(), 
        userData,
      );
      
      console.log('User Document Created:', document);
  
      await account.createEmailPasswordSession(email, password);
      const sessions = await account.listSessions();
      console.log('Session Info:', sessions);
  
      if (sessions.total > 1) {
        sessions.sessions.forEach(async (session) => {
          if (session.$id !== sessions.sessions[0].$id) {
            await account.deleteSession(session.$id);
          }
        });
      }
  
      router.push("/dashboard");
    } catch (error) {
      console.error('Registration Error:', error);
      if (error instanceof Error) {
        setError(error.message || "Failed to register. Please try again.");
      } else {
        setError("Failed to register. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Enter your information to create a PulseHub account</CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 mt-5">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Register"}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-medium text-primary underline-offset-4 hover:underline">
                Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Mail, Lock, User, AlertCircle, Building2, Eye, EyeOff, Check, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { account } from "@/lib/appwrite"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createJWT } from "@/app/actions/createJWT"
import { setJwtCookie } from "@/app/actions/setJwtCookie"
import { ID } from "appwrite"
import Image from "next/image";

interface PasswordStrength {
    hasMinLength: boolean
    hasUppercase: boolean
    hasLowercase: boolean
    hasNumber: boolean
    hasSpecialChar: boolean
    score: number
}

export default function AuthPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showRegisterPassword, setShowRegisterPassword] = useState(false)

    // Login form state
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")

    // Register form state
    const [registerEmail, setRegisterEmail] = useState("")
    const [registerPassword, setRegisterPassword] = useState("")
    const [registerName, setRegisterName] = useState("")
    const [userType, setUserType] = useState<"individual" | "business">("individual")
    const [companyName, setCompanyName] = useState("")
    const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
        hasMinLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false,
        score: 0,
    })
    const [confirmPassword, setConfirmPassword] = useState("")

    // Password strength validation
    const validatePassword = (password: string): PasswordStrength => {
        const hasMinLength = password.length >= 8
        const hasUppercase = /[A-Z]/.test(password)
        const hasLowercase = /[a-z]/.test(password)
        const hasNumber = /\d/.test(password)
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

        const score = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecialChar].filter(Boolean).length

        return {
            hasMinLength,
            hasUppercase,
            hasLowercase,
            hasNumber,
            hasSpecialChar,
            score,
        }
    }

    useEffect(() => {
        setPasswordStrength(validatePassword(registerPassword))
    }, [registerPassword])

    // Form validation
    const validateRegistrationForm = () => {
        if (!registerName.trim()) {
            setError("Full name is required")
            return false
        }

        if (!registerEmail.trim()) {
            setError("Email is required")
            return false
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerEmail)) {
            setError("Please enter a valid email address")
            return false
        }

        if (passwordStrength.score < 4) {
            setError("Password does not meet security requirements")
            return false
        }

        if (registerPassword !== confirmPassword) {
            setError("Passwords do not match")
            return false
        }

        if (userType === "business" && !companyName.trim()) {
            setError("Company name is required for business accounts")
            return false
        }

        return true
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        setSuccess("")

        try {
            try {
                await account.deleteSession("current")
            } catch (error) {
                console.log("error",error)
            }

            await account.createEmailPasswordSession(loginEmail, loginPassword)

            const jwt = await createJWT()

            if (!jwt) throw new Error("JWT creation failed")

            await setJwtCookie(jwt)

            router.push("/dashboard")
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.message.includes("Invalid credentials")) {
                    setError("Invalid email or password. Please try again.")
                } else if (error.message.includes("too many requests")) {
                    setError("Too many login attempts. Please try again later.")
                } else {
                    setError(error.message || "Failed to login. Please check your credentials.")
                }
            } else {
                setError("An unknown error occurred.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        setSuccess("")

        if (!validateRegistrationForm()) {
            setIsLoading(false)
            return
        }

        try {
            await account.create(ID.unique(), registerEmail, registerPassword, registerName)
            await account.createEmailPasswordSession(registerEmail, registerPassword)

            const jwt = await createJWT()
            if (!jwt) throw new Error("JWT creation failed")
            await setJwtCookie(jwt)

            try {
                const user = await account.get()
                if (!user.emailVerification) {
                    setSuccess("Account created successfully! Please check your email for verification.")
                    setTimeout(() => router.push("/dashboard"), 3000)
                } else {
                    router.push("/dashboard")
                }
            } catch {
                router.push("/dashboard")
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.message.includes("user with the same email already exists")) {
                    setError("An account with this email already exists. Please use a different email or try logging in.")
                } else if (error.message.includes("Password must be")) {
                    setError("Password does not meet the requirements. Please choose a stronger password.")
                } else {
                    setError(error.message || "Failed to create account. Please try again.")
                }
            } else {
                setError("An unknown error occurred.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const getPasswordStrengthColor = (score: number) => {
        if (score < 2) return "bg-red-500"
        if (score < 4) return "bg-yellow-500"
        return "bg-green-500"
    }

    const getPasswordStrengthText = (score: number) => {
        if (score < 2) return "Weak"
        if (score < 4) return "Medium"
        return "Strong"
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-gray-50 dark:bg-background">
            <div className="w-full max-w-md mx-auto">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="text-primary font-bold text-3xl flex items-center">
                            <Image
                                src="/logo.png"
                                width={350}
                                height={50}
                                alt="Pulsehub Logo"
                                priority
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-card rounded-lg shadow-md dark:shadow-lg dark:shadow-black/20 overflow-hidden border dark:border-border">
                    <div className="p-6">
                        <Tabs defaultValue="login" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="login" className="text-sm">
                                    Login
                                </TabsTrigger>
                                <TabsTrigger value="register" className="text-sm">
                                    Register
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="login">
                                <form onSubmit={handleLogin} className="space-y-4">
                                    {error && (
                                        <Alert variant="destructive">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>{error}</AlertDescription>
                                        </Alert>
                                    )}

                                    <div className="space-y-2">
                                        <Label htmlFor="login-email" className="text-sm font-medium text-gray-700 dark:text-foreground">
                                            Email
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-muted-foreground" />
                                            <Input
                                                id="login-email"
                                                type="email"
                                                placeholder="you@example.com"
                                                value={loginEmail}
                                                onChange={(e) => setLoginEmail(e.target.value)}
                                                className="pl-10 py-2 bg-gray-50 dark:bg-background border border-gray-300 dark:border-border"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label
                                                htmlFor="login-password"
                                                className="text-sm font-medium text-gray-700 dark:text-foreground"
                                            >
                                                Password
                                            </Label>
                                            <Link href="/auth/password-recovery" className="text-xs text-primary hover:underline">
                                                Forgot password?
                                            </Link>
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-muted-foreground" />
                                            <Input
                                                id="login-password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={loginPassword}
                                                onChange={(e) => setLoginPassword(e.target.value)}
                                                className="pl-10 pr-10 py-2 bg-gray-50 dark:bg-background border border-gray-300 dark:border-border"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-3 h-4 w-4 text-gray-400 dark:text-muted-foreground hover:text-gray-600 dark:hover:text-foreground"
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-primary hover:bg-primary/90 text-white"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Logging in..." : "Login"}
                                        {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="register">
                                <form onSubmit={handleRegister} className="space-y-4">
                                    {error && (
                                        <Alert variant="destructive">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>{error}</AlertDescription>
                                        </Alert>
                                    )}

                                    {success && (
                                        <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                                            <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                                            <AlertDescription className="text-green-800 dark:text-green-200">{success}</AlertDescription>
                                        </Alert>
                                    )}

                                    {/* User Type Selection - Improved Design */}
                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-foreground">
                                            Choose Account Type
                                        </Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div
                                                className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                                                    userType === "individual"
                                                        ? "border-primary bg-primary/5 shadow-sm"
                                                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                                }`}
                                                onClick={() => setUserType("individual")}
                                            >
                                                <div className="flex flex-col items-center text-center space-y-2">
                                                    <div
                                                        className={`p-2 rounded-full ${userType === "individual" ? "bg-primary/10" : "bg-gray-100 dark:bg-gray-800"}`}
                                                    >
                                                        <User
                                                            className={`h-5 w-5 ${userType === "individual" ? "text-primary" : "text-gray-600 dark:text-gray-400"}`}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div
                                                            className={`font-medium text-sm ${userType === "individual" ? "text-primary" : "text-gray-900 dark:text-gray-100"}`}
                                                        >
                                                            Individual
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Personal account</div>
                                                    </div>
                                                </div>
                                                {userType === "individual" && (
                                                    <div className="absolute top-2 right-2">
                                                        <Check className="h-4 w-4 text-primary" />
                                                    </div>
                                                )}
                                            </div>

                                            <div
                                                className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                                                    userType === "business"
                                                        ? "border-primary bg-primary/5 shadow-sm"
                                                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                                }`}
                                                onClick={() => setUserType("business")}
                                            >
                                                <div className="flex flex-col items-center text-center space-y-2">
                                                    <div
                                                        className={`p-2 rounded-full ${userType === "business" ? "bg-primary/10" : "bg-gray-100 dark:bg-gray-800"}`}
                                                    >
                                                        <Building2
                                                            className={`h-5 w-5 ${userType === "business" ? "text-primary" : "text-gray-600 dark:text-gray-400"}`}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div
                                                            className={`font-medium text-sm ${userType === "business" ? "text-primary" : "text-gray-900 dark:text-gray-100"}`}
                                                        >
                                                            Business
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Company account</div>
                                                    </div>
                                                </div>
                                                {userType === "business" && (
                                                    <div className="absolute top-2 right-2">
                                                        <Check className="h-4 w-4 text-primary" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="register-name" className="text-sm font-medium text-gray-700 dark:text-foreground">
                                            Full Name
                                        </Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-muted-foreground" />
                                            <Input
                                                id="register-name"
                                                type="text"
                                                placeholder="Your full name"
                                                value={registerName}
                                                onChange={(e) => setRegisterName(e.target.value)}
                                                className="pl-10 py-2 bg-gray-50 dark:bg-background border border-gray-300 dark:border-border"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Conditional Company Name Field */}
                                    {userType === "business" && (
                                        <div className="space-y-2">
                                            <Label htmlFor="company-name" className="text-sm font-medium text-gray-700 dark:text-foreground">
                                                Company Name
                                            </Label>
                                            <div className="relative">
                                                <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-muted-foreground" />
                                                <Input
                                                    id="company-name"
                                                    type="text"
                                                    placeholder="Your company name"
                                                    value={companyName}
                                                    onChange={(e) => setCompanyName(e.target.value)}
                                                    className="pl-10 py-2 bg-gray-50 dark:bg-background border border-gray-300 dark:border-border"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label htmlFor="register-email" className="text-sm font-medium text-gray-700 dark:text-foreground">
                                            Email
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-muted-foreground" />
                                            <Input
                                                id="register-email"
                                                type="email"
                                                placeholder="you@example.com"
                                                value={registerEmail}
                                                onChange={(e) => setRegisterEmail(e.target.value)}
                                                className="pl-10 py-2 bg-gray-50 dark:bg-background border border-gray-300 dark:border-border"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="register-password"
                                            className="text-sm font-medium text-gray-700 dark:text-foreground"
                                        >
                                            Password
                                        </Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-muted-foreground" />
                                            <Input
                                                id="register-password"
                                                type={showRegisterPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={registerPassword}
                                                onChange={(e) => setRegisterPassword(e.target.value)}
                                                className="pl-10 pr-10 py-2 bg-gray-50 dark:bg-background border border-gray-300 dark:border-border"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                                                className="absolute right-3 top-3 h-4 w-4 text-gray-400 dark:text-muted-foreground hover:text-gray-600 dark:hover:text-foreground"
                                            >
                                                {showRegisterPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="confirm-password"
                                            className="text-sm font-medium text-gray-700 dark:text-foreground"
                                        >
                                            Confirm Password
                                        </Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-muted-foreground" />
                                            <Input
                                                id="confirm-password"
                                                type="password"
                                                placeholder="••••••••"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="pl-10 py-2 bg-gray-50 dark:bg-background border border-gray-300 dark:border-border"
                                                required
                                            />
                                        </div>

                                        {/* Password match indicator */}
                                        {confirmPassword && registerPassword && (
                                            <div className="flex items-center space-x-1 text-xs">
                                                {confirmPassword === registerPassword ? (
                                                    <>
                                                        <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                                                        <span className="text-green-600 dark:text-green-400">Passwords match</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <X className="h-3 w-3 text-red-600 dark:text-red-400" />
                                                        <span className="text-red-600 dark:text-red-400">Passwords do not match</span>
                                                    </>
                                                )}
                                            </div>
                                        )}

                                        {/* Compact Password Requirements - only show when password is entered */}
                                        {registerPassword && (
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                                                        <div
                                                            className={`h-1 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength.score)}`}
                                                            style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                            {getPasswordStrengthText(passwordStrength.score)}
                          </span>
                                                </div>

                                                <div className="flex justify-between gap-1 text-xs">
                                                    <div
                                                        className={`flex items-center space-x-1 ${passwordStrength.hasMinLength ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-gray-500"}`}
                                                    >
                                                        {passwordStrength.hasMinLength ? <Check className="h-2 w-2" /> : <X className="h-2 w-2" />}
                                                        <span>8+ chars</span>
                                                    </div>
                                                    <div
                                                        className={`flex items-center space-x-1 ${passwordStrength.hasUppercase ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-gray-500"}`}
                                                    >
                                                        {passwordStrength.hasUppercase ? <Check className="h-2 w-2" /> : <X className="h-2 w-2" />}
                                                        <span>Upper</span>
                                                    </div>
                                                    <div
                                                        className={`flex items-center space-x-1 ${passwordStrength.hasLowercase ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-gray-500"}`}
                                                    >
                                                        {passwordStrength.hasLowercase ? <Check className="h-2 w-2" /> : <X className="h-2 w-2" />}
                                                        <span>Lower</span>
                                                    </div>
                                                    <div
                                                        className={`flex items-center space-x-1 ${passwordStrength.hasNumber ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-gray-500"}`}
                                                    >
                                                        {passwordStrength.hasNumber ? <Check className="h-2 w-2" /> : <X className="h-2 w-2" />}
                                                        <span>Number</span>
                                                    </div>
                                                    <div
                                                        className={`flex items-center space-x-1 ${passwordStrength.hasSpecialChar ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-gray-500"}`}
                                                    >
                                                        {passwordStrength.hasSpecialChar ? (
                                                            <Check className="h-2 w-2" />
                                                        ) : (
                                                            <X className="h-2 w-2" />
                                                        )}
                                                        <span>Special</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-primary hover:bg-primary/90 text-white"
                                        disabled={isLoading || passwordStrength.score < 4 || registerPassword !== confirmPassword}
                                    >
                                        {isLoading ? "Creating account..." : "Create account"}
                                        {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 dark:bg-muted/30 border-t border-gray-100 dark:border-border">
                        <p className="text-xs text-center text-gray-500 dark:text-muted-foreground">
                            By continuing, you agree to our{" "}
                            <Link href="#" className="text-primary hover:underline">
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link href="#" className="text-primary hover:underline">
                                Privacy Policy
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}

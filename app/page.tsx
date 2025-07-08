import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <ThemeToggle />
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">PulseHub</h1>
          <p className="text-muted-foreground">Your subscription management portal</p>
        </div>
        <div className="flex flex-col space-y-4">
          <Button asChild size="lg" className="w-full">
            <Link href="/auth/login">Login</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}


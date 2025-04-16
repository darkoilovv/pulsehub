"use client"

import { Bell, Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSidebar } from "@/components/sidebar-provider"
import { ThemeToggle } from "@/components/theme-toggle"

export function MainNav() {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="sticky top-0 z-30 flex h-[65.3px] items-center gap-4 border-b bg-background px-6">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-md">
          <form>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search..." className="w-full bg-background pl-8" />
            </div>
          </form>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
      </div>
    </header>
  )
}

"use client"

import { Bell, PanelLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"

interface MainNavProps {
    onToggleSidebar?: () => void
}

export function MainNav({ onToggleSidebar }: MainNavProps) {
    return (
        <header className="sticky top-0 z-30 flex h-[65.3px] items-center gap-4 border-b bg-background px-6">
            {onToggleSidebar && (
                <Button variant="ghost" size="icon" className="h-7 w-7 cursor-pointer" onClick={onToggleSidebar}>
                    <PanelLeft className="h-4 w-4" />
                    <span className="sr-only">Toggle Sidebar</span>
                </Button>
            )}

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

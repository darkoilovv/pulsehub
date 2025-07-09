"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, User, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { account } from "@/lib/appwrite"
import { getRoutes } from "@/lib/routes"
import { clearJwt } from "@/app/actions/clearJwt"
import Image from "next/image";

interface SidebarProps {
    isCollapsed: boolean
    onToggle: () => void
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
    const pathname = usePathname()
    const routes = getRoutes(pathname)
    const router = useRouter()
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const checkSession = async () => {
            try {
                const session = await account.get()
                setUser(session)
            } catch (error) {
                console.log("error", error)
                router.push("/auth/login")
            }
        }

        checkSession()
    }, [router])

    const handleLogout = async () => {
        try {
            await clearJwt()
            router.push("/auth/login")
            await account.deleteSession("current")
        } catch (error) {
            console.error("Logout failed", error)
            router.push("/auth/login")
        }
    }

    return (
        <>
            {/* Mobile overlay */}
            {!isCollapsed && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onToggle} />}

            {/* Sidebar */}
            <div
                className={cn(
                    "fixed left-0 top-0 z-50 h-screen bg-background border-r transition-transform duration-300 ease-in-out flex flex-col",
                    isCollapsed ? "-translate-x-full" : "translate-x-0",
                    "w-64",
                )}
            >
                {/* Header with close button on mobile */}
                <div className="p-4 border-b h-[65px]">
                    <div className="text-primary flex items-center justify-center">
                        <div className="text-primary font-bold text-xl flex items-center gap-1.5 mb-0.5 mt-0.5">
                            <Image
                                src="/logo.png"
                                width={200}
                                height={50}
                                alt="Pulsehub Logo"
                                priority
                            />
                        </div>
                        <Button variant="ghost" size="icon" className="md:hidden h-8 w-8" onClick={onToggle}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <ScrollArea className="flex-1 py-2">
                    {/*<nav className="grid gap-1">*/}
                    {/*    {routes.map((route) => (*/}
                    {/*        <Link*/}
                    {/*            key={route.href}*/}
                    {/*            href={route.href}*/}
                    {/*                className={`flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100 transition-colors ${*/}
                    {/*                route.active ? "bg-primary text-white hover:bg-primary/90" : "text-gray-700"*/}
                    {/*            }`}*/}
                    {/*            onClick={() => {*/}
                    {/*                // Close sidebar on mobile when clicking a link*/}
                    {/*                if (window.innerWidth < 768) {*/}
                    {/*                    onToggle()*/}
                    {/*                }*/}
                    {/*            }}*/}
                    {/*        >*/}
                    {/*            <route.icon className="h-4 w-4" />*/}
                    {/*            {route.label}*/}
                    {/*        </Link>*/}
                    {/*    ))}*/}
                    {/*</nav>*/}
                    <nav className="grid gap-1 px-2">
                        {routes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 transition-colors",
                                    route.active ? "bg-primary text-white hover:bg-primary/90" : "text-gray-700",
                                )}
                            >
                                <route.icon className="h-4 w-4" />
                                {route.label}
                            </Link>
                        ))}
                    </nav>
                </ScrollArea>

                <div className="mt-auto p-4 border-t">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">{user?.name}</p>
                            <p className="text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full justify-start" size="sm" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                    </Button>
                </div>
            </div>
        </>
    )
}

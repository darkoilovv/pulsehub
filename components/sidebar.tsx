"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, User } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { account } from "@/lib/appwrite"
import { getRoutes } from "@/lib/routes"
import { clearJwt } from "@/app/actions/clearJwt"

export function Sidebar() {
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
            console.log("error", error);
          router.push("/auth/login")
        }
      }
  
      checkSession()
    }, [router])

    const handleLogout = async () => {
        try {
            await clearJwt();
            router.push("/auth/login");
        await account.deleteSession('current')
        } catch (error) {
            console.error("Logout failed", error);
            router.push("/auth/login");
        }
    };

    return (
        <div className="group border-r bg-background h-screen w-64 overflow-hidden flex flex-col">
            <div className="p-4 border-b">
                <div className="flex items-center gap-2 font-semibold text-xl">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                        P
                    </div>
                    <span>Pulsehub</span>
                </div>
            </div>
            <ScrollArea className="flex-1 py-2">
                <nav className="grid gap-1 px-2">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                                route.active ? "bg-accent text-accent-foreground" : "transparent",
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
    )
}

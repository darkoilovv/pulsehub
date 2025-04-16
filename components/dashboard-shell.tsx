import type React from "react"
import { MainNav } from "@/components/main-nav"
import { Sidebar } from "@/components/sidebar"

interface DashboardShellProps {
  children: React.ReactNode
}

export default function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <MainNav />
          <main className="flex-1 p-6 md:p-8 pt-6">{children}</main>
        </div>
      </div>
    </div>
  )
}

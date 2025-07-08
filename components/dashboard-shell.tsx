"use client"

import { cn } from "@/lib/utils"
import type React from "react"
import { useState, useEffect } from "react"
import { MainNav } from "@/components/main-nav"
import { Sidebar } from "@/components/sidebar"

interface DashboardShellProps {
  children: React.ReactNode
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize sidebar state from localStorage and screen size
  useEffect(() => {
    const initializeSidebar = () => {
      // Check if there's a saved preference
      const savedState = localStorage.getItem("sidebar-collapsed")

      if (savedState !== null) {
        // Use saved preference
        setSidebarCollapsed(JSON.parse(savedState))
      } else {
        // No saved preference, use screen size
        setSidebarCollapsed(window.innerWidth < 768)
      }

      setIsInitialized(true)
    }

    initializeSidebar()
  }, [])

  // Handle window resize (but don't override user preference)
  useEffect(() => {
    if (!isInitialized) return

    const handleResize = () => {
      // Only auto-collapse on mobile if user hasn't manually set a preference
      if (window.innerWidth < 768 && !sidebarCollapsed) {
        setSidebarCollapsed(true)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isInitialized, sidebarCollapsed])

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed
    setSidebarCollapsed(newState)
    // Save user preference
    localStorage.setItem("sidebar-collapsed", JSON.stringify(newState))
  }

  // Don't render until initialized to prevent flash
  if (!isInitialized) {
    return null
  }

  return (
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1">
          <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />

          {/* Main content area */}
          <div
              className={cn(
                  "flex-1 flex flex-col transition-all duration-300 ease-in-out",
                  !sidebarCollapsed && "md:ml-64",
              )}
          >
            <MainNav onToggleSidebar={toggleSidebar} />
            <main className="flex-1 p-6 md:p-8 pt-6">{children}</main>
          </div>
        </div>
      </div>
  )
}

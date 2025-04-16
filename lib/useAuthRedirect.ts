"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { account } from "@/lib/appwrite"

export default function useAuthRedirect() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await account.get()
        router.replace("/dashboard")
      } catch {
        // Not logged in, do nothing
      }
    }

    checkAuth()
  }, [router])
}

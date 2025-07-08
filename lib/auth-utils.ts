import { account } from "@/lib/appwrite"

export async function ensureNoActiveSession() {
    try {
        // Try to get current session
        await account.getSession("current")
        // If we get here, there's an active session, so delete it
        await account.deleteSession("current")
    } catch (error) {
        // No active session, which is what we want
    }
}

export async function createSessionSafely(email: string, password: string) {
    await ensureNoActiveSession()
    return await account.createEmailPasswordSession(email, password)
}

import * as React from "react"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"

export const useAuth = () => {
    const [isLoading, setIsLoading] = React.useState(false)
    const session = null

    const authenticate = async (provider: "google" | "credentials", values?: any) => {
        setIsLoading(true)
        try {
            if (provider === 'google') {
                const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'
                window.location.href = `${base}/auth/login/google?redirect=${encodeURIComponent('/dashboard')}`
                return { success: true }
            }

            if (provider === 'credentials') {
                const res: any = await authClient.login(values)
                if (res?.success) {
                    toast.success('Welcome back!')
                    window.location.href = '/dashboard'
                    return { success: true }
                }
                toast.error(res?.message || 'Authentication failed')
                return { success: false }
            }

            return { success: false }
        } catch (error: any) {
            toast.error(error?.message || 'Something went wrong')
            return { success: false }
        } finally {
            setIsLoading(false)
        }
    }

    const logout = async () => {
        try {
            await authClient.logout()
            window.location.href = '/login'
        } catch {
            window.location.href = '/login'
        }
    }

    return {
        session,
        status,
        isLoading: isLoading || status === "loading",
        authenticate,
        logout,
    }
}
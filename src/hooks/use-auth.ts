import * as React from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { toast } from "sonner"

export const useAuth = () => {
    const [isLoading, setIsLoading] = React.useState(false)
    const { data: session, status } = useSession()

    const authenticate = async (provider: "google" | "credentials", values?: any) => {
        setIsLoading(true)
        try {
            const result = await signIn(provider, {
                ...values,
                callbackUrl: "/dashboard",
                redirect: false,
            })

            const res: any = result

            if (res?.error) {
                toast.error(res.error || "Authentication failed")
                return { success: false }
            }

            if (res?.ok) {
                toast.success("Welcome back!")
                window.location.href = res.url || "/dashboard"
                return { success: true }
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    const logout = () => signOut({ callbackUrl: "/login" })

    return {
        session,
        status,
        isLoading: isLoading || status === "loading",
        authenticate,
        logout,
    }
}
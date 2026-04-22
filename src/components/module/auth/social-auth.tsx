"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { signIn } from "next-auth/react"

export const SocialAuth = () => {
    const [isLoading, setIsLoading] = React.useState(false)
    React.useEffect(() => {
        try {
            const sp = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
            const err = sp.get('error')
            if (err === 'OAuthSignin' || err === 'OAuthCallback') {
                toast.error('There was a problem logging in with Google. Please try again.')
            }
        } catch (e) {
            // ignore during SSR
        }
    }, [])

    const loginWithGoogle = async () => {
        setIsLoading(true)
        try {
            const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'
            // Redirect to backend social login start which renders a redirector
            const redirectUrl = `${base}/auth/login/google?redirect=${encodeURIComponent('/dashboard')}`
            window.location.href = redirectUrl
        } catch (err) {
            toast.error("Something went wrong with Google Login")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full space-y-4">
            <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                <span className="flex-shrink mx-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Or secure login with
                </span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            </div>

            <button
                type="button"
                onClick={loginWithGoogle}
                disabled={isLoading}
                className="relative group w-full flex items-center justify-center gap-3 h-12 px-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-primary-200 dark:hover:border-primary-900/30 transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
            >

                <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-[20deg] group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />

                {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
                ) : (
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                )}

                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    {isLoading ? "Connecting..." : "Continue with Google"}
                </span>
            </button>
        </div>
    )
}
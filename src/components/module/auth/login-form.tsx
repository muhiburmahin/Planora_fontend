"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Lock, Mail, Loader2, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { SocialAuth } from "@/components/module/auth/social-auth"
import { useRouter } from "next/navigation"

import { loginSchema, LoginInput } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useLoginMutation } from "@/hooks/auth.hooks"

export const LoginForm = () => {
    const router = useRouter()
    const [showPassword, setShowPassword] = React.useState(false)
    const [globalError, setGlobalError] = React.useState<string | null>(null)

    const { mutate: login, isPending } = useLoginMutation();

    const { register, handleSubmit, setFocus, formState: { errors } } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    React.useEffect(() => {
        setFocus("email")
    }, [setFocus])

    const onSubmit = (data: LoginInput) => {
        setGlobalError(null)

        login(data, {
            onSuccess: (res: any) => {
                toast.success(res.message || "Welcome back to Planora!")
                router.push("/dashboard")
            },
            onError: (error: any) => {
                setGlobalError(error)
                toast.error(error)
            }
        })
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
        >
            {globalError && (
                <div
                    role="alert"
                    className="flex items-center gap-2 p-3 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/30 animate-in fade-in slide-in-from-top-1"
                >
                    <AlertCircle size={16} />
                    {globalError}
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">Email Address</Label>
                <div className="relative group">
                    <Mail className={cn(
                        "absolute left-3 top-3.5 h-4 w-4 transition-colors duration-200",
                        errors.email ? "text-red-400" : "text-slate-400 group-focus-within:text-primary-600"
                    )} />
                    <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        className={cn(
                            "pl-10 h-12 rounded-xl border-slate-200 transition-all focus:ring-2",
                            errors.email
                                ? "border-red-500 focus:ring-red-500/20 shadow-sm shadow-red-500/5"
                                : "focus:ring-primary-500/20 focus:border-primary-500"
                        )}
                        placeholder="name@example.com"
                        disabled={isPending}
                        {...register("email")}
                    />
                </div>
                {errors.email && (
                    <p className="text-[11px] font-semibold text-red-500 px-1 animate-in fade-in">
                        {errors.email.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => window.location.href = '/forgot-password'}
                        className="text-xs text-primary-600 font-bold hover:text-primary-700 transition-colors focus:outline-none focus:underline"
                    >
                        Forgot Password?
                    </button>
                </div>
                <div className="relative group">
                    <Lock className={cn(
                        "absolute left-3 top-3.5 h-4 w-4 transition-colors duration-200",
                        errors.password ? "text-red-400" : "text-slate-400 group-focus-within:text-primary-600"
                    )} />
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        className={cn(
                            "pl-10 pr-10 h-12 rounded-xl border-slate-200 transition-all focus:ring-2",
                            errors.password
                                ? "border-red-500 focus:ring-red-500/20"
                                : "focus:ring-primary-500/20 focus:border-primary-500"
                        )}
                        disabled={isPending}
                        {...register("password")}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-slate-400 hover:text-primary-600 transition-colors focus:outline-none"
                        title={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-[11px] font-semibold text-red-500 px-1 animate-in fade-in">
                        {errors.password.message}
                    </p>
                )}
            </div>

            <Button
                type="submit"
                disabled={isPending}
                className={cn(
                    "w-full bg-gradient-primary h-12 rounded-xl text-white font-bold shadow-lg transition-all transform active:scale-[0.98]",
                    isPending ? "opacity-80 cursor-not-allowed" : "hover:shadow-primary-500/25 shadow-primary-500/10"
                )}
            >
                {isPending ? (
                    <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin h-5 w-5" />
                        <span>Authenticating...</span>
                    </div>
                ) : "Sign In to Planora"}
            </Button>

            <SocialAuth />
        </form>
    )
}
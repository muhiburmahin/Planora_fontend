"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { User, Mail, Lock, Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

import { registerSchema, RegisterInput } from "@/lib/validations/auth"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { SocialAuth } from "@/components/module/auth/social-auth"
// useRouter will provide navigation

export const RegisterForm = () => {
    const router = useRouter()
    const [loading, setLoading] = React.useState(false)
    const [showPassword, setShowPassword] = React.useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    })

    const onSubmit = async (data: RegisterInput) => {
        setLoading(true)
        try {
            const res = await authClient.register({ name: data.name, email: data.email, password: data.password })
            // httpClient returns an ApiResponse on success, and throws a customError on failure
            if (res && (res as any).success) {
                toast.success("Account created successfully! Please verify your email.")
                router.push('/login')
            } else {
                // Handle unexpected shape
                const msg = (res as any)?.message || 'Registration failed'
                toast.error(msg)
            }
        } catch (error: any) {
            // httpClient interceptor rejects with { success:false, message, status, errorSources }
            console.error("Register error:", error)
            const message = error?.message || error?.msg || error?.response?.data || JSON.stringify(error)
            toast.error(message || "Failed to register")
        } finally {
            setLoading(false)
        }
    }

    const onInvalid = () => {
        const firstMessage = Object.values(errors)[0]?.message;
        toast.error(firstMessage || "Please fix the highlighted registration fields.");
    };

    return (
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4" noValidate>
            {/* Full Name */}
            <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative group">
                    <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                    <Input
                        id="name"
                        autoComplete="name"
                        className={cn(
                            "pl-10 h-12 rounded-xl border-slate-200 transition-all focus:ring-2 focus:ring-primary-500/20",
                            errors.name && "border-red-500"
                        )}
                        placeholder="John Doe"
                        disabled={loading}
                        {...register("name")}
                    />
                </div>
                {errors.name && <p className="text-[11px] font-medium text-red-500 px-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative group">
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                    <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        className={cn(
                            "pl-10 h-12 rounded-xl border-slate-200 transition-all focus:ring-2 focus:ring-primary-500/20",
                            errors.email && "border-red-500"
                        )}
                        placeholder="email@example.com"
                        disabled={loading}
                        {...register("email")}
                    />
                </div>
                {errors.email && <p className="text-[11px] font-medium text-red-500 px-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative group">
                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        className={cn(
                            "pl-10 h-12 rounded-xl border-slate-200 transition-all focus:ring-2 focus:ring-primary-500/20",
                            errors.password && "border-red-500"
                        )}
                        disabled={loading}
                        {...register("password")}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-slate-400 hover:text-primary-600"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 px-1 mt-1">
                    <ShieldCheck size={12} className="text-green-500" />
                    <span>At least 6 characters with letters & numbers</span>
                </div>
                {errors.password && <p className="text-[11px] font-medium text-red-500 px-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative group">
                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                    <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        className={cn(
                            "pl-10 h-12 rounded-xl border-slate-200 transition-all focus:ring-2 focus:ring-primary-500/20",
                            errors.confirmPassword && "border-red-500"
                        )}
                        disabled={loading}
                        {...register("confirmPassword")}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3.5 text-slate-400 hover:text-primary-600"
                    >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {errors.confirmPassword && <p className="text-[11px] font-medium text-red-500 px-1">{errors.confirmPassword.message}</p>}
            </div>

            <SocialAuth />

            <Button
                disabled={loading}
                className="w-full bg-gradient-primary h-12 rounded-xl text-white font-bold shadow-lg shadow-primary-500/20 transition-all transform active:scale-[0.98]"
            >
                {loading ? (
                    <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin h-5 w-5" />
                        <span>Creating account...</span>
                    </div>
                ) : "Create Account"}
            </Button>
        </form>
    )
}

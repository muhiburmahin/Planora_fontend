"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { forgotPasswordSchema, ForgotPasswordInput } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"

export const ForgotPasswordForm = () => {
    const router = useRouter()
    const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" }
    })

    const onSubmit = async (data: ForgotPasswordInput) => {
        try {
            const res = await authClient.forgetPassword(data.email)
            if (res && (res as any).success) {
                toast.success((res as any).message || 'OTP sent to your email')
                router.push('/reset-password')
            } else {
                toast.error((res as any)?.message || 'Failed to send OTP')
            }
        } catch (err: any) {
            console.error('Forget password error', err)
            toast.error(err?.message || 'Internal Server Error')
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <Button type="submit" className="w-full">Send OTP</Button>
        </form>
    )
}

export default ForgotPasswordForm

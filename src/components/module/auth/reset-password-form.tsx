"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { resetPasswordSchema, ResetPasswordInput } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"

export const ResetPasswordForm = () => {
    const router = useRouter()
    const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { otp: "", newPassword: "" }
    })

    const onSubmit = async (data: ResetPasswordInput) => {
        try {
            const res = await authClient.resetPassword(data.otp, data.newPassword)
            if (res && (res as any).success) {
                toast.success((res as any).message || 'Password reset successful')
                router.push('/login')
            } else {
                toast.error((res as any)?.message || 'Reset failed')
            }
        } catch (err: any) {
            console.error('Reset password error', err)
            toast.error(err?.message || 'Internal Server Error')
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <Label htmlFor="otp">OTP</Label>
                <Input id="otp" {...register('otp')} />
                {errors.otp && <p className="text-sm text-red-500">{errors.otp.message}</p>}
            </div>

            <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" {...register('newPassword')} />
                {errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword.message}</p>}
            </div>

            <Button type="submit" className="w-full">Reset Password</Button>
        </form>
    )
}

export default ResetPasswordForm

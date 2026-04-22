"use client"

import React from "react"
import { AuthCard } from "@/components/module/auth/auth-card"
import ResetPasswordForm from "@/components/module/auth/reset-password-form"

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-primary-subtle p-4">
            <div className="flex flex-col items-center">
                <AuthCard title="Reset Password" description="Enter the OTP and your new password.">
                    <ResetPasswordForm />
                </AuthCard>
            </div>
        </div>
    )
}

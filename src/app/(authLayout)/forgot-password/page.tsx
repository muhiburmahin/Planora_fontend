"use client"

import React from "react"
import { AuthCard } from "@/components/module/auth/auth-card"
import ForgotPasswordForm from "@/components/module/auth/forgot-password-form"

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-primary-subtle p-4">
            <div className="flex flex-col items-center">
                <AuthCard title="Forgot Password" description="Enter your email to receive a reset OTP.">
                    <ForgotPasswordForm />
                </AuthCard>
            </div>
        </div>
    )
}

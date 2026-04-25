"use client"

import React from "react"
import { AuthCard } from "@/components/module/auth/auth-card"
import ForgotPasswordForm from "@/components/module/auth/forgot-password-form"

export default function ForgotPasswordPage() {
    return (
        <div className="w-full py-6">
            <div className="flex flex-col items-center">
                <AuthCard title="Forgot Password" description="Enter your email to receive a reset OTP.">
                    <ForgotPasswordForm />
                </AuthCard>
            </div>
        </div>
    )
}

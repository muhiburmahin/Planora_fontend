"use client";
import { AuthCard } from "@/components/module/auth/auth-card"
import { LoginForm } from "@/components/module/auth/login-form"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="w-full py-6">
      <div className="flex flex-col items-center">
        <AuthCard title="Welcome Back" description="Please enter your details to sign in.">
          <LoginForm />
        </AuthCard>
        <p className="mt-6 text-sm text-slate-600">
          Don't have an account? <Link href="/register" className="text-primary-600 font-bold hover:underline">Sign up for free</Link>
        </p>
      </div>
    </div>
  )
}
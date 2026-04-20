"use client";
import { AuthCard } from "@/components/module/auth/auth-card"
import { RegisterForm } from "@/components/module/auth/register-form"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-primary-subtle p-4 py-10">
      <div className="flex flex-col items-center">
        <AuthCard title="Create Account" description="Start managing your events with Planora today.">
          <RegisterForm />
        </AuthCard>
        <p className="mt-6 text-sm text-slate-600">
          Already have an account? <Link href="/login" className="text-primary-600 font-bold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
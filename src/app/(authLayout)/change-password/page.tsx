"use client";

import { AuthCard } from "@/components/module/auth/auth-card";
import ChangePasswordForm from "@/components/module/auth/change-password-form";

export default function ChangePasswordPage() {
    return (
        <div className="w-full py-6">
            <div className="flex flex-col items-center">
                <AuthCard title="Change Password" description="Keep your account secure by updating password regularly.">
                    <ChangePasswordForm />
                </AuthCard>
            </div>
        </div>
    );
}

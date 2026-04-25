"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[0-9]/, "Must contain at least one number"),
});

type FormValues = z.infer<typeof schema>;

export default function ChangePasswordForm() {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { oldPassword: "", newPassword: "" },
    });

    const onSubmit = async (values: FormValues) => {
        setLoading(true);
        try {
            const res = await authClient.changePassword(values.oldPassword, values.newPassword);
            if ((res as any)?.success) {
                toast.success((res as any).message || "Password changed successfully");
                reset();
                router.push("/dashboard/settings");
                return;
            }
            toast.error((res as any)?.message || "Failed to change password");
        } catch (error: any) {
            toast.error(error?.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
                <Label htmlFor="oldPassword">Current Password</Label>
                <Input id="oldPassword" type="password" {...register("oldPassword")} />
                {errors.oldPassword ? <p className="text-xs text-red-500">{errors.oldPassword.message}</p> : null}
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" {...register("newPassword")} />
                {errors.newPassword ? <p className="text-xs text-red-500">{errors.newPassword.message}</p> : null}
            </div>
            <Button type="submit" className="w-full bg-gradient-primary" disabled={loading}>
                {loading ? "Updating..." : "Change Password"}
            </Button>
        </form>
    );
}

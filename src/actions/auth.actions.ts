"use server";

import { revalidatePath } from "next/cache";
import { authService } from "@/services/authService";

export const loginAction = async (prevState: any, formData: FormData) => {
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    const response = await authService.server.login({ email, password });
    if (response.error) {
        return { success: false, message: response.error.message };
    }

    revalidatePath("/dashboard");
    return { success: true, message: "Login successful", data: response.data };
};

export const registerAction = async (prevState: any, formData: FormData) => {
    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    const response = await authService.server.register({ name, email, password });
    if (response.error) {
        return { success: false, message: response.error.message };
    }

    return { success: true, message: "Registration successful", data: response.data };
};

export const forgotPasswordAction = async (prevState: any, formData: FormData) => {
    const email = String(formData.get("email") || "");
    const response = await authService.server.forgetPassword(email);

    if (response.error) {
        return { success: false, message: response.error.message };
    }

    return { success: true, message: "OTP sent successfully", data: response.data };
};

export const resetPasswordAction = async (prevState: any, formData: FormData) => {
    const otp = String(formData.get("otp") || "");
    const newPassword = String(formData.get("newPassword") || "");
    const response = await authService.server.resetPassword(otp, newPassword);

    if (response.error) {
        return { success: false, message: response.error.message };
    }

    return { success: true, message: "Password reset successful", data: response.data };
};

export const changePasswordAction = async (prevState: any, formData: FormData) => {
    const oldPassword = String(formData.get("oldPassword") || "");
    const newPassword = String(formData.get("newPassword") || "");
    const response = await authService.server.changePassword(oldPassword, newPassword);

    if (response.error) {
        return { success: false, message: (response.error as any)?.message || "Failed to change password" };
    }

    revalidatePath("/dashboard/settings");
    return { success: true, message: "Password changed successfully", data: response.data };
};

export const logoutAction = async () => {
    const response = await authService.server.logout();

    if (response.error) {
        return { success: false, message: response.error.message };
    }

    return { success: true, message: "Logout successful" };
};
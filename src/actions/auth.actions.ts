"use server";
import { authService } from "@/services/authService";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// লগইন অ্যাকশন
export const loginAction = async (prevState: any, formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const response = await authService.login({ email, password });

    if (response.error) {
        return { success: false, message: response.error.message };
    }

    revalidatePath("/");
    redirect("/dashboard");
};

export const registerAction = async (prevState: any, formData: FormData) => {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const response = await authService.register({ name, email, password });

    if (response.error) {
        return { success: false, message: response.error.message };
    }

    redirect("/login");
};

// লগআউট অ্যাকশন
export const logoutAction = async () => {
    await authService.logout();
    revalidatePath("/");
    redirect("/login");
};
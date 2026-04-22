"use server";
import { userService } from "@/services/userService";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { UpdateUserPayload, ChangeUserStatusPayload } from "@/types/user";

// Update Profile Action
export const updateProfileAction = async (prevState: any, formData: FormData) => {
    const name = formData.get("name") as string;
    const image = formData.get("image") as string;
    const bio = formData.get("bio") as string;
    const contactNumber = formData.get("contactNumber") as string;
    const address = formData.get("address") as string;

    const payload: UpdateUserPayload = {};
    if (name) payload.name = name;
    if (image) payload.image = image;
    if (bio) payload.bio = bio;
    if (contactNumber) payload.contactNumber = contactNumber;
    if (address) payload.address = address;

    const response = await userService.server.updateMyProfile(payload);

    if (response.error) {
        return { success: false, message: response.error.message };
    }

    revalidatePath("/profile");
    revalidatePath("/dashboard");
    return { success: true, message: "Profile updated successfully", data: response.data };
};

// Change User Status Action (Admin only)
export const changeUserStatusAction = async (prevState: any, formData: FormData) => {
    const id = formData.get("id") as string;
    const status = formData.get("status") as 'ACTIVE' | 'BLOCKED' | 'DELETED' | 'PENDING';

    const payload: ChangeUserStatusPayload = { status };

    const response = await userService.server.changeUserStatus(id, payload);

    if (response.error) {
        return { success: false, message: response.error.message };
    }

    revalidatePath("/admin/users");
    return { success: true, message: "User status updated successfully", data: response.data };
};

// Get My Profile Action (for server components)
export const getMyProfileAction = async () => {
    const response = await userService.server.getMyProfile();

    if (response.error) {
        throw new Error(response.error.message);
    }

    return response.data;
};

// Get Dashboard Stats Action (for server components)
export const getDashboardStatsAction = async () => {
    const response = await userService.server.getDashboardStats();

    if (response.error) {
        throw new Error(response.error.message);
    }

    return response.data;
};

// Get All Users Action (for server components, admin only)
export const getAllUsersAction = async () => {
    const response = await userService.server.getAllUsers();

    if (response.error) {
        throw new Error(response.error.message);
    }

    return response.data;
};

// Get My Notifications Action (for server components)
export const getMyNotificationsAction = async () => {
    const response = await userService.server.getMyNotifications();

    if (response.error) {
        throw new Error(response.error.message);
    }

    return response.data;
};
"use server";
import { invitationService } from "@/services/invitationService";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { SendInvitationPayload, RespondInvitationPayload, InvitationFilterRequest, InvitationOptions } from "@/types/invitation";

// Send Invitation Action
export const sendInvitationAction = async (prevState: any, formData: FormData) => {
    const eventId = formData.get("eventId") as string;
    const receiverId = formData.get("receiverId") as string;
    const message = formData.get("message") as string;

    const payload: SendInvitationPayload = { eventId, receiverId };
    if (message) payload.message = message;

    const response = await invitationService.server.sendInvitation(payload);

    if (response.error) {
        return { success: false, message: response.error.message };
    }

    revalidatePath(`/events/${eventId}`);
    revalidatePath("/invitations/sent");
    return { success: true, message: "Invitation sent successfully", data: response.data };
};

// Respond to Invitation Action
export const respondToInvitationAction = async (prevState: any, formData: FormData) => {
    const id = formData.get("id") as string;
    const status = formData.get("status") as 'APPROVED' | 'REJECTED';

    const payload: RespondInvitationPayload = { status };

    const response = await invitationService.server.respondToInvitation(id, payload);

    if (response.error) {
        return { success: false, message: response.error.message };
    }

    revalidatePath("/invitations/inbox");
    revalidatePath("/dashboard");
    return { success: true, message: `Invitation ${status.toLowerCase()} successfully`, data: response.data };
};

// Withdraw Invitation Action
export const withdrawInvitationAction = async (id: string) => {
    const response = await invitationService.server.withdrawInvitation(id);

    if (response.error) {
        return { success: false, message: response.error.message };
    }

    revalidatePath("/invitations/sent");
    return { success: true, message: "Invitation withdrawn successfully" };
};

// Cleanup Invitations Action (Admin only)
export const cleanupInvitationsAction = async () => {
    const response = await invitationService.server.cleanupInvitations();

    if (response.error) {
        return { success: false, message: response.error.message };
    }

    revalidatePath("/admin/invitations");
    return { success: true, message: "Invitations cleaned up successfully" };
};

// Get My Invitations Action (for server components)
export const getMyInvitationsAction = async () => {
    const response = await invitationService.server.getMyInvitations();

    if (response.error) {
        throw new Error(response.error.message);
    }

    return response.data;
};

// Get Sent Invitations Action (for server components)
export const getSentInvitationsAction = async () => {
    const response = await invitationService.server.getSentInvitations();

    if (response.error) {
        throw new Error(response.error.message);
    }

    return response.data;
};

// Get All Invitations Action (for server components, admin only)
export const getAllInvitationsAction = async (filters?: InvitationFilterRequest, options?: InvitationOptions) => {
    const response = await invitationService.server.getAllInvitations(filters, options);

    if (response.error) {
        throw new Error(response.error.message);
    }

    return response.data;
};

// Get Single Invitation Action (for server components)
export const getSingleInvitationAction = async (id: string) => {
    const response = await invitationService.server.getSingleInvitation(id);

    if (response.error) {
        throw new Error(response.error.message);
    }

    return response.data;
};
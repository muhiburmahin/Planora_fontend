"use server";
import { reviewService } from "@/services/reviewService";
import { revalidatePath } from "next/cache";
import { CreateReviewPayload, UpdateReviewPayload, ReviewOptions } from "@/types/review";

// Create Review Action
export const createReviewAction = async (prevState: any, formData: FormData) => {
    const eventId = formData.get("eventId") as string;
    const rating = parseInt(formData.get("rating") as string);
    const comment = formData.get("comment") as string;

    const payload: CreateReviewPayload = { eventId, rating, comment };

    const response = await reviewService.server.createReview(payload);

    if (response.error) {
        return { success: false, message: response.error.message };
    }

    revalidatePath(`/events/${eventId}`);
    return { success: true, message: "Review created successfully", data: response.data };
};

// Update Review Action
export const updateReviewAction = async (prevState: any, formData: FormData) => {
    const id = formData.get("id") as string;
    const rating = formData.get("rating") ? parseInt(formData.get("rating") as string) : undefined;
    const comment = formData.get("comment") as string;

    const payload: UpdateReviewPayload = {};
    if (rating !== undefined) payload.rating = rating;
    if (comment) payload.comment = comment;

    const response = await reviewService.server.updateReview(id, payload);

    if (response.error) {
        return { success: false, message: response.error.message };
    }

    revalidatePath("/reviews/my-reviews");
    return { success: true, message: "Review updated successfully", data: response.data };
};

// Delete Review Action
export const deleteReviewAction = async (id: string) => {
    const response = await reviewService.server.deleteReview(id);

    if (response.error) {
        return { success: false, message: response.error.message };
    }

    revalidatePath("/reviews/my-reviews");
    return { success: true, message: "Review deleted successfully" };
};

// Delete Review by Admin Action
export const deleteReviewByAdminAction = async (id: string) => {
    const response = await reviewService.server.deleteReviewByAdmin(id);

    if (response.error) {
        return { success: false, message: response.error.message };
    }

    revalidatePath("/admin/reviews");
    return { success: true, message: "Review deleted successfully" };
};

// Get Event Reviews Action (for server components)
export const getEventReviewsAction = async (eventId: string, options?: ReviewOptions) => {
    const response = await reviewService.server.getEventReviews(eventId, options);

    if (response.error) {
        throw new Error(response.error.message);
    }

    return response.data;
};

// Get Single Review Action (NEW)
export const getSingleReviewAction = async (id: string) => {
    const response = await reviewService.server.getSingleReview(id);

    if (response.error) {
        throw new Error(response.error.message);
    }

    return response.data;
};

// Get Review Stats Action (for server components)
export const getReviewStatsAction = async (eventId: string) => {
    const response = await reviewService.server.getReviewStats(eventId);

    if (response.error) {
        throw new Error(response.error.message);
    }

    return response.data;
};

// Get My Reviews Action (for server components)
export const getMyReviewsAction = async (options?: ReviewOptions) => {
    const response = await reviewService.server.getMyReviews(options);

    if (response.error) {
        throw new Error(response.error.message);
    }

    return response.data;
};
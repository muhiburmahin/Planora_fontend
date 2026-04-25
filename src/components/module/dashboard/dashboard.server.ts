import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eventService } from "@/services/eventService";
import { invitationService } from "@/services/invitationService";
import { notificationService } from "@/services/notificationService";
import { participationService } from "@/services/participationService";
import { reviewService } from "@/services/reviewService";
import { userService } from "@/services/userService";

type DashboardRole = "ADMIN" | "USER";

export interface DashboardUser {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: DashboardRole;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function requireDashboardUser() {
    if (!API_URL) {
        throw new Error("NEXT_PUBLIC_API_URL is not configured");
    }

    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        headers: {
            Cookie: cookieStore.toString(),
            Accept: "application/json",
        },
        cache: "no-store",
    });

    if (!res.ok) {
        redirect("/login");
    }

    const payload = await res.json().catch(() => null);
    const user = payload?.data as DashboardUser | undefined;
    if (!user?.id || !user?.role) {
        redirect("/login");
    }

    return user;
}

export async function getAdminDashboardData() {
    const [stats, users, events, participations] = await Promise.all([
        userService.server.getDashboardStats(),
        userService.server.getAllUsers(),
        eventService.server.list({ limit: 12, sortBy: "createdAt", sortOrder: "desc" }),
        participationService.server.getAllParticipations(undefined, { limit: 12, sortBy: "createdAt", sortOrder: "desc" }),
    ]);

    return {
        stats: stats.data,
        users: users.data ?? [],
        events: events.data?.data ?? events.data ?? [],
        participations: participations.data?.data ?? participations.data ?? [],
    };
}

export async function getUserDashboardData() {
    const [stats, myEvents, invitations, participations, reviews, notifications] = await Promise.all([
        userService.server.getDashboardStats(),
        eventService.server.list({ myEvents: true, limit: 12, sortBy: "createdAt", sortOrder: "desc" }),
        invitationService.server.getMyInvitations(),
        participationService.server.getMyParticipations({ limit: 10, sortBy: "createdAt", sortOrder: "desc" }),
        reviewService.server.getMyReviews({ limit: 10, page: 1 }),
        notificationService.server.getMyNotifications(undefined, { limit: 10, sortBy: "createdAt", sortOrder: "desc" }),
    ]);

    return {
        stats: stats.data,
        myEvents: myEvents.data?.data ?? myEvents.data ?? [],
        invitations: invitations.data ?? [],
        participations: participations.data?.data ?? participations.data ?? [],
        reviews: reviews.data?.data ?? reviews.data ?? [],
        notifications: notifications.data?.data ?? notifications.data ?? [],
    };
}

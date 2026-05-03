import { Routes } from "@/types/route.type";
import { LayoutDashboard, CalendarDays, Tags, UserCog, Users, Mail, Bell, ClipboardList, Star, Settings, Shield } from "lucide-react";

export const adminRoutes: Routes[] = [
    {
        title: "Admin",
        items: [
            {
                title: "Overview",
                url: "/admin-dashboard",
                icon: <LayoutDashboard size={20} />,
            },
            {
                title: "Categories",
                url: "/admin-dashboard/categories",
                icon: <Tags size={20} />,
            },
            {
                title: "Event Mesh",
                url: "/admin-dashboard/events",
                icon: <CalendarDays size={20} />,
            },

            {
                title: "Attendees",
                url: "/admin-dashboard/participants",
                icon: <ClipboardList size={20} />,
            },

            {
                title: "Notifications",
                url: "/admin-dashboard/notifications",
                icon: <Bell size={20} />,
            },
            {
                title: "Settings",
                url: "/admin-dashboard/settings",
                icon: <Shield size={20} />,
            },

        ],
    },
];
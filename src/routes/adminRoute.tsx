import { Routes } from "@/types/route.type";
import { LayoutDashboard, CalendarDays, Tags, UserCog, Users, Mail, Bell, ClipboardList, Star, Settings, Shield } from "lucide-react";

export const adminRoutes: Routes[] = [
    {
        title: "Admin",
        items: [
            {
                title: "Overview",
                url: "/admin-dashboard",
                icon: LayoutDashboard,
            },
            {
                title: "Categories",
                url: "/admin-dashboard/categories",
                icon: Tags,
            },
            {
                title: "Events",
                url: "/admin-dashboard/events",
                icon: CalendarDays,
            },


            {
                title: "Participations",
                url: "/admin-dashboard/participations",
                icon: Users,
            },

            {
                title: "Notifications",
                url: "/admin-dashboard/notifications",
                icon: Bell,
            },
            {
                title: "Reviews",
                url: "/admin-dashboard/reviews",
                icon: Star,
            },
            {
                title: "Users",
                url: "/admin-dashboard/users",
                icon: UserCog,
            },
            {
                title: "Settings",
                url: "/admin-dashboard/settings",
                icon: Shield,
            },

        ],
    },
];
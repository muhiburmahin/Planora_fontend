import { Routes } from "@/types/route.type";
import { LayoutDashboard, CalendarDays, Ticket, Users, Mail, Bell, ClipboardList, Star, Settings, Tags } from "lucide-react";

export const userRoutes: Routes[] = [
    {
        title: "User Workspace",
        items: [
            {
                title: "Overview",
                url: "/dashboard",
                icon: <LayoutDashboard size={20} />,
            },
            {
                title: "My Events",
                url: "/dashboard/events",
                icon: <CalendarDays size={20} />,
            },
            {
                title: "Tickets",
                url: "/dashboard/tickets",
                icon: <Ticket size={20} />,
            },
            {
                title: "Invitations",
                url: "/dashboard/invitations",
                icon: <Mail size={20} />,
            },
            {
                title: "Participations",
                url: "/dashboard/participations",
                icon: <ClipboardList size={20} />,
            },
            {
                title: "Reviews",
                url: "/dashboard/reviews",
                icon: <Star size={20} />,
            },
            {
                title: "Notifications",
                url: "/dashboard/notifications",
                icon: <Bell size={20} />,
            },
            {
                title: "Settings",
                url: "/dashboard/settings",
                icon: <Settings size={20} />,
            },
        ],
    },
];
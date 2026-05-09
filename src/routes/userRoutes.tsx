import {
    LayoutDashboard,
    CalendarDays,
    Ticket,
    Mail,
    Bell,
    ClipboardList,
    Star,
    Settings
} from "lucide-react";

export const userRoutes = [
    {
        title: "User Workspace",
        items: [
            {
                title: "Overview",
                url: "/dashboard",
                // Shudhu component-er naam pass koren, JSX tag na
                icon: LayoutDashboard,
            },
            {
                title: "All Events",
                url: "/dashboard/events",
                icon: CalendarDays,
            },
            {
                title: "My Invitations",
                url: "/dashboard/invitations",
                icon: Mail,
            },
            {
                title: "My Participations",
                url: "/dashboard/participations",
                icon: Ticket,
            },
            {
                title: " Reviews",
                url: "/dashboard/reviews",
                icon: Star,
            },
            {
                title: "Notifications",
                url: "/dashboard/notifications",
                icon: Bell,
            },
            {
                title: "Settings",
                url: "/dashboard/settings",
                icon: Settings,
            },
        ],
    },
];
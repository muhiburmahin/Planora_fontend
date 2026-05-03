"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogOut, Settings, User } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface UserDropdownProps {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: string;
    };
}

export function UserDropdown({ user }: UserDropdownProps) {
    const initials = (user.name || "U")
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join("");

    const role = user?.role?.toUpperCase() === "ADMIN" ? "ADMIN" : "USER";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full outline-none ring-2 ring-transparent hover:ring-primary-200 transition-all">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
                        <AvatarFallback className="bg-gradient-to-r from-primary-600 to-secondary-500 text-white text-sm font-bold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                    <div className="flex items-center gap-3 py-1">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={user.image ?? ""} />
                            <AvatarFallback className="bg-gradient-to-r from-primary-600 to-secondary-500 text-white font-bold">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-900 dark:text-slate-100">
                                {user.name}
                            </p>
                            <p className="truncate text-xs text-slate-500">{user.email}</p>
                            <Badge className="mt-1 border-0 bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 text-[10px]">
                                {role}
                            </Badge>
                        </div>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
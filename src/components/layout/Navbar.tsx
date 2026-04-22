"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

import {
    CalendarDays, PlusCircle, User,
    Search, Bell, LogOut, LayoutDashboard,
    Menu, X, Home, Settings, CreditCard, ShieldCheck
} from "lucide-react"

import { cn } from "@/lib/utils"
import { useGetMe } from "@/hooks/auth.hooks"
import { authClient } from "@/lib/auth-client"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { ModeToggle } from "../module/shared/modeTaggle"


const NAV_LINKS = [
    { name: "Home", href: "/", icon: Home },
    { name: "Events", href: "/events" },
    { name: "Categories", href: "/categories" },
    { name: "Pricing", href: "/pricing" },
]

const Navbar = () => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [scrolled, setScrolled] = React.useState(false)
    const [searchOpen, setSearchOpen] = React.useState(false)
    const [mounted, setMounted] = React.useState(false)
    const [isLoggingOut, setIsLoggingOut] = React.useState(false)
    const pathname = usePathname()

    const { data: userData, isLoading } = useGetMe();
    const queryClient = useQueryClient();

    const user = userData || null;

    React.useEffect(() => {
        setMounted(true)
        const handleScroll = () => setScrolled(window.scrollY > 15)
        window.addEventListener("scroll", handleScroll)

        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setSearchOpen((prev) => !prev)
            }
        }
        document.addEventListener("keydown", down)
        return () => {
            window.removeEventListener("scroll", handleScroll)
            document.removeEventListener("keydown", down)
        }
    }, [])

    if (!mounted) return null;

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true)
            await authClient.logout();
            // Clear user cache immediately so UI updates
            queryClient.setQueryData(["user-me"], null)
            queryClient.invalidateQueries({ queryKey: ["user-me"] });
            window.location.href = '/login';
        } catch (err) {
            console.error("Logout failed", err)
        } finally {
            setIsLoggingOut(false)
        }
    }

    return (
        <>
            <nav
                aria-label="Global Navigation"
                className={cn(
                    "fixed top-0 z-50 w-full transition-all duration-500",
                    scrolled
                        ? "bg-primary-600 shadow-lg py-2"
                        : "bg-transparent py-5"
                )}
            >
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex items-center justify-between">

                        {/* Logo Section */}
                        <div className="flex items-center gap-8">
                            <Link href="/" className="flex items-center gap-2 group outline-none">
                                <motion.div
                                    whileHover={{ scale: 1.05, rotate: 5 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={cn(
                                        "h-10 w-10 rounded-xl flex items-center justify-center shadow-lg transition-colors",
                                        scrolled ? "bg-white text-primary-600" : "bg-gradient-to-br from-primary-600 to-primary-400 text-white"
                                    )}
                                >
                                    <CalendarDays className="h-6 w-6" />
                                </motion.div>
                                <span className={cn(
                                    "text-2xl font-black tracking-tighter transition-colors",
                                    scrolled ? "text-white" : "dark:text-white text-slate-900"
                                )}>
                                    Planora<span className={scrolled ? "text-primary-200" : "text-primary-500"}>.</span>
                                </span>
                            </Link>

                            {/* Desktop Links */}
                            <div className="hidden lg:flex items-center gap-1">
                                {NAV_LINKS.map((link) => {
                                    const isActive = pathname === link.href;
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={cn(
                                                "relative px-4 py-2 text-sm font-bold transition-all duration-300 rounded-full flex items-center gap-2",
                                                scrolled
                                                    ? (isActive ? "text-white" : "text-primary-100 hover:text-white")
                                                    : (isActive ? "text-primary-600 dark:text-primary-400" : "text-slate-600 dark:text-slate-400 hover:text-primary-500")
                                            )}
                                        >
                                            <span className="relative z-10">{link.name}</span>
                                            {isActive && (
                                                <motion.span
                                                    layoutId="active-nav-pill"
                                                    className={cn("absolute inset-0 rounded-full", scrolled ? "bg-white/20" : "bg-primary-100/60 dark:bg-primary-900/40")}
                                                    transition={{ type: "spring", duration: 0.6 }}
                                                />
                                            )}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSearchOpen(true)}
                                className={cn(
                                    "hidden md:flex items-center gap-3 px-4 py-2 rounded-full border border-transparent transition-all group",
                                    scrolled ? "bg-white/10 text-white hover:bg-white/20" : "bg-slate-100/50 dark:bg-slate-800/50 text-slate-500 hover:border-primary-500/20"
                                )}
                            >
                                <Search className="h-4 w-4" />
                                <span className="text-xs font-medium">Search...</span>
                                <kbd className={cn("hidden lg:inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] opacity-50", scrolled ? "bg-white/20 border-white/30" : "bg-white dark:bg-slate-900")}>⌘K</kbd>
                            </button>

                            <ModeToggle />

                            {user ? (
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" className={cn("relative rounded-full", scrolled ? "text-white hover:bg-white/20" : "hover:bg-primary-50 dark:hover:bg-primary-900/20")}>
                                        <Bell className="h-5 w-5" />
                                        {!user.emailVerified && <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-yellow-400 border-2 border-white" title="Verify Email" />}
                                    </Button>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className={cn("h-10 w-10 rounded-full p-0.5 border-2 transition-all", scrolled ? "border-white/50 hover:border-white" : "border-primary-100 hover:border-primary-500")}>
                                                <Avatar className="h-full w-full">
                                                    <AvatarImage src={user.image} />
                                                    <AvatarFallback className={cn("font-bold text-xs", scrolled ? "bg-white text-primary-600" : "bg-primary-600 text-white")}>
                                                        {user.name.substring(0, 2)}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-64 p-2 shadow-2xl rounded-2xl border-slate-100 dark:border-slate-800">
                                            <DropdownMenuLabel className="flex items-center gap-3 p-3">
                                                <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold truncate max-w-[150px] flex items-center gap-1">
                                                        {user.name}
                                                        {user.role === 'ADMIN' && <ShieldCheck size={14} className="text-primary-500" />}
                                                    </span>
                                                    <span className="text-[10px] text-slate-500 truncate">{user.email}</span>
                                                </div>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />

                                            {/* Role Based Link */}
                                            <DropdownMenuItem asChild>
                                                <Link href={user.role === 'ADMIN' ? "/admin/dashboard" : "/dashboard"} className="flex items-center gap-3 py-2.5 cursor-pointer rounded-lg font-medium">
                                                    <LayoutDashboard size={16} className="text-primary-500" /> {user.role === 'ADMIN' ? "Admin Panel" : "Dashboard"}
                                                </Link>
                                            </DropdownMenuItem>

                                            <DropdownMenuItem asChild>
                                                <Link href="/profile" className="flex items-center gap-3 py-2.5 cursor-pointer rounded-lg font-medium">
                                                    <User size={16} className="text-primary-500" /> My Profile
                                                </Link>
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut} className="text-red-600 focus:bg-red-50 dark:focus:bg-red-900/10 py-2.5 rounded-lg cursor-pointer font-bold">
                                                <LogOut className="h-4 w-4 mr-2" /> {isLoggingOut ? 'Signing out...' : 'Log out'}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            ) : (
                                <div className="hidden md:flex items-center gap-2">
                                    <Button variant="ghost" asChild className={cn("font-bold rounded-full", scrolled ? "text-white hover:bg-white/20" : "")}>
                                        <Link href="/login">Sign In</Link>
                                    </Button>
                                    <Button className={cn("rounded-full px-6 font-bold shadow-lg", scrolled ? "bg-white text-primary-600 hover:bg-primary-50" : "bg-primary-600 text-white")} asChild>
                                        <Link href="/register">Join Now</Link>
                                    </Button>
                                </div>
                            )}

                            {/* Mobile Toggle */}
                            <Button
                                variant="outline"
                                size="icon"
                                className={cn("lg:hidden rounded-full transition-colors", scrolled ? "bg-white/10 text-white border-white/20" : "border-slate-200 dark:border-slate-800")}
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                {isOpen ? <X size={20} /> : <Menu size={20} />}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={cn("lg:hidden absolute top-full left-0 w-full border-b shadow-2xl", scrolled ? "bg-primary-600 border-white/10" : "bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-800")}
                        >
                            <div className="flex flex-col gap-1 p-4">
                                {NAV_LINKS.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={cn("p-4 rounded-xl font-bold", pathname === link.href ? (scrolled ? "bg-white/20 text-white" : "bg-primary-50 text-primary-600") : (scrolled ? "text-primary-100" : "text-slate-800 dark:text-slate-200"))}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                {!user && (
                                    <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-100">
                                        <Button asChild onClick={() => setIsOpen(false)} variant="outline" className="rounded-xl py-6 font-bold">
                                            <Link href="/login">Sign In</Link>
                                        </Button>
                                        <Button asChild onClick={() => setIsOpen(false)} className="rounded-xl py-6 font-bold bg-primary-600">
                                            <Link href="/register">Get Started</Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Command Search */}
            <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
                <CommandInput placeholder="Type to search events..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                        <CommandItem onSelect={() => { }} className="cursor-pointer">
                            <PlusCircle className="mr-2 h-4 w-4 text-primary-500" /> Host an Event
                        </CommandItem>
                        <CommandItem onSelect={() => { }} className="cursor-pointer">
                            <CalendarDays className="mr-2 h-4 w-4 text-primary-500" /> Upcoming Conferences
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}

export { Navbar }
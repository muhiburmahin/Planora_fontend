"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    CalendarDays, PlusCircle, User,
    Search, Bell, LogOut, LayoutDashboard,
    Menu, X, SunMoon, Home
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { ModeToggle } from "../module/modeTaggle"

// 'Home' লিঙ্ক যোগ করা হয়েছে
const NAV_LINKS = [
    { name: "Home", href: "/" },
    { name: "Events", href: "/events" },
    { name: "Categories", href: "/categories" },
    { name: "Speakers", href: "/speakers" },
    { name: "Pricing", href: "/pricing" },
]

const Navbar = () => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [scrolled, setScrolled] = React.useState(false)
    const [searchOpen, setSearchOpen] = React.useState(false)
    const [mounted, setMounted] = React.useState(false)
    const pathname = usePathname()

    React.useEffect(() => {
        setMounted(true)
        const handleScroll = () => setScrolled(window.scrollY > 10)
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

    const user = {
        name: "Hasan Shahriar",
        email: "hasan@planora.com",
        role: "ADMIN",
        isLoggedIn: true
    }

    if (!mounted) return null;

    return (
        <>
            <nav
                aria-label="Global Navigation"
                className={cn(
                    "fixed top-0 z-50 w-full transition-all duration-500",
                    scrolled
                        ? "bg-primary-600/90 dark:bg-primary-950/90 backdrop-blur-xl shadow-lg-primary border-b border-primary-500/20 py-2"
                        : "bg-primary-500/10 dark:bg-primary-950/40 py-4 border-b border-primary-500/10"
                )}
            >
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex items-center justify-between">

                        {/* Logo */}
                        <div className="flex items-center gap-6">
                            <Link href="/" className="flex items-center gap-2 group">
                                <motion.div
                                    whileHover={{ scale: 1.05, rotate: 5 }}
                                    className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/20"
                                >
                                    <CalendarDays className="h-6 w-6 text-white" />
                                </motion.div>
                                <span className="text-2xl font-black tracking-tighter dark:text-white">
                                    Planora<span className="text-secondary-500">.</span>
                                </span>
                            </Link>

                            {/* Desktop Links */}
                            <div className="hidden lg:flex items-center gap-1">
                                {NAV_LINKS.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            "relative px-4 py-2 text-sm font-bold transition-all duration-300 rounded-full flex items-center gap-1.5",
                                            pathname === link.href
                                                ? "text-primary-600 dark:text-primary-400"
                                                : "text-slate-600 dark:text-slate-400 hover:text-primary-500"
                                        )}
                                    >
                                        {link.name === "Home" && <Home size={14} className="opacity-70" />}
                                        {pathname === link.href && (
                                            <motion.span
                                                layoutId="active-pill"
                                                className="absolute inset-0 bg-primary-100/50 dark:bg-primary-900/30 rounded-full -z-10"
                                                transition={{ type: "spring", duration: 0.5 }}
                                            />
                                        )}
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full bg-primary-50/50 dark:bg-slate-800 border border-transparent hover:border-primary-500/30 text-slate-500 transition-all"
                            >
                                <Search className="h-4 w-4" />
                                <span className="text-xs font-medium">Search...</span>
                                <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border bg-white dark:bg-slate-900 px-1.5 font-mono text-[10px]">⌘K</kbd>
                            </button>

                            <ModeToggle />

                            {user.isLoggedIn ? (
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-primary-50 dark:hover:bg-primary-900/20 group">
                                        <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400 group-hover:text-primary-600" />
                                        <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-secondary-500 rounded-full border-2 border-white dark:border-slate-950" />
                                    </Button>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-10 w-10 rounded-full p-0.5 border-2 border-primary-100 hover:border-primary-300 transition-all">
                                                <Avatar className="h-full w-full">
                                                    <AvatarFallback className="bg-gradient-primary text-white font-bold text-xs">
                                                        {user.name.substring(0, 2)}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-64 p-2 shadow-2xl rounded-2xl border-primary-50 dark:border-slate-800">
                                            <DropdownMenuLabel className="flex items-center gap-3 p-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold leading-none">{user.name}</span>
                                                    <span className="text-[10px] text-slate-500 mt-1">{user.email}</span>
                                                </div>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <Link href="/dashboard" className="flex items-center gap-3 py-2.5 cursor-pointer rounded-lg font-medium hover:bg-primary-50">
                                                    <LayoutDashboard size={16} className="text-primary-500" /> Dashboard
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600 focus:bg-red-50 py-2.5 rounded-lg cursor-pointer font-bold">
                                                <LogOut className="h-4 w-4 mr-2" /> Log out
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            ) : (
                                <Button className="bg-gradient-primary text-white rounded-full px-6 font-bold" asChild><Link href="/login">Join</Link></Button>
                            )}

                            <Button
                                variant="outline"
                                size="icon"
                                className="lg:hidden rounded-full border-primary-100"
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
                            className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-950 border-b border-primary-100 shadow-2xl p-4"
                        >
                            <div className="flex flex-col gap-1">
                                {NAV_LINKS.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 p-4 rounded-xl font-bold transition-colors",
                                            pathname === link.href
                                                ? "bg-primary-50 text-primary-600"
                                                : "text-slate-800 dark:text-slate-200 hover:bg-slate-50"
                                        )}
                                    >
                                        {link.name === "Home" && <Home size={18} />}
                                        {link.name}
                                    </Link>
                                ))}
                                <Button className="w-full bg-gradient-primary text-white font-bold py-6 rounded-xl mt-4">
                                    Get Started
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
                <CommandInput placeholder="Type to search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                        <CommandItem onSelect={() => setSearchOpen(false)} className="cursor-pointer">
                            <PlusCircle className="mr-2 h-4 w-4 text-primary-500" /> New Event
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}

export { Navbar }
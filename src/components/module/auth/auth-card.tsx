"use client"

import { CalendarDays } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AuthCardProps {
    children: React.ReactNode
    title: string
    description: string
    icon?: React.ReactNode
    className?: string
}

export const AuthCard = ({
    children,
    title,
    description,
    icon,
    className
}: AuthCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={cn(
                "w-full max-w-[420px] p-8 bg-white dark:bg-slate-950",
                "rounded-[2rem] shadow-lg-primary border border-primary-100/20 dark:border-primary-900/10",
                "backdrop-blur-sm bg-white/90 dark:bg-slate-950/90",
                className
            )}
        >
            <div className="flex flex-col items-center mb-8">
                <div className="h-14 w-14 rounded-2xl bg-gradient-primary flex items-center justify-center mb-5 shadow-lg shadow-primary-500/30 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                    {icon ? icon : <CalendarDays className="text-white h-8 w-8" />}
                </div>

                <div className="text-center space-y-1.5">
                    <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
                        {title}<span className="text-primary-600">.</span>
                    </h1>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {description}
                    </p>
                </div>
            </div>

            <div className="relative z-10">
                {children}
            </div>

            <div className="absolute top-0 right-0 -mt-2 -mr-2 h-20 w-20 bg-primary-500/5 rounded-full blur-3xl" />
        </motion.div>
    )
}
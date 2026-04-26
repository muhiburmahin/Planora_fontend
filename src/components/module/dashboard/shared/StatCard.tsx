import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
    title: string;
    value: string | number;
    hint?: string;
    icon?: ReactNode;
    tone?: "primary" | "secondary" | "tertiary" | "accent" | "info";
}

const toneClasses: Record<NonNullable<StatCardProps["tone"]>, string> = {
    primary: "from-primary-600 via-primary-500 to-primary-400",
    secondary: "from-secondary-600 via-secondary-500 to-secondary-400",
    tertiary: "from-primary-500 via-primary-400 to-secondary-400",
    accent: "from-secondary-500 to-secondary-400",
    info: "from-primary-600 via-secondary-500 to-secondary-400",
};

export function StatCard({ title, value, hint, icon, tone = "primary" }: StatCardProps) {
    return (
        <Card className={`relative overflow-hidden border-0 bg-gradient-to-br ${toneClasses[tone]} text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 dark:shadow-2xl`}>
            {/* Decorative blur effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_70%)]" />
            
            <CardContent className="relative p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <p className="text-xs font-bold uppercase tracking-wider text-white/85">
                            {title}
                        </p>
                        <p className="mt-3 text-4xl font-black tracking-tighter text-white">
                            {value}
                        </p>
                        {hint && (
                            <p className="mt-2 text-xs font-medium text-white/75">
                                {hint}
                            </p>
                        )}
                    </div>
                    {icon && (
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/30 bg-white/15 backdrop-blur-sm transition-all group-hover:bg-white/20">
                            {icon}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
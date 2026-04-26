import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
    title: string;
    value: string | number;
    hint?: string;
    icon?: ReactNode;
    tone?: "primary" | "success" | "dark" | "info";
}

const toneClasses: Record<NonNullable<StatCardProps["tone"]>, string> = {
    primary: "from-primary-600 to-primary-500",
    success: "from-emerald-600 to-emerald-500",
    dark: "from-slate-800 to-slate-700",
    info: "from-blue-600 to-blue-500",
};

export function StatCard({ title, value, hint, icon, tone = "primary" }: StatCardProps) {
    return (
        <Card className={`overflow-hidden border-none bg-gradient-to-r text-white shadow-lg ${toneClasses[tone]}`}>
            <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/75">{title}</p>
                        <p className="mt-2 text-4xl font-extrabold tracking-tight text-white">{value}</p>
                        {hint ? <p className="mt-1 text-xs text-white/80">{hint}</p> : null}
                    </div>
                    {icon ? (
                        <div className="rounded-xl border border-white/20 bg-white/15 p-2.5 text-white backdrop-blur-sm">
                            {icon}
                        </div>
                    ) : null}
                </div>
            </CardContent>
        </Card>
    );
}

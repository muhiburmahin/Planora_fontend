import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
    title: string;
    value: string | number;
    hint?: string;
    icon?: ReactNode;
}

export function StatCard({ title, value, hint, icon }: StatCardProps) {
    return (
        <Card className="border-primary-100/70 bg-white/90 shadow-sm">
            <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-sm font-medium text-slate-500">{title}</p>
                        <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
                        {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
                    </div>
                    {icon ? (
                        <div className="rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 p-2 text-white">
                            {icon}
                        </div>
                    ) : null}
                </div>
            </CardContent>
        </Card>
    );
}

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          className={cn(
            "peer h-6 w-11 cursor-pointer appearance-none rounded-full bg-slate-200 transition-colors duration-200 checked:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-700 dark:checked:bg-primary-500",
            className
          )}
          ref={ref}
          {...props}
        />
        <span
          className="pointer-events-none absolute left-1 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 peer-checked:translate-x-5"
        />
      </div>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };

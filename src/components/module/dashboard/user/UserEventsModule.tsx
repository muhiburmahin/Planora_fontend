"use client";

import { EventCrudModule } from "../shared/EventCrudModule";

interface UserEventsModuleProps {
  userId: string;
}

export function UserEventsModule({ userId }: UserEventsModuleProps) {
  // Pass the organizerId query to the shared module to filter for this user's events
  return (
    <div className="space-y-6">
      <header className="relative p-8 rounded-3xl bg-gradient-to-r from-primary-600/10 to-secondary-500/10 dark:from-primary-900/20 dark:to-secondary-800/20 backdrop-blur-xl border border-white/20 dark:border-white/5 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary-500/20 rounded-full blur-3xl animate-pulse-slow" />
        
        <div className="relative">
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
            Managed Events
          </h1>
          <p className="mt-3 text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl">
            Take full control of your organized experiences. Launch new events, refine existing ones, and track their lifecycle in real-time.
          </p>
          
          <div className="mt-6 flex flex-wrap gap-3">
             <div className="px-4 py-2 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">
               Organized by you
             </div>
             <div className="px-4 py-2 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">
               Direct management
             </div>
          </div>
        </div>
      </header>

      <div className="relative">
        <EventCrudModule 
          title="" 
          query={{ organizerId: userId }} 
        />
      </div>
    </div>
  );
}

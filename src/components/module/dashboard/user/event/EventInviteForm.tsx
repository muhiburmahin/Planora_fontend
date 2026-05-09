"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, Share2, Sparkles } from "lucide-react";
import InviteUserModal from "@/components/module/events/InviteUserModal";

export function EventInviteForm({ eventId, eventTitle }: { eventId: string; eventTitle: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative mt-12 p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-900 to-primary-900 text-white overflow-hidden shadow-2xl shadow-primary-500/20 border border-white/5">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 text-center md:text-left max-w-lg">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/20 border border-primary-500/30 text-primary-300 text-[10px] font-black uppercase tracking-[0.2em]">
            <Sparkles className="w-3 h-3" />
            Social Growth
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-none">
            Expand Your Community
          </h2>
          <p className="text-slate-400 font-medium text-lg leading-relaxed">
            Invite colleagues, friends, or industry leaders to join this experience. Growth happens through connection.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="h-16 px-8 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-black text-sm uppercase tracking-widest flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10"
          >
            <UserPlus className="w-5 h-5" />
            Invite Friends
          </Button>
          <Button
            variant="outline"
            className="h-16 px-8 rounded-2xl border-white/10 bg-white/5 backdrop-blur-md text-white hover:bg-white/20 font-black text-sm uppercase tracking-widest flex items-center gap-3"
          >
            <Share2 className="w-5 h-5" />
            Copy Link
          </Button>
        </div>
      </div>

      {isModalOpen && (
        <InviteUserModal
          eventId={eventId}
          eventTitle={eventTitle}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

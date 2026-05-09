"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, Search, Mail, Send, Loader2, UserPlus, CheckCircle2, AlertCircle } from "lucide-react";
import { userService } from "@/services/userService";
import { invitationService } from "@/services/invitationService";
import { User } from "@/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface InviteUserModalProps {
  eventId: string;
  eventTitle: string;
  onClose: () => void;
}

export default function InviteUserModal({ eventId, eventTitle, onClose }: InviteUserModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [step, setStep] = useState<"search" | "message" | "success">("search");

  const searchUsers = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setUsers([]);
      return;
    }
    setLoading(true);
    try {
      const response = await userService.getAllUsers({ searchTerm: query });
      // Filter out admin users if necessary, or just show all
      setUsers(response.data || []);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchUsers(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, searchUsers]);

  const handleSendInvite = async () => {
    if (!selectedUser) return;
    setSending(true);
    try {
      const response = await invitationService.sendInvitation({
        eventId,
        receiverId: selectedUser.id,
        message: message.trim() || undefined,
      });

      if (response.success) {
        setStep("success");
        toast.success(`Invitation sent to ${selectedUser.name}`);
      } else {
        toast.error(response.message || "Failed to send invitation");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800"
      >
        {/* Header */}
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Invite Friends</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">Share <span className="text-primary-600 font-bold">{eventTitle}</span> with others</p>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-2xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg transition-all group"
          >
            <X className="w-5 h-5 text-slate-400 group-hover:text-rose-500" />
          </button>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === "search" && (
              <motion.div
                key="search"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    placeholder="Search by name or email..."
                    className="pl-12 h-14 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:ring-primary-500 focus:border-primary-500 font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {loading && (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-primary-500" />
                  )}
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => {
                          setSelectedUser(user);
                          setStep("message");
                        }}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-primary-50 dark:hover:bg-primary-900/20 group transition-all border border-transparent hover:border-primary-100 dark:hover:border-primary-800"
                      >
                        <Avatar className="h-12 w-12 border-2 border-white dark:border-slate-800 shadow-sm">
                          <AvatarImage src={user.image} />
                          <AvatarFallback className="bg-primary-600 text-white font-bold">
                            {user.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left">
                          <p className="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">
                            {user.name}
                          </p>
                          <p className="text-xs text-slate-500 font-medium">{user.email}</p>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary-600 group-hover:text-white transition-all">
                          <UserPlus className="w-5 h-5" />
                        </div>
                      </button>
                    ))
                  ) : searchQuery.length >= 2 && !loading ? (
                    <div className="py-12 text-center">
                      <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-10 h-10 text-slate-300" />
                      </div>
                      <p className="text-slate-500 font-bold">No users found matching "{searchQuery}"</p>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-slate-400">
                      <Mail className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p className="text-sm font-medium">Type at least 2 characters to search</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === "message" && selectedUser && (
              <motion.div
                key="message"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="p-6 rounded-[2rem] bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-800 flex items-center gap-4">
                  <Avatar className="h-14 w-14 border-4 border-white dark:border-slate-800 shadow-lg">
                    <AvatarImage src={selectedUser.image} />
                    <AvatarFallback className="bg-primary-600 text-white font-black text-lg">
                      {selectedUser.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary-600 mb-1">Inviting</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white">{selectedUser.name}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Personal Message (Optional)</label>
                  <Textarea
                    placeholder="Hey! Join me at this amazing event..."
                    className="min-h-[120px] rounded-[1.5rem] border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:ring-primary-500 focus:border-primary-500 p-5 font-medium resize-none"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep("search")}
                    className="flex-1 h-14 rounded-2xl border-slate-200 font-bold"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleSendInvite}
                    disabled={sending}
                    className="flex-[2] h-14 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-black shadow-xl shadow-primary-500/20 gap-2"
                  >
                    {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    Send Invitation
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "success" && selectedUser && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center"
              >
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                <h4 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Invite Sent!</h4>
                <p className="text-slate-500 font-medium mb-8 max-w-xs mx-auto">
                  We've sent an invitation to <span className="text-slate-900 dark:text-white font-bold">{selectedUser.name}</span> for this event.
                </p>
                <Button
                  onClick={onClose}
                  className="w-full h-14 rounded-2xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black hover:opacity-90 transition-all"
                >
                  Great, Thanks!
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
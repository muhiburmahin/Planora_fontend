"use client";

import React, { useEffect, useState } from "react";
import { User, Shield, Key, Smartphone, Palette, Loader2, Save, Upload, Mail, Phone, MapPin, AlignLeft, Badge } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getMyProfileAction, updateProfileAction } from "@/actions/user.actions";
import { User as UserType } from "@/types/user";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function UserSettingsModule() {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);

  const { data: user, isLoading: loading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: () => getMyProfileAction(),
  });

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSaving(true);
      const formData = new FormData(e.currentTarget);
      const result = await updateProfileAction(null, formData);
      if (result.success) {
        toast.success("Profile updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
        <p className="text-slate-400 font-bold animate-pulse">Loading your preferences...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 pb-20">
      <header className="relative p-12 rounded-[3rem] bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white overflow-hidden shadow-2xl shadow-slate-500/10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10">
          <h1 className="text-6xl font-black tracking-tighter mb-4 leading-none">Account Settings</h1>
          <p className="text-slate-400 font-medium text-xl max-w-2xl leading-relaxed">
            Personalize your Planora profile and manage your account security.
          </p>
        </div>
      </header>

      <form onSubmit={handleUpdate} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Avatar & Quick Info */}
          <Card className="border-0 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden lg:h-fit">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-primary-500/20 p-1 mb-6 overflow-hidden">
                  <img
                    src={user?.image || "https://github.com/shadcn.png"}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute bottom-6 right-0 rounded-full shadow-lg border-2 border-white dark:border-slate-900"
                >
                  <Upload className="w-4 h-4" />
                </Button>
                <Input name="image" defaultValue={user?.image || ""} className="hidden" />
              </div>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">{user?.name}</h2>
              <p className="text-slate-400 font-medium text-sm mb-6">{user?.email}</p>

              <div className="w-full pt-6 border-t border-slate-50 dark:border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-slate-400 uppercase tracking-widest text-[10px]">Role</span>
                  <Badge className="bg-primary-500/10 text-primary-500 border-0">{user?.role}</Badge>
                </div>
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-slate-400 uppercase tracking-widest text-[10px]">Status</span>
                  <Badge className="bg-green-500/10 text-green-500 border-0">{user?.status}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column: Detailed Forms */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-0 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden">
              <CardContent className="p-10 space-y-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-500">
                    <User className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">Profile Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <User className="w-3 h-3" /> Full Name
                    </Label>
                    <Input
                      name="name"
                      defaultValue={user?.name}
                      className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <Mail className="w-3 h-3" /> Email Address
                    </Label>
                    <Input
                      disabled
                      defaultValue={user?.email}
                      className="h-14 rounded-2xl border-slate-100 bg-slate-100 dark:bg-slate-800 font-bold opacity-60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <Phone className="w-3 h-3" /> Contact Number
                    </Label>
                    <Input
                      name="contactNumber"
                      defaultValue={user?.contactNumber || ""}
                      className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white transition-all font-bold"
                      placeholder="+880"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <MapPin className="w-3 h-3" /> Address
                    </Label>
                    <Input
                      name="address"
                      defaultValue={user?.address || ""}
                      className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white transition-all font-bold"
                      placeholder="Street, City, Country"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <AlignLeft className="w-3 h-3" /> Short Bio
                  </Label>
                  <Textarea
                    name="bio"
                    defaultValue={user?.bio || ""}
                    className="min-h-[120px] rounded-3xl border-slate-100 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white transition-all font-medium resize-none"
                    placeholder="Tell the community a bit about yourself..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Security Section Placeholder */}
            <Card className="border-0 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden">
              <CardContent className="p-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-secondary-50 dark:bg-secondary-900/20 text-secondary-500">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white">Security & Privacy</h4>
                    <p className="text-sm text-slate-400 font-medium">Update your password and manage sessions</p>
                  </div>
                </div>
                <Button variant="outline" className="rounded-2xl border-slate-200 px-6 font-black h-12">
                  Manage Security
                </Button>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="ghost"
                className="rounded-2xl px-8 font-black text-slate-400 hover:text-slate-600 h-14"
                onClick={() => queryClient.invalidateQueries({ queryKey: ["user-profile"] })}
              >
                Discard Changes
              </Button>
              <Button
                type="submit"
                className="rounded-2xl px-12 font-black h-14 bg-slate-900 dark:bg-white dark:text-slate-950 text-white hover:scale-[1.02] transition-transform gap-2 shadow-xl shadow-slate-900/20 disabled:opacity-50"
                disabled={saving}
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save All Changes
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

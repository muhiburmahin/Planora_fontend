"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Globe, Server, Save, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

export function AdminSettingsModule() {
  const handleSave = () => {
    toast.success("Platform protocols updated successfully");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-6xl mx-auto px-4"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">Security & Protocols</h1>
          <p className="text-base md:text-lg font-medium text-slate-500">Configure global platform security and operational parameters.</p>
        </div>
        <div className="flex h-16 w-16 items-center justify-center rounded-[2rem] bg-gradient-to-br from-secondary-100 to-primary-100 text-secondary-600 shadow-inner group transition-all hover:rotate-12">
          <Shield className="h-8 w-8" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-0 bg-white shadow-2xl shadow-slate-200/50 dark:bg-slate-900 dark:shadow-none rounded-[2rem] overflow-hidden">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 p-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-white shadow-sm dark:bg-slate-700">
                <Globe className="h-6 w-6 text-primary-500" />
              </div>
              <div>
                <CardTitle className="text-xl font-black uppercase tracking-tight">Access Control</CardTitle>
                <CardDescription className="text-xs font-bold text-slate-400">Manage global registration and visibility.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <Label className="text-base font-black text-slate-900 dark:text-white">Public Registration</Label>
                <p className="text-xs text-slate-500 font-medium">Allow new users to join the ecosystem.</p>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-primary-500" />
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-slate-50 dark:border-slate-800 pt-6">
              <div className="space-y-1">
                <Label className="text-base font-black text-slate-900 dark:text-white">Maintenance Mode</Label>
                <p className="text-xs text-slate-500 font-medium">Restrict access to admins only during upgrades.</p>
              </div>
              <Switch className="data-[state=checked]:bg-rose-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white shadow-2xl shadow-slate-200/50 dark:bg-slate-900 dark:shadow-none rounded-[2rem] overflow-hidden">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 p-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-white shadow-sm dark:bg-slate-700">
                <Zap className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <CardTitle className="text-xl font-black uppercase tracking-tight">Performance Mesh</CardTitle>
                <CardDescription className="text-xs font-bold text-slate-400">Optimize platform responsiveness and caching.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <Label className="text-base font-black text-slate-900 dark:text-white">Edge Caching</Label>
                <p className="text-xs text-slate-500 font-medium">Enable global CDN caching for event assets.</p>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-amber-500" />
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-slate-50 dark:border-slate-800 pt-6">
              <div className="space-y-1">
                <Label className="text-base font-black text-slate-900 dark:text-white">Real-time Sync</Label>
                <p className="text-xs text-slate-500 font-medium">Synchronize activity feeds across all nodes.</p>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-secondary-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center md:justify-end pb-10">
        <Button
          onClick={handleSave}
          className="h-16 px-12 rounded-[1.5rem] bg-gradient-to-r from-slate-900 to-primary-900 text-white font-black uppercase tracking-widest hover:scale-105 shadow-2xl shadow-primary-500/20 transition-all active:scale-95 border-0"
        >
          <Save className="h-5 w-5 mr-3" />
          Synchronize Protocols
        </Button>
      </div>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Globe, Server, Save, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function AdminSettingsModule() {
  const handleSave = () => {
    toast.success("Platform protocols updated successfully");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Security & Protocols</h1>
          <p className="text-sm font-medium text-slate-500">Configure global platform security and operational parameters.</p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-100 text-secondary-600 shadow-inner group transition-all hover:scale-110">
           <Shield className="h-7 w-7" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-0 bg-white shadow-xl shadow-slate-200/50 dark:bg-slate-900 dark:shadow-none">
          <CardHeader>
            <div className="flex items-center gap-3">
               <Globe className="h-5 w-5 text-primary-500" />
               <CardTitle className="text-lg font-black uppercase tracking-tight">Access Control</CardTitle>
            </div>
            <CardDescription className="text-xs font-medium">Manage global registration and visibility.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-black text-slate-900">Public Registration</Label>
                <p className="text-[11px] text-slate-500 font-medium">Allow new users to join the ecosystem.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between border-t pt-4">
              <div className="space-y-0.5">
                <Label className="text-sm font-black text-slate-900">Maintenance Mode</Label>
                <p className="text-[11px] text-slate-500 font-medium">Restrict access to admins only during upgrades.</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white shadow-xl shadow-slate-200/50 dark:bg-slate-900 dark:shadow-none">
          <CardHeader>
            <div className="flex items-center gap-3">
               <Zap className="h-5 w-5 text-amber-500" />
               <CardTitle className="text-lg font-black uppercase tracking-tight">Performance Mesh</CardTitle>
            </div>
            <CardDescription className="text-xs font-medium">Optimize platform responsiveness and caching.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-black text-slate-900">Edge Caching</Label>
                <p className="text-[11px] text-slate-500 font-medium">Enable global CDN caching for event assets.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between border-t pt-4">
              <div className="space-y-0.5">
                <Label className="text-sm font-black text-slate-900">Real-time Sync</Label>
                <p className="text-[11px] text-slate-500 font-medium">Synchronize activity feeds across all nodes.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
         <Button 
            onClick={handleSave}
            className="h-14 px-10 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest hover:bg-slate-800 shadow-2xl transition-all active:scale-95"
         >
            <Save className="h-5 w-5 mr-2" />
            Synchronize Protocols
         </Button>
      </div>
    </motion.div>
  );
}

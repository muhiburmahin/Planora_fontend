"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { userService } from "@/services/userService";
import { changeUserStatusAction, changeUserRoleAction } from "@/actions/user.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  UserCog, 
  ShieldCheck, 
  ShieldAlert, 
  UserMinus, 
  UserCheck, 
  MoreHorizontal,
  Mail,
  Calendar,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "../shared/TableSkeleton";

export function AdminUsersModule() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const limit = 8;

  const fetchUsers = async () => {
    setLoading(true);
    const response = await userService.getAllUsers({ searchTerm, status: statusFilter }, { page, limit });
    if (response.success) {
      const payload = response.data as any;
      setUsers(payload.data ?? payload);
      setTotalPages(payload.meta?.totalPage || 1);
    } else {
      toast.error("Failed to load user directory");
    }
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchUsers();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, page, statusFilter]);

  const handleStatusChange = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    const formData = new FormData();
    formData.append("id", id);
    formData.append("status", newStatus);

    const result = await changeUserStatusAction(null, formData);
    if (result.success) {
      toast.success(`User access ${newStatus === 'ACTIVE' ? 'restored' : 'suspended'}`);
      fetchUsers();
    } else {
      toast.error(result.message);
    }
  };

  const handleRoleChange = async (id: string, currentRole: string) => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    const formData = new FormData();
    formData.append("id", id);
    formData.append("role", newRole);

    const result = await changeUserRoleAction(null, formData);
    if (result.success) {
      toast.success(`Privileges updated to ${newRole.toLowerCase()}`);
      fetchUsers();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">User Intelligence</h1>
          <p className="text-sm font-medium text-slate-500">Monitor and manage global platform identities.</p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 shadow-inner group transition-all hover:rotate-6">
           <UserCog className="h-7 w-7" />
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Search by name or email..." 
            className="h-12 pl-10 rounded-2xl border-slate-200 bg-white shadow-sm focus:ring-primary-500"
            value={searchTerm}
            onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
            }}
          />
        </div>
        <Button variant="outline" className="h-12 rounded-2xl border-slate-200 gap-2 font-bold px-6">
           <Filter className="h-4 w-4" />
           Refine Access
        </Button>
      </div>

      <Card className="overflow-hidden border-0 bg-white shadow-2xl shadow-slate-200/50 dark:bg-slate-900 dark:shadow-none">
        <div className="overflow-x-auto">
          {loading ? (
             <TableSkeleton columns={5} rows={8} />
          ) : (
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
                <TableRow>
                  <TableHead className="px-8 py-5 font-black uppercase tracking-widest text-slate-400">Identity</TableHead>
                  <TableHead className="px-8 py-5 font-black uppercase tracking-widest text-slate-400">Access Role</TableHead>
                  <TableHead className="px-8 py-5 font-black uppercase tracking-widest text-slate-400">Integrity Status</TableHead>
                  <TableHead className="px-8 py-5 font-black uppercase tracking-widest text-slate-400">Onboarding</TableHead>
                  <th className="px-8 py-5 text-right font-black uppercase tracking-widest text-slate-400">Control</th>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                {users.map((user, index) => (
                  <motion.tr 
                    key={user.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                  >
                    <TableCell className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 text-sm font-black text-primary-700 shadow-inner group-hover:scale-110 transition-transform">
                          {user.image ? (
                             <img src={user.image} alt="" className="h-full w-full rounded-2xl object-cover" />
                          ) : (
                            user.name?.[0]?.toUpperCase() || 'U'
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-base font-black text-slate-900 dark:text-white">{user.name}</p>
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                             <Mail className="h-3 w-3" />
                             <span className="truncate">{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-5">
                      <Badge className={`rounded-lg border-0 px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                        user.role === 'ADMIN' 
                          ? 'bg-purple-50 text-purple-600 ring-1 ring-purple-200/50' 
                          : 'bg-blue-50 text-blue-600 ring-1 ring-blue-200/50'
                      }`}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className={`h-2.5 w-2.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`}></div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${user.status === 'ACTIVE' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {user.status === 'ACTIVE' ? 'Operational' : 'Restricted'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-5">
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                         <Calendar className="h-3.5 w-3.5 text-primary-500" />
                         {new Date(user.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-100 hover:bg-slate-50 transition-all active:scale-95">
                            <MoreHorizontal className="h-5 w-5 text-slate-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-2xl border-0 p-2 shadow-2xl ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
                          <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            Identity Protocol
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-slate-50 dark:bg-slate-800" />
                          <DropdownMenuItem 
                             onClick={() => handleStatusChange(user.id, user.status)}
                             className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest transition-colors ${
                               user.status === 'ACTIVE' ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'
                             }`}
                          >
                            {user.status === 'ACTIVE' ? (
                              <>
                                <ShieldAlert className="h-4 w-4" />
                                Suspend Account
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="h-4 w-4" />
                                Restore Account
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleRoleChange(user.id, user.role)}
                            className="flex cursor-pointer items-center gap-2 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                          >
                            {user.role === 'ADMIN' ? (
                              <>
                                <UserMinus className="h-4 w-4 text-purple-600" />
                                Downgrade to User
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-4 w-4 text-primary-600" />
                                Elevate to Admin
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
                </AnimatePresence>
                {!loading && users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-24 text-center">
                        <div className="flex flex-col items-center justify-center opacity-40">
                             <UserCog className="h-12 w-12 text-slate-300 mb-2" />
                             <p className="text-sm font-black uppercase tracking-widest text-slate-400">No identities match your parameters</p>
                        </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Intelligence Pagination */}
        <div className="flex items-center justify-between border-t border-slate-50 bg-slate-50/20 px-8 py-6">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Segment <span className="text-primary-600 font-black">{page}</span> / {totalPages}
            </span>
            <div className="flex gap-3">
                <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={page <= 1 || loading}
                    className="h-10 rounded-2xl border-slate-100 font-bold px-6 transition-all active:scale-95"
                    onClick={() => setPage(p => p - 1)}
                >
                    <ChevronLeft className="h-4 w-4 mr-1.5" /> Previous
                </Button>
                <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={page >= totalPages || loading}
                    className="h-10 rounded-2xl border-slate-100 font-bold px-6 transition-all active:scale-95"
                    onClick={() => setPage(p => p + 1)}
                >
                    Next <ChevronRight className="h-4 w-4 ml-1.5" />
                </Button>
            </div>
        </div>
      </Card>
    </motion.div>
  );
}

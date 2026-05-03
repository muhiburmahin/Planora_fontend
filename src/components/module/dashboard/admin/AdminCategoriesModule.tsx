"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Trash2,
  SquarePen,
  ShieldCheck,
  ShieldX,
  AlertCircle,
  Tags,
  Hash,
  Activity,
  Search,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { categoryService } from "@/services/categoryService";
import { createCategoryAction, deleteCategoryAction, toggleCategoryStatusAction, updateCategoryAction } from "@/actions/category.actions";
import { categoryFormSchema, CategoryFormInput } from "@/lib/validations/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "../shared/TableSkeleton";

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  isActive: boolean;
  _count?: { events: number };
};

const defaultValues: CategoryFormInput = {
  name: "",
  description: "",
};

export function AdminCategoriesModule() {
  const [items, setItems] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

  const createForm = useForm<CategoryFormInput>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues,
  });

  const editForm = useForm<CategoryFormInput>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues,
  });

  const loadCategories = async () => {
    setLoading(true);
    const response = await categoryService.getAllCategories({ searchTerm }, { limit, page });
    if (response?.success) {
      const payload = response.data as any;
      setItems(payload?.data ?? payload ?? []);
      setTotalPages(payload?.meta?.totalPages || 1);
    }
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCategories();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, page]);

  const onCreateSubmit = createForm.handleSubmit(async (data) => {
    setSubmitting(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description || "");
    const result = await createCategoryAction(null, formData);
    setSubmitting(false);
    if (!result?.success) {
      toast.error(result?.message || "Failed to create");
      return;
    }
    toast.success("Category defined successfully");
    createForm.reset(defaultValues);
    setCreateOpen(false);
    loadCategories();
  });

  const openEdit = (item: CategoryItem) => {
    setEditing(item);
    editForm.reset({
      name: item.name,
      description: item.description || "",
    });
    setEditOpen(true);
  };

  const onEditSubmit = editForm.handleSubmit(async (data) => {
    if (!editing) return;
    setSubmitting(true);
    const formData = new FormData();
    formData.append("id", editing.id);
    formData.append("name", data.name);
    formData.append("description", data.description || "");
    const result = await updateCategoryAction(null, formData);
    setSubmitting(false);
    if (!result?.success) {
      toast.error(result?.message || "Failed to update");
      return;
    }
    toast.success("Category refined successfully");
    setEditOpen(false);
    setEditing(null);
    loadCategories();
  });

  const onToggleStatus = async (id: string) => {
    const formData = new FormData();
    formData.append("id", id);
    const result = await toggleCategoryStatusAction(null, formData);
    if (result?.success) {
      toast.success("Status updated");
      loadCategories();
    } else {
      toast.error(result?.message || "Failed to update status");
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Are you sure? This classification will be archived.")) return;
    const formData = new FormData();
    formData.append("id", id);
    const result = await deleteCategoryAction(null, formData);
    if (result?.success) {
      toast.success("Category removed from active taxonomy");
      loadCategories();
    } else {
      toast.error(result?.message || "Failed to delete");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Taxonomy Manager</h1>
          <p className="text-sm font-medium text-slate-500">Curate and organize the event classifications.</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 px-6 py-6 font-black text-white shadow-xl shadow-primary-500/20 transition-all hover:scale-105 active:scale-95">
              <Plus className="mr-2 h-5 w-5" />
              New Classification
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl border-0 bg-white p-0 shadow-2xl dark:bg-slate-900">
            <div className="bg-gradient-to-r from-primary-900 to-primary-700 px-8 py-8 text-white">
              <DialogTitle className="text-3xl font-black">Define Category</DialogTitle>
              <DialogDescription className="text-primary-100/80 font-medium tracking-tight">Add a new dimension to event organization.</DialogDescription>
            </div>
            <form onSubmit={onCreateSubmit} className="space-y-6 p-8">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Label Name</Label>
                <Input {...createForm.register("name")} className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white" placeholder="e.g. Masterclass" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Contextual Description</Label>
                <Textarea {...createForm.register("description")} className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white" rows={4} placeholder="What kind of events fall under this?..." />
              </div>
              <Button type="submit" disabled={submitting} className="h-14 w-full rounded-2xl bg-gradient-to-r from-primary-600 to-primary-800 text-lg font-black text-white shadow-xl shadow-primary-500/20">
                {submitting ? <Loader2 className="h-6 w-6 animate-spin" /> : "Authorize Category"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input 
              placeholder="Search taxonomy..." 
              className="h-12 pl-10 rounded-2xl border-slate-200 shadow-sm focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
          />
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
                  <TableHead className="px-8 py-5 font-black uppercase tracking-widest text-slate-400">Metadata</TableHead>
                  <TableHead className="px-8 py-5 font-black uppercase tracking-widest text-slate-400">Metric</TableHead>
                  <TableHead className="px-8 py-5 font-black uppercase tracking-widest text-slate-400">Status</TableHead>
                  <TableHead className="px-8 py-5 text-right font-black uppercase tracking-widest text-slate-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                <motion.tr 
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                >
                  <TableCell className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100/50 text-primary-700 shadow-inner group-hover:scale-110 transition-transform">
                        <Tags className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-base font-black text-slate-900 dark:text-white">{item.name}</p>
                        <p className="text-[10px] font-medium text-slate-400 line-clamp-1 max-w-[250px]">{item.description || "N/A"}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-5">
                    <div className="flex items-center gap-1 text-xs font-black text-slate-500 uppercase tracking-tighter">
                      <Hash className="h-3.5 w-3.5 text-slate-300" />
                      {item.slug}
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-5">
                    <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
                      <Activity className="h-4 w-4 text-primary-500" />
                      {item._count?.events ?? 0} <span className="text-[10px] text-slate-400">NODES</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-5">
                    <Badge className={`rounded-lg border-0 px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                        item.isActive ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200" : "bg-slate-50 text-slate-400 ring-1 ring-slate-200"
                    }`}>
                      {item.isActive ? "Operational" : "Standby"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-3">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-10 w-10 rounded-xl border-slate-100 hover:bg-primary-50 hover:text-primary-600 transition-all hover:scale-110" 
                        onClick={() => openEdit(item)}
                      >
                        <SquarePen className="h-5 w-5" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-10 w-10 rounded-xl border-slate-100 hover:bg-red-50 hover:text-red-600 transition-all hover:scale-110" 
                        onClick={() => onDelete(item.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
              </AnimatePresence>
            </TableBody>
            </Table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-50 bg-slate-50/20 px-8 py-6">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                Segment <span className="text-slate-900">{page}</span> / {totalPages}
            </span>
            <div className="flex gap-2">
                <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={page <= 1 || loading}
                    className="h-10 rounded-xl border-slate-100 font-bold px-4"
                    onClick={() => setPage(p => p - 1)}
                >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                </Button>
                <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={page >= totalPages || loading}
                    className="h-10 rounded-xl border-slate-100 font-bold px-4"
                    onClick={() => setPage(p => p + 1)}
                >
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </div>
        </div>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="rounded-3xl border-0 bg-white p-0 shadow-2xl dark:bg-slate-900">
          <div className="bg-gradient-to-r from-secondary-900 to-secondary-700 px-8 py-8 text-white">
            <DialogTitle className="text-3xl font-black">Refine Category</DialogTitle>
            <DialogDescription className="text-secondary-100/80 font-medium">Calibrate classification parameters.</DialogDescription>
          </div>
          <form onSubmit={onEditSubmit} className="space-y-6 p-8">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Label</Label>
              <Input {...editForm.register("name")} className="h-12 rounded-xl border-slate-200" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Operational Logic</Label>
              <Textarea {...editForm.register("description")} className="rounded-xl border-slate-200" rows={4} />
            </div>
            <Button type="submit" disabled={submitting} className="h-14 w-full rounded-2xl bg-gradient-to-r from-secondary-600 to-secondary-800 text-lg font-black text-white shadow-xl shadow-secondary-500/20">
              {submitting ? <Loader2 className="h-6 w-6 animate-spin" /> : "Commit Changes"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

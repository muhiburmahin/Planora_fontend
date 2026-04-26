"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, SquarePen, ShieldCheck, ShieldX, AlertCircle } from "lucide-react";
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
  const [actionError, setActionError] = useState<string | null>(null);

  const createForm = useForm<CategoryFormInput>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues,
  });

  const editForm = useForm<CategoryFormInput>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues,
  });

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
    [items]
  );

  const loadCategories = async () => {
    setLoading(true);
    const response = await categoryService.getAllCategories({}, { limit: 200, page: 1 });
    if (!response?.success) {
      toast.error(response?.message || "Failed to load categories");
      setLoading(false);
      return;
    }
    const payload = response.data as any;
    setItems(payload?.data ?? payload ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void loadCategories();
  }, []);

  const onCreateSubmit = createForm.handleSubmit(async (data) => {
    setActionError(null);
    setSubmitting(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description || "");
    const result = await createCategoryAction(null, formData);
    setSubmitting(false);
    if (!result?.success) {
      const message = result?.message || "Failed to create category";
      setActionError(message);
      toast.error(message);
      return;
    }
    toast.success(result.message || "Category created");
    createForm.reset(defaultValues);
    setCreateOpen(false);
    await loadCategories();
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
    setActionError(null);
    setSubmitting(true);
    const formData = new FormData();
    formData.append("id", editing.id);
    formData.append("name", data.name);
    formData.append("description", data.description || "");
    const result = await updateCategoryAction(null, formData);
    setSubmitting(false);
    if (!result?.success) {
      const message = result?.message || "Failed to update category";
      setActionError(message);
      toast.error(message);
      return;
    }
    toast.success(result.message || "Category updated");
    setEditOpen(false);
    setEditing(null);
    await loadCategories();
  });

  const onToggleStatus = async (id: string) => {
    setActionError(null);
    const formData = new FormData();
    formData.append("id", id);
    const result = await toggleCategoryStatusAction(null, formData);
    if (!result?.success) {
      const message = result?.message || "Failed to change category status";
      setActionError(message);
      toast.error(message);
      return;
    }
    toast.success(result.message || "Category status updated");
    await loadCategories();
  };

  const onDelete = async (id: string) => {
    setActionError(null);
    const formData = new FormData();
    formData.append("id", id);
    const result = await deleteCategoryAction(null, formData);
    if (!result?.success) {
      const message = result?.message || "Failed to delete category";
      setActionError(message);
      toast.error(message);
      return;
    }
    toast.success(result.message || "Category deleted");
    await loadCategories();
  };

  return (
    <Card className="border-primary-200/80 bg-white/95 shadow-lg shadow-primary-200/20">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-slate-900">Category Management</CardTitle>
          <p className="mt-1 text-xs font-medium text-primary-700">Create, update, activate, and remove categories</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-gradient-primary text-white sm:w-auto">
              <Plus className="mr-1 h-4 w-4" />
              Create Category
            </Button>
          </DialogTrigger>
          <DialogContent className="border-primary-200 bg-white sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Category</DialogTitle>
              <DialogDescription>Add a new category for event organization.</DialogDescription>
            </DialogHeader>
            <form onSubmit={onCreateSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="create-name">Name</Label>
                <Input id="create-name" {...createForm.register("name")} />
                {createForm.formState.errors.name && (
                  <p className="text-xs font-medium text-red-500">{createForm.formState.errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-description">Description</Label>
                <Textarea id="create-description" rows={4} {...createForm.register("description")} />
                {createForm.formState.errors.description && (
                  <p className="text-xs font-medium text-red-500">{createForm.formState.errors.description.message}</p>
                )}
              </div>
              <DialogFooter>
                <Button type="submit" disabled={submitting}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        {actionError && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            <AlertCircle className="h-4 w-4" />
            <span>{actionError}</span>
          </div>
        )}
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading categories...
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-primary-100 bg-gradient-to-br from-primary-50/50 to-secondary-50/60">
          <Table>
            <TableHeader>
              <TableRow className="bg-white/80">
                <TableHead className="font-bold text-primary-800">Name</TableHead>
                <TableHead className="font-bold text-primary-800">Description</TableHead>
                <TableHead className="font-bold text-primary-800">Events</TableHead>
                <TableHead className="font-bold text-primary-800">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedItems.map((item) => (
                <TableRow key={item.id} className="bg-white/70">
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.description || "N/A"}</TableCell>
                  <TableCell>{item._count?.events ?? 0}</TableCell>
                  <TableCell>
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${item.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" className="border-primary-200 text-primary-700 hover:bg-primary-50" onClick={() => openEdit(item)}>
                        <SquarePen className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-secondary-200 text-secondary-700 hover:bg-secondary-50" onClick={() => void onToggleStatus(item.id)}>
                        {item.isActive ? <ShieldX className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                      </Button>
                      <Button size="sm" variant="destructive" className="bg-red-500 hover:bg-red-600" onClick={() => void onDelete(item.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {sortedItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-slate-500">
                    No categories found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="border-primary-200 bg-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={onEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input id="edit-name" {...editForm.register("name")} />
              {editForm.formState.errors.name && (
                <p className="text-xs font-medium text-red-500">{editForm.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea id="edit-description" rows={4} {...editForm.register("description")} />
              {editForm.formState.errors.description && (
                <p className="text-xs font-medium text-red-500">{editForm.formState.errors.description.message}</p>
              )}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

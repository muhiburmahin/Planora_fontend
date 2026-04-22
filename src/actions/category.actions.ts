"use server";
import { categoryService } from "@/services/categoryService";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CreateCategoryPayload, UpdateCategoryPayload } from "@/types/category";

// Create Category Action
export const createCategoryAction = async (prevState: any, formData: FormData) => {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const icon = formData.get("icon") as File;

    const payload: CreateCategoryPayload = { name };
    if (description) payload.description = description;
    if (icon) payload.icon = icon;

    const response = await categoryService.server.createCategory(payload);

    if (response.error) {
        return { success: false, message: response.error.message };
    }

    revalidatePath("/admin/categories");
    revalidatePath("/categories");
    return { success: true, message: "Category created successfully", data: response.data };
};

// Update Category Action
export const updateCategoryAction = async (prevState: any, formData: FormData) => {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const icon = formData.get("icon") as File;

    const payload: UpdateCategoryPayload = {};
    if (name) payload.name = name;
    if (description) payload.description = description;
    if (icon) payload.icon = icon;

    const response = await categoryService.server.updateCategory(id, payload);

    if (response.error) {
        return { success: false, message: response.error.message };
    }

    revalidatePath("/admin/categories");
    revalidatePath("/categories");
    revalidatePath(`/categories/${response.data.slug}`);
    return { success: true, message: "Category updated successfully", data: response.data };
};

// Toggle Category Status Action (Admin only)
export const toggleCategoryStatusAction = async (prevState: any, formData: FormData) => {
    const id = formData.get("id") as string;

    const response = await categoryService.server.toggleCategoryStatus(id);

    if (response.error) {
        return { success: false, message: response.error.message };
    }

    revalidatePath("/admin/categories");
    revalidatePath("/categories");
    return { success: true, message: "Category status updated successfully", data: response.data };
};

// Delete Category Action (Admin only)
export const deleteCategoryAction = async (prevState: any, formData: FormData) => {
    const id = formData.get("id") as string;

    const response = await categoryService.server.deleteCategory(id);

    if (response.error) {
        return { success: false, message: response.error.message };
    }

    revalidatePath("/admin/categories");
    revalidatePath("/categories");
    return { success: true, message: "Category deleted successfully" };
};

// Get All Categories Action (for server components)
export const getAllCategoriesAction = async (filters?: any, options?: any) => {
    const response = await categoryService.server.getAllCategories(filters, options);

    if (response.error) {
        throw new Error(response.error.message);
    }

    return response.data;
};

// Get Single Category Action (for server components)
export const getSingleCategoryAction = async (slug: string) => {
    const response = await categoryService.server.getSingleCategory(slug);

    if (response.error) {
        throw new Error(response.error.message);
    }

    return response.data;
};
import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@/services/categoryService';
import { Category } from '@/types/category';

export const useGetAllCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async (): Promise<Category[]> => {
            const response = await categoryService.getAllCategories();
            return response.data || [];
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useGetCategoryById = (id: string) => {
    return useQuery({
        queryKey: ['category', id],
        queryFn: async (): Promise<Category> => {
            const response = await categoryService.getCategoryById(id);
            return response.data;
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
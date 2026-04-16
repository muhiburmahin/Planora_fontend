import { useQuery } from '@tanstack/react-query';
import { CategoryService } from '@/services/categoryService';
import { ICategory } from '@/types';

export const useCategories = () => {
    return useQuery<ICategory[]>({
        queryKey: ['categories'],
        queryFn: CategoryService.getAllCategories,
    });
};

export const useCategory = (id: string) => {
    return useQuery<ICategory>({
        queryKey: ['categories', id],
        queryFn: () => CategoryService.getCategoryById(id),
        enabled: !!id,
    });
};

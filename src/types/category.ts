export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    icon?: string | null;
    color?: string | null;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count?: {
        events: number;
    };
}

export interface CategoryUI extends Partial<Category> {
    id: string;
    name: string;
    color: string;
    iconName: string;
}

export interface CreateCategoryPayload {
    name: string;
    description?: string;
    icon?: File | string;
}

export interface UpdateCategoryPayload {
    name?: string;
    description?: string;
    icon?: File | string;
}

export interface CategoryFilters {
    searchTerm?: string;
    isActive?: boolean;
}

export interface CategoryOptions {
    limit?: number;
    page?: number;
}

export interface CategoryResponse {
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    data: Category[];
}

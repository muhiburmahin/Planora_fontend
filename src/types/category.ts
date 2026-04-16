export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    icon?: string | null;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count?: {
        events: number;
    };
}

export interface CategoryUI extends Partial<Category> {
    name: string;
    color: string;
    iconName: string;
}
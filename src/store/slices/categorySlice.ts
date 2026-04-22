import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { categoryService } from '@/services/categoryService';
import { Category, CategoryFilters, CategoryOptions, CategoryResponse, CreateCategoryPayload, UpdateCategoryPayload } from '@/types/category';

interface CategoryState {
    categories: Category[];
    currentCategory: Category | null;
    loading: boolean;
    error: string | null;
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    } | null;
}

const initialState: CategoryState = {
    categories: [],
    currentCategory: null,
    loading: false,
    error: null,
    meta: null,
};

// Async thunks
export const getAllCategoriesAsync = createAsyncThunk<
    CategoryResponse,
    { filters?: CategoryFilters; options?: CategoryOptions },
    { rejectValue: string }
>(
    'category/getAllCategories',
    async ({ filters, options }, { rejectWithValue }) => {
        try {
            const response = await categoryService.getAllCategories(filters, options);
            if (response.error) {
                return rejectWithValue(response.error.message);
            }
            return response.data;
        } catch (error) {
            return rejectWithValue('Failed to fetch categories');
        }
    }
);

export const getSingleCategoryAsync = createAsyncThunk<
    Category,
    string,
    { rejectValue: string }
>(
    'category/getSingleCategory',
    async (slug, { rejectWithValue }) => {
        try {
            const response = await categoryService.getSingleCategory(slug);
            if (response.error) {
                return rejectWithValue(response.error.message);
            }
            return response.data;
        } catch (error) {
            return rejectWithValue('Failed to fetch category');
        }
    }
);

export const createCategoryAsync = createAsyncThunk<
    Category,
    CreateCategoryPayload,
    { rejectValue: string }
>(
    'category/createCategory',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await categoryService.createCategory(payload);
            if (response.error) {
                return rejectWithValue(response.error.message);
            }
            return response.data;
        } catch (error) {
            return rejectWithValue('Failed to create category');
        }
    }
);

export const updateCategoryAsync = createAsyncThunk<
    Category,
    { id: string; payload: UpdateCategoryPayload },
    { rejectValue: string }
>(
    'category/updateCategory',
    async ({ id, payload }, { rejectWithValue }) => {
        try {
            const response = await categoryService.updateCategory(id, payload);
            if (response.error) {
                return rejectWithValue(response.error.message);
            }
            return response.data;
        } catch (error) {
            return rejectWithValue('Failed to update category');
        }
    }
);

export const toggleCategoryStatusAsync = createAsyncThunk<
    Category,
    string,
    { rejectValue: string }
>(
    'category/toggleCategoryStatus',
    async (id, { rejectWithValue }) => {
        try {
            const response = await categoryService.toggleCategoryStatus(id);
            if (response.error) {
                return rejectWithValue(response.error.message);
            }
            return response.data;
        } catch (error) {
            return rejectWithValue('Failed to toggle category status');
        }
    }
);

export const deleteCategoryAsync = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>(
    'category/deleteCategory',
    async (id, { rejectWithValue }) => {
        try {
            const response = await categoryService.deleteCategory(id);
            if (response.error) {
                return rejectWithValue(response.error.message);
            }
            return id;
        } catch (error) {
            return rejectWithValue('Failed to delete category');
        }
    }
);

// Slice
const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentCategory: (state) => {
            state.currentCategory = null;
        },
        setCurrentCategory: (state, action: PayloadAction<Category>) => {
            state.currentCategory = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get all categories
            .addCase(getAllCategoriesAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCategoriesAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload.data;
                state.meta = action.payload.meta;
            })
            .addCase(getAllCategoriesAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch categories';
            })

            // Get single category
            .addCase(getSingleCategoryAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSingleCategoryAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.currentCategory = action.payload;
            })
            .addCase(getSingleCategoryAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch category';
            })

            // Create category
            .addCase(createCategoryAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCategoryAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.categories.unshift(action.payload);
                if (state.meta) {
                    state.meta.total += 1;
                }
            })
            .addCase(createCategoryAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to create category';
            })

            // Update category
            .addCase(updateCategoryAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCategoryAsync.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.categories.findIndex(cat => cat.id === action.payload.id);
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
                if (state.currentCategory?.id === action.payload.id) {
                    state.currentCategory = action.payload;
                }
            })
            .addCase(updateCategoryAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update category';
            })

            // Toggle category status
            .addCase(toggleCategoryStatusAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(toggleCategoryStatusAsync.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.categories.findIndex(cat => cat.id === action.payload.id);
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
                if (state.currentCategory?.id === action.payload.id) {
                    state.currentCategory = action.payload;
                }
            })
            .addCase(toggleCategoryStatusAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to toggle category status';
            })

            // Delete category
            .addCase(deleteCategoryAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCategoryAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = state.categories.filter(cat => cat.id !== action.payload);
                if (state.meta) {
                    state.meta.total -= 1;
                }
                if (state.currentCategory?.id === action.payload) {
                    state.currentCategory = null;
                }
            })
            .addCase(deleteCategoryAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to delete category';
            });
    },
});

export const { clearError, clearCurrentCategory, setCurrentCategory } = categorySlice.actions;
export default categorySlice.reducer;
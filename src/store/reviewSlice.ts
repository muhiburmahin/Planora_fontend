import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { reviewService } from '@/services/reviewService';
import { Review, ReviewResponse, ReviewStats, CreateReviewPayload, UpdateReviewPayload, ReviewOptions } from '@/types/review';

interface ReviewState {
  reviews: Review[];
  myReviews: Review[];
  stats: ReviewStats | null;
  loading: boolean;
  error: string | null;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  } | null;
}

const initialState: ReviewState = {
  reviews: [],
  myReviews: [],
  stats: null,
  loading: false,
  error: null,
  meta: null,
};

export const createReviewAsync = createAsyncThunk(
  'reviews/createReview',
  async (payload: CreateReviewPayload) => {
    const response = await reviewService.createReview(payload);
    return response.data;
  }
);

export const getEventReviewsAsync = createAsyncThunk(
  'reviews/getEventReviews',
  async ({ eventId, options }: { eventId: string; options?: ReviewOptions }) => {
    const response = await reviewService.getEventReviews(eventId, options);
    return response.data;
  }
);

export const getReviewStatsAsync = createAsyncThunk(
  'reviews/getReviewStats',
  async (eventId: string) => {
    const response = await reviewService.getReviewStats(eventId);
    return response.data;
  }
);

export const getMyReviewsAsync = createAsyncThunk(
  'reviews/getMyReviews',
  async (options?: ReviewOptions) => {
    const response = await reviewService.getMyReviews(options);
    return response.data;
  }
);

export const updateReviewAsync = createAsyncThunk(
  'reviews/updateReview',
  async ({ id, payload }: { id: string; payload: UpdateReviewPayload }) => {
    const response = await reviewService.updateReview(id, payload);
    return { id, data: response.data };
  }
);

export const deleteReviewAsync = createAsyncThunk(
  'reviews/deleteReview',
  async (id: string) => {
    await reviewService.deleteReview(id);
    return id;
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearReviews: (state) => {
      state.reviews = [];
      state.meta = null;
    },
    clearMyReviews: (state) => {
      state.myReviews = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Review
      .addCase(createReviewAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReviewAsync.fulfilled, (state, action: PayloadAction<Review>) => {
        state.loading = false;
        state.reviews.unshift(action.payload); // Add to beginning of list
      })
      .addCase(createReviewAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create review';
      })
      // Get Event Reviews
      .addCase(getEventReviewsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEventReviewsAsync.fulfilled, (state, action: PayloadAction<ReviewResponse>) => {
        state.loading = false;
        state.reviews = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(getEventReviewsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch reviews';
      })
      // Get Review Stats
      .addCase(getReviewStatsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReviewStatsAsync.fulfilled, (state, action: PayloadAction<ReviewStats>) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(getReviewStatsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch review stats';
      })
      // Get My Reviews
      .addCase(getMyReviewsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyReviewsAsync.fulfilled, (state, action: PayloadAction<ReviewResponse>) => {
        state.loading = false;
        state.myReviews = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(getMyReviewsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch my reviews';
      })
      // Update Review
      .addCase(updateReviewAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReviewAsync.fulfilled, (state, action) => {
        state.loading = false;
        const { id, data } = action.payload;
        const index = state.reviews.findIndex(review => review.id === id);
        if (index !== -1) {
          state.reviews[index] = data;
        }
        const myIndex = state.myReviews.findIndex(review => review.id === id);
        if (myIndex !== -1) {
          state.myReviews[myIndex] = data;
        }
      })
      .addCase(updateReviewAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update review';
      })
      // Delete Review
      .addCase(deleteReviewAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReviewAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = state.reviews.filter(review => review.id !== action.payload);
        state.myReviews = state.myReviews.filter(review => review.id !== action.payload);
      })
      .addCase(deleteReviewAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete review';
      });
  },
});

export const { clearError, clearReviews, clearMyReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
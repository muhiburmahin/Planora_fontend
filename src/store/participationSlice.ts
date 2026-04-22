import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { participationService, Participation, ParticipationResponse } from '@/services/participationService';

interface ParticipationState {
  participations: Participation[];
  currentParticipation: Participation | null;
  loading: boolean;
  error: string | null;
  meta: {
    page: number;
    limit: number;
    total: number;
  } | null;
}

const initialState: ParticipationState = {
  participations: [],
  currentParticipation: null,
  loading: false,
  error: null,
  meta: null,
};

export const joinEventAsync = createAsyncThunk(
  'participations/joinEvent',
  async (eventId: string) => {
    const response = await participationService.joinEvent({ eventId });
    return response.data;
  }
);

export const fetchMyParticipations = createAsyncThunk(
  'participations/fetchMyParticipations',
  async (options?: any) => {
    const response = await participationService.getMyParticipations(options);
    return response.data;
  }
);

export const fetchAllParticipations = createAsyncThunk(
  'participations/fetchAllParticipations',
  async ({ filters, options }: { filters?: any; options?: any }) => {
    const response = await participationService.getAllParticipations(filters, options);
    return response.data;
  }
);

export const fetchSingleParticipation = createAsyncThunk(
  'participations/fetchSingleParticipation',
  async (id: string) => {
    const response = await participationService.getSingleParticipation(id);
    return response.data;
  }
);

export const updateParticipationStatus = createAsyncThunk(
  'participations/updateStatus',
  async ({ id, status }: { id: string; status: string }) => {
    const response = await participationService.updateStatus(id, { status });
    return response.data;
  }
);

export const cancelParticipationAsync = createAsyncThunk(
  'participations/cancelParticipation',
  async (id: string) => {
    await participationService.cancelParticipation(id);
    return id;
  }
);

const participationSlice = createSlice({
  name: 'participations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentParticipation: (state, action: PayloadAction<Participation | null>) => {
      state.currentParticipation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(joinEventAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinEventAsync.fulfilled, (state, action: PayloadAction<Participation>) => {
        state.loading = false;
        state.participations.unshift(action.payload);
      })
      .addCase(joinEventAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to join event';
      })
      .addCase(fetchMyParticipations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyParticipations.fulfilled, (state, action: PayloadAction<ParticipationResponse>) => {
        state.loading = false;
        state.participations = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchMyParticipations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch participations';
      })
      .addCase(fetchAllParticipations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllParticipations.fulfilled, (state, action: PayloadAction<ParticipationResponse>) => {
        state.loading = false;
        state.participations = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchAllParticipations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch participations';
      })
      .addCase(fetchSingleParticipation.fulfilled, (state, action: PayloadAction<Participation>) => {
        state.currentParticipation = action.payload;
      })
      .addCase(updateParticipationStatus.fulfilled, (state, action: PayloadAction<Participation>) => {
        const index = state.participations.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.participations[index] = action.payload;
        }
        if (state.currentParticipation?.id === action.payload.id) {
          state.currentParticipation = action.payload;
        }
      })
      .addCase(cancelParticipationAsync.fulfilled, (state, action: PayloadAction<string>) => {
        state.participations = state.participations.filter(p => p.id !== action.payload);
        if (state.currentParticipation?.id === action.payload) {
          state.currentParticipation = null;
        }
      });
  },
});

export const { clearError, setCurrentParticipation } = participationSlice.actions;
export default participationSlice.reducer;

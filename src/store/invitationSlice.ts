import { invitationService } from '@/services/invitationService';
import { Invitation, InvitationFilterRequest, InvitationOptions, InvitationResponse, RespondInvitationPayload, SendInvitationPayload } from '@/types/invitation';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface InvitationState {
  invitations: Invitation[];
  sentInvitations: Invitation[];
  allInvitations: Invitation[];
  currentInvitation: Invitation | null;
  loading: boolean;
  error: string | null;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage?: number;
  } | null;
}

const initialState: InvitationState = {
  invitations: [],
  sentInvitations: [],
  allInvitations: [],
  currentInvitation: null,
  loading: false,
  error: null,
  meta: null,
};

export const sendInvitationAsync = createAsyncThunk(
  'invitations/sendInvitation',
  async (payload: SendInvitationPayload) => {
    const response = await invitationService.sendInvitation(payload);
    return response.data;
  }
);

export const respondToInvitationAsync = createAsyncThunk(
  'invitations/respondToInvitation',
  async ({ id, payload }: { id: string; payload: RespondInvitationPayload }) => {
    const response = await invitationService.respondToInvitation(id, payload);
    return { id, data: response.data };
  }
);

export const getMyInvitationsAsync = createAsyncThunk(
  'invitations/getMyInvitations',
  async () => {
    const response = await invitationService.getMyInvitations();
    return response.data;
  }
);

export const getSentInvitationsAsync = createAsyncThunk(
  'invitations/getSentInvitations',
  async () => {
    const response = await invitationService.getSentInvitations();
    return response.data;
  }
);

export const getAllInvitationsAsync = createAsyncThunk(
  'invitations/getAllInvitations',
  async ({ filters, options }: { filters?: InvitationFilterRequest; options?: InvitationOptions } = {}) => {
    const response = await invitationService.getAllInvitations(filters, options);
    return response.data;
  }
);

export const getSingleInvitationAsync = createAsyncThunk(
  'invitations/getSingleInvitation',
  async (id: string) => {
    const response = await invitationService.getSingleInvitation(id);
    return response.data;
  }
);

export const withdrawInvitationAsync = createAsyncThunk(
  'invitations/withdrawInvitation',
  async (id: string) => {
    await invitationService.withdrawInvitation(id);
    return id;
  }
);

export const cleanupInvitationsAsync = createAsyncThunk(
  'invitations/cleanupInvitations',
  async () => {
    const response = await invitationService.cleanupInvitations();
    return response.data;
  }
);

const invitationSlice = createSlice({
  name: 'invitations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearInvitations: (state) => {
      state.invitations = [];
      state.sentInvitations = [];
      state.allInvitations = [];
      state.meta = null;
    },
    setCurrentInvitation: (state, action: PayloadAction<Invitation | null>) => {
      state.currentInvitation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send Invitation
      .addCase(sendInvitationAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendInvitationAsync.fulfilled, (state, action: PayloadAction<Invitation>) => {
        state.loading = false;
        state.sentInvitations.unshift(action.payload);
      })
      .addCase(sendInvitationAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to send invitation';
      })
      // Respond to Invitation
      .addCase(respondToInvitationAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(respondToInvitationAsync.fulfilled, (state, action) => {
        state.loading = false;
        const { id, data } = action.payload;
        const index = state.invitations.findIndex(inv => inv.id === id);
        if (index !== -1) {
          state.invitations[index] = data;
        }
      })
      .addCase(respondToInvitationAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to respond to invitation';
      })
      // Get My Invitations
      .addCase(getMyInvitationsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyInvitationsAsync.fulfilled, (state, action: PayloadAction<Invitation[]>) => {
        state.loading = false;
        state.invitations = action.payload;
      })
      .addCase(getMyInvitationsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch invitations';
      })
      // Get Sent Invitations
      .addCase(getSentInvitationsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSentInvitationsAsync.fulfilled, (state, action: PayloadAction<Invitation[]>) => {
        state.loading = false;
        state.sentInvitations = action.payload;
      })
      .addCase(getSentInvitationsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch sent invitations';
      })
      // Get All Invitations
      .addCase(getAllInvitationsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllInvitationsAsync.fulfilled, (state, action: PayloadAction<InvitationResponse>) => {
        state.loading = false;
        state.allInvitations = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(getAllInvitationsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch all invitations';
      })
      // Get Single Invitation
      .addCase(getSingleInvitationAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSingleInvitationAsync.fulfilled, (state, action: PayloadAction<Invitation>) => {
        state.loading = false;
        state.currentInvitation = action.payload;
      })
      .addCase(getSingleInvitationAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch invitation';
      })
      // Withdraw Invitation
      .addCase(withdrawInvitationAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(withdrawInvitationAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.sentInvitations = state.sentInvitations.filter(inv => inv.id !== action.payload);
      })
      .addCase(withdrawInvitationAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to withdraw invitation';
      })
      // Cleanup Invitations
      .addCase(cleanupInvitationsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cleanupInvitationsAsync.fulfilled, (state) => {
        state.loading = false;
        // Optionally refresh the lists
      })
      .addCase(cleanupInvitationsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to cleanup invitations';
      });
  },
});

export const { clearError, clearInvitations, setCurrentInvitation } = invitationSlice.actions;
export default invitationSlice.reducer;
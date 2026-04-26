import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { paymentService } from '@/services/paymentService';

interface PaymentState {
  loading: boolean;
  error: string | null;
  clientSecret: string | null;
}

const initialState: PaymentState = {
  loading: false,
  error: null,
  clientSecret: null,
};

export const initPaymentAsync = createAsyncThunk(
  'payments/initPayment',
  async ({ participationId, amount }: { participationId: string; amount: number }) => {
    const response = await paymentService.createPaymentIntent({ participationId, amount });
    return response.data;
  }
);

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearPaymentUrl: (state) => {
      state.clientSecret = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initPaymentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initPaymentAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.clientSecret = action.payload?.clientSecret || null;
      })
      .addCase(initPaymentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to initialize payment';
      });
  },
});

export const { clearError, clearPaymentUrl } = paymentSlice.actions;
export default paymentSlice.reducer;

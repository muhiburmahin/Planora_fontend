import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { paymentService } from '@/services/paymentService';

interface PaymentState {
  loading: boolean;
  error: string | null;
  paymentUrl: string | null;
}

const initialState: PaymentState = {
  loading: false,
  error: null,
  paymentUrl: null,
};

export const initPaymentAsync = createAsyncThunk(
  'payments/initPayment',
  async ({ participationId, amount }: { participationId: string; amount: number }) => {
    const response = await paymentService.initPayment({ participationId, amount });
    return response.data;
  }
);

export const verifyPaymentAsync = createAsyncThunk(
  'payments/verifyPayment',
  async ({ tranId, pId }: { tranId: string; pId: string }) => {
    const response = await paymentService.verifyPayment(tranId, pId);
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
      state.paymentUrl = null;
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
        state.paymentUrl = action.payload.successUrl;
      })
      .addCase(initPaymentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to initialize payment';
      })
      .addCase(verifyPaymentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPaymentAsync.fulfilled, (state) => {
        state.loading = false;
        state.paymentUrl = null;
      })
      .addCase(verifyPaymentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Payment verification failed';
      });
  },
});

export const { clearError, clearPaymentUrl } = paymentSlice.actions;
export default paymentSlice.reducer;

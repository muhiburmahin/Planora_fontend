import { httpClient } from '@/lib/axios/httpClient';
import { ApiResponse } from '@/types/api.types';

export interface Payment {
  id: string;
  participationId: string;
  amount: number;
  transactionId: string;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
  paidAt?: string;
  cardType?: string;
  bankTranId?: string;
  valId?: string;
  storeAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentPayload {
  participationId: string;
  amount: number;
}

export interface PaymentInitResponse {
  successUrl: string;
}

const initPayment = async (payload: PaymentPayload): Promise<ApiResponse<PaymentInitResponse>> => {
  return httpClient.post<PaymentInitResponse>('/payments/init', payload);
};

const verifyPayment = async (tranId: string, pId: string): Promise<ApiResponse<any>> => {
  return httpClient.get<any>(`/payments/callback/success?tranId=${tranId}&pId=${pId}`);
};

export const paymentService = {
  initPayment,
  verifyPayment,
};

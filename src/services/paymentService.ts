import { httpClient } from '@/lib/axios/httpClient';
import { ApiResponse } from '@/types/api.types';

export interface PaymentPayload {
  participationId: string;
  amount: number;
}

export interface PaymentIntentResponse {
  clientSecret: string;
}

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/payments`;

async function mapFetchResponse(res: Response) {
  const result = await res.json().catch(() => null);
  if (!res.ok) return { data: null, error: { message: result?.message || 'Request failed', status: res.status, raw: result } };
  return { data: result?.data ?? result, error: null };
}

// Client-side call
const createPaymentIntent = async (payload: PaymentPayload): Promise<ApiResponse<PaymentIntentResponse>> => {
  return httpClient.post<PaymentIntentResponse>('/payments/create-intent', payload);
};

// Server-side call (for Server Actions)
const serverCreatePaymentIntent = async (payload: PaymentPayload) => {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/create-intent`, {
      method: 'POST',
      headers: {
        Cookie: cookieStore.toString(),
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });
    return await mapFetchResponse(res);
  } catch (error) {
    return { data: null, error: { message: 'Failed to create payment intent', error } };
  }
};

export const paymentService = {
  server: {
    createPaymentIntent: serverCreatePaymentIntent,
  },
  createPaymentIntent,
};
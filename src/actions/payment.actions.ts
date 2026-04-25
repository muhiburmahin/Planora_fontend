"use server";
import { paymentService } from '@/services/paymentService';

export const createPaymentIntentAction = async (prevState: any, formData: FormData) => {
  const participationId = formData.get('participationId') as string;
  const amount = Number(formData.get('amount'));

  if (!participationId || Number.isNaN(amount)) {
    return { success: false, message: 'Participation ID and amount are required' };
  }

  
  const response = await paymentService.server.createPaymentIntent({ participationId, amount });

  if (response.error) {
    return { success: false, message: response.error.message };
  }

 
  return { success: true, message: 'Payment intent created successfully', data: response.data };
};
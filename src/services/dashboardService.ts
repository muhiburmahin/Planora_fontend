/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from '@/lib/axios/httpClient';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/dashboard`;

// Helper for mapping fetch responses
async function mapFetchResponse(res: Response) {
  const result = await res.json().catch(() => null);
  if (!res.ok) return { data: null, error: { message: result?.message || 'Request failed', status: res.status, raw: result } };
  return { data: result?.data ?? result, error: null };
}

export const dashboardService = {
  // Server-side methods for Next.js Server Components
  server: {
    getUserStats: async () => {
      try {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/user-stats`, {
          method: "GET",
          headers: {
            Cookie: cookieStore.toString(),
            Accept: "application/json",
          },
          cache: "no-store",
        });
        return await mapFetchResponse(res);
      } catch (error) {
        return { data: null, error: { message: 'Failed to fetch dashboard stats', error } };
      }
    },
  },

  // Client-side methods
  client: {
    getUserStats: async () => {
      return httpClient.get<any>('/dashboard/user-stats');
    },
  },
};

export default dashboardService;

"use server";

import { dashboardService } from "@/services/dashboardService";

export const getDashboardStatsAction = async () => {
  const result = await dashboardService.server.getUserStats();
  
  if (result.error) {
    return { success: false, message: result.error.message, data: null };
  }
  
  return { success: true, message: "Stats fetched successfully", data: result.data };
};

export interface Participation {
  id: string;
  userId: string;
  eventId: string;
  ticketNumber: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  user?: { name: string; email: string; image?: string };
  event?: { title: string; date: string; venue: string; registrationFee: number };
  payments?: any[];
}

export interface ParticipationFilters {
  searchTerm?: string;
  status?: string;
  eventId?: string;
  userId?: string;
}

export interface ParticipationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ParticipationResponse {
  meta: { page: number; limit: number; total: number };
  data: Participation[];
}

export interface JoinEventPayload { eventId: string; }
export interface UpdateStatusPayload { status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'; }

export interface Invitation {
  id: string;
  eventId: string;
  senderId: string;
  receiverId: string;
  message?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'BANNED';
  createdAt: string;
  updatedAt: string;
  sender?: {
    name: string;
    email: string;
    image?: string;
  };
  receiver?: {
    name: string;
    email: string;
    image?: string;
  };
  event?: {
    id: string;
    title: string;
    date: string;
    venue: string;
    status: string;
  };
}

export interface SendInvitationPayload {
  eventId: string;
  receiverId: string;
  message?: string;
}

export interface RespondInvitationPayload {
  status: 'APPROVED' | 'REJECTED';
}

export interface InvitationFilterRequest {
  searchTerm?: string;
  status?: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  eventId?: string;
}

export interface InvitationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface InvitationResponse {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage?: number;
  };
  data: Invitation[];
}
export interface Review {
  id: string;
  userId: string;
  eventId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    image?: string;
    email: string;
  };
  event?: {
    id: string;
    title: string;
    date: string;
    venue: string;
    organizer?: {
      name: string;
    };
  };
}

export interface CreateReviewPayload {
  eventId: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
}

export interface ReviewOptions {
  page?: number;
  limit?: number;
}

export interface ReviewResponse {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: Review[];
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
}

export interface ReviewFilterRequest {
  searchTerm?: string;
  rating?: string;
  userId?: string;
  eventId?: string;
}
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: 'ADMIN' | 'USER';
  status: 'ACTIVE' | 'BLOCKED' | 'DELETED' | 'PENDING';
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  // Profile interface-ta ke alada kore define korle use kora shohoj hoy
  profile?: {
    id?: string;
    bio?: string;
    contactNumber?: string;
    address?: string;
  };
}

export interface UpdateUserPayload {
  name?: string;
  image?: string;
  bio?: string;
  contactNumber?: string;
  address?: string;
}

export interface ChangeUserStatusPayload {
  status: 'ACTIVE' | 'BLOCKED' | 'DELETED' | 'PENDING';
}

export interface AdminDashboardStats {
  summary: {
    totalUsers: number;
    totalEvents: number;
    totalReviews: number;
    totalParticipations: number;
    totalRevenue: number;
    userGrowthRate: string;
  };
  categoryDistribution: { name: string; _count: { events: number } }[];
  monthlyTrend: { month: string; events: number; users: number }[];
  recentActivities: any[];
}

export interface UserDashboardStats {
  stats: {
    myOrganizedEvents: number;
    myJoinedEvents: number;
    totalReviewsGiven: number;
    pendingInvitations: number;
  };
  upcomingEvents: any[];
}

export interface Notification {
  id: string;
  userId: string;
  type: 'EVENT_INVITATION' | 'EVENT_STARTED' | 'EVENT_REMINDER' | 'REVIEW_REQUEST' | 'PAYMENT_SUCCESS' | 'PAYMENT_FAILED' | 'PARTICIPATION_APPROVED' | 'PARTICIPATION_REJECTED' | 'OTHER';
  title: string;
  message: string;
  data?: {
    eventId?: string;
    participationId?: string;
    paymentId?: string;
    [key: string]: any;
  };
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface UserOverviewStats {
  totalEventsOrganized: number;
  totalJoinedEvents: number;
  pendingInvitations: number;
  recentEvents: {
    id: string;
    title: string;
    date: string;
    time: string;
    venue: string;
    shortDescription?: string;
    category: {
      name: string;
    };
    status: string;
  }[];
}

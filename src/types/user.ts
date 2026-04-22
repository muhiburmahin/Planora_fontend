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
  profile?: {
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
  monthlyRevenue: { month: string; total: number }[];
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
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from './authStore';
import { AdminDashboardStats, ChangeUserStatusPayload, UpdateUserPayload, UserDashboardStats } from '@/types/user';
import { userService } from '@/services/userService';

interface UserState {
  profile: User | null;
  users: User[];
  dashboardStats: AdminDashboardStats | UserDashboardStats | null;
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  users: [],
  dashboardStats: null,
  notifications: [],
  loading: false,
  error: null,
};

export const getMyProfileAsync = createAsyncThunk(
  'user/getMyProfile',
  async () => {
    const response = await userService.getMyProfile();
    return response.data;
  }
);

export const updateMyProfileAsync = createAsyncThunk(
  'user/updateMyProfile',
  async (payload: UpdateUserPayload) => {
    const response = await userService.updateMyProfile(payload);
    return response.data;
  }
);

export const getDashboardStatsAsync = createAsyncThunk(
  'user/getDashboardStats',
  async () => {
    const response = await userService.getDashboardStats();
    return response.data;
  }
);

export const getAllUsersAsync = createAsyncThunk(
  'user/getAllUsers',
  async () => {
    const response = await userService.getAllUsers();
    return response.data;
  }
);

export const changeUserStatusAsync = createAsyncThunk(
  'user/changeUserStatus',
  async ({ id, payload }: { id: string; payload: ChangeUserStatusPayload }) => {
    const response = await userService.changeUserStatus(id, payload);
    return { id, data: response.data };
  }
);

export const getMyNotificationsAsync = createAsyncThunk(
  'user/getMyNotifications',
  async () => {
    const response = await userService.getMyNotifications();
    return response.data;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearProfile: (state) => {
      state.profile = null;
    },
    clearUsers: (state) => {
      state.users = [];
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    updateProfileLocally: (state, action: PayloadAction<Partial<User>>) => {
      if (state.profile) {
        Object.assign(state.profile, action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Get My Profile
      .addCase(getMyProfileAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyProfileAsync.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getMyProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch profile';
      })
      // Update My Profile
      .addCase(updateMyProfileAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMyProfileAsync.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateMyProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update profile';
      })
      // Get Dashboard Stats
      .addCase(getDashboardStatsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardStatsAsync.fulfilled, (state, action: PayloadAction<AdminDashboardStats | UserDashboardStats>) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(getDashboardStatsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch dashboard stats';
      })
      // Get All Users
      .addCase(getAllUsersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsersAsync.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      // Change User Status
      .addCase(changeUserStatusAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeUserStatusAsync.fulfilled, (state, action) => {
        state.loading = false;
        const { id, data } = action.payload;
        const index = state.users.findIndex(user => user.id === id);
        if (index !== -1) {
          state.users[index] = data;
        }
      })
      .addCase(changeUserStatusAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to change user status';
      })
      // Get My Notifications
      .addCase(getMyNotificationsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyNotificationsAsync.fulfilled, (state, action: PayloadAction<Notification[]>) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(getMyNotificationsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch notifications';
      });
  },
});

export const { clearError, clearProfile, clearUsers, clearNotifications, updateProfileLocally } = userSlice.actions;
export default userSlice.reducer;
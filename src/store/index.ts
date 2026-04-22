import { configureStore } from "@reduxjs/toolkit";
import userSlice from './userSlice';
import notificationSlice from './notificationSlice';
import participationSlice from './participationSlice';
import paymentSlice from './paymentSlice';
import reviewSlice from './reviewSlice';
import invitationSlice from './invitationSlice';
import categorySlice from './slices/categorySlice';

// Legacy user slice for backward compatibility
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type LegacyUserState = {
    id?: string | null;
    name?: string | null;
    email?: string | null;
    role?: string | null;
    isAuthenticated: boolean;
};

const initialLegacyUserState: LegacyUserState = {
    id: null,
    name: null,
    email: null,
    role: null,
    isAuthenticated: false,
};

const legacyUserSlice = createSlice({
    name: "legacyUser",
    initialState: initialLegacyUserState,
    reducers: {
        setUser(state, action: PayloadAction<Partial<LegacyUserState>>) {
            Object.assign(state, action.payload);
            state.isAuthenticated = !!action.payload?.id;
        },
        clearUser(state) {
            state.id = null;
            state.name = null;
            state.email = null;
            state.role = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setUser, clearUser } = legacyUserSlice.actions;

export const store = configureStore({
    reducer: {
        legacyUser: legacyUserSlice.reducer,
        user: userSlice,
        notifications: notificationSlice,
        participations: participationSlice,
        payments: paymentSlice,
        reviews: reviewSlice,
        invitations: invitationSlice,
        categories: categorySlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

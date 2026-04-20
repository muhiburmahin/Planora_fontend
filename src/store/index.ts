import { configureStore } from "@reduxjs/toolkit";

// Minimal placeholder store — expand with reducers as needed.
export const store = configureStore({
    reducer: {},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

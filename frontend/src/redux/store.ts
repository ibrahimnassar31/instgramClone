import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import postSlice from "./postSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
import { configureStore } from "@reduxjs/toolkit";

import themeReducer from "./slices/ThemeSlice";
import userReducer from "./slices/UserSlice";
import postReducer from "./slices/PostSlice";
import searchReducer from "./slices/SearchSlice";
import modalReducer from "./slices/ModalSlice";
import chatReducer from "./slices/ChatSlice";

export const store = configureStore({
  reducer: {
    themeReducer,
    userReducer,
    postReducer,
    searchReducer,
    modalReducer,
    chatReducer,
  },

  // // // This will solve err in modal code (Sending JSX in action and use that jsx as value of state)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

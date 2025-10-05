import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { UserState } from "../types/types";

const STORAGE_KEY = "user";

const baseState: UserState = {
  username: "",
  email: "",
  password: "",
  isRegistered: false,
};

const readStoredUser = (): Partial<UserState> | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const storedValue = window.localStorage.getItem(STORAGE_KEY);
  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(storedValue) as Partial<UserState>;
  } catch (error) {
    console.warn("Failed to parse stored user", error);
    return null;
  }
};

const persistUser = (state: UserState) => {
  if (typeof window === "undefined") {
    return;
  }

  const { username, email, password } = state;
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ username, email, password })
  );
};

const removeStoredUser = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
  window.sessionStorage.removeItem("token");
};

const storedUser = readStoredUser();

const initialState: UserState = storedUser
  ? {
      ...baseState,
      ...storedUser,
      isRegistered: Boolean(storedUser.username || storedUser.email),
    }
  : baseState;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    register: (
      state,
      action: PayloadAction<{ username: string; email: string; password?: string }>
    ) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.password = action.payload.password ?? "";
      state.isRegistered = true;
      persistUser(state);
    },
    logout: (state) => {
      state.username = "";
      state.email = "";
      state.password = "";
      state.isRegistered = false;
      removeStoredUser();
    },
  },
});

export const { register, logout } = userSlice.actions;
export default userSlice.reducer;

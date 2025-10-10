import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { UserState } from "../types/types";

const STORAGE_KEY = "user";

const baseState: UserState = {
  nombre: "",
  email: "",
  password: "",
  activo: false,
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

  const { nombre, email, activo } = state;
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ nombre, email, activo })
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
      activo: Boolean(storedUser.nombre || storedUser.email),
    }
  : baseState;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    register: (
      state,
      action: PayloadAction<{ nombre: string; email: string; password?: string, activo?: boolean}>
    ) => {
      state.nombre = action.payload.nombre;
      state.email = action.payload.email;
      state.password = action.payload.password ?? "";
      state.activo = action.payload.activo ?? true;
      persistUser(state);
    },
    logout: (state) => {
      state.nombre = "";
      state.email = "";
      state.password = "";
      state.activo = false;
      removeStoredUser();
    },
  },
});

export const { register, logout } = userSlice.actions;
export default userSlice.reducer;

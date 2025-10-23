import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { UserState } from "../types/types";

const STORAGE_KEY = "user";
const SESSION_KEY = "token";

const baseState: UserState = {
  nombre: "",
  email: "",
  password: "",
  rol: "",
  activo: false,
};

type StoredSessionResult =
  | { status: "valid"; token: string; expiresAt?: number }
  | { status: "expired" | "invalid" };

const clearPersistedSession = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
  window.sessionStorage.removeItem(SESSION_KEY);
};

const readStoredSession = (): StoredSessionResult | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    const candidate = JSON.parse(raw) as
      | { value?: string; expiresAt?: number }
      | string;

    if (typeof candidate === "string") {
      return { status: "valid", token: candidate };
    }

    if (typeof candidate?.value === "string") {
      if (
        typeof candidate.expiresAt === "number" &&
        candidate.expiresAt <= Date.now()
      ) {
        return { status: "expired" };
      }

      return {
        status: "valid",
        token: candidate.value,
        expiresAt: candidate.expiresAt,
      };
    }

    return { status: "invalid" };
  } catch (error) {
    if (raw.trim().length > 0) {
      return { status: "valid", token: raw };
    }
    return { status: "invalid" };
  }
};

const readStoredUserData = (): Partial<UserState> | null => {
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

  const { nombre, email, activo, rol } = state;
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ nombre, email, activo, rol })
  );
};

const resolveInitialState = (): UserState => {
  if (typeof window === "undefined") {
    return baseState;
  }

  const session = readStoredSession();
  if (!session) {
    window.localStorage.removeItem(STORAGE_KEY);
    return baseState;
  }

  if (session.status !== "valid") {
    clearPersistedSession();
    return baseState;
  }

  const storedUser = readStoredUserData();
  if (!storedUser) {
    return baseState;
  }

  return {
    ...baseState,
    ...storedUser,
    activo: Boolean(
      storedUser.activo ?? storedUser.nombre ?? storedUser.email
    ),
  };
};

const initialState: UserState = resolveInitialState();

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    register: (
      state,
      action: PayloadAction<{
        nombre: string;
        email: string;
        password?: string;
        activo?: boolean;
        rol?: string;
      }>
    ) => {
      state.nombre = action.payload.nombre;
      state.email = action.payload.email;
      state.password = action.payload.password ?? "";
      state.activo = action.payload.activo ?? true;
      state.rol = action.payload.rol ?? "user";
      persistUser(state);
    },
    logout: (state) => {
      state.nombre = "";
      state.email = "";
      state.password = "";
      state.activo = false;
      state.rol = "";
      clearPersistedSession();
    },
  },
});

export const { register, logout } = userSlice.actions;
export default userSlice.reducer;

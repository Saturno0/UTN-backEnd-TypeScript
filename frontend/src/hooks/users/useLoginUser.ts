import { useState } from "react";
import { buildApiUrl, API_CONFIG } from "../../config/api";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginSuccess {
  message: string;
  token: string;
  expiresAt: number;
  user?: LoginUserData;
}

interface LoginState {
  error: string | null;
  done: boolean;
  loading: boolean;
}

export interface LoginUserData {
  id?: string;
  nombre?: string;
  email?: string;
  rol?: string;
  activo?: boolean;
}

const parseErrorMessage = async (response: Response): Promise<string> => {
  try {
    const data = (await response.json()) as { message?: string };
    if (typeof data?.message === "string") {
      return data.message;
    }
  } catch (error) {
    // ignore JSON parse errors and fall back to status text
  }
  return response.statusText || "Request failed";
};

/**
 * Hook para autenticar al usuario.
 */

const SESSION_KEY = "token";
const SESSION_DURATION_MS = 60 * 60 * 1000; // 1h como en el backend

let expirationTimeoutId: number | undefined;

const scheduleTokenExpiration = (expiresAt: number) => {
  if (typeof window === "undefined") {
    return;
  }

  if (typeof expirationTimeoutId === "number") {
    window.clearTimeout(expirationTimeoutId);
  }

  const delay = Math.max(0, expiresAt - Date.now());
  expirationTimeoutId = window.setTimeout(() => {
    window.sessionStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new Event("user-session-expired"));
    expirationTimeoutId = undefined;
  }, delay);
};

const persistSessionToken = (token: string, expiresAt: number) => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ value: token, expiresAt })
  );
  scheduleTokenExpiration(expiresAt);
};


const useLoginUser = () => {
  const [state, setState] = useState<LoginState>({
    error: null,
    done: false,
    loading: false,
  });

  const loginUser = async (
    credentials: LoginCredentials
  ): Promise<LoginSuccess | undefined> => {
    setState({ error: null, done: false, loading: true });

    try {
      const response = await fetch(buildApiUrl(API_CONFIG.USERS.LOGIN), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const message = await parseErrorMessage(response);
        setState({ error: message, done: false, loading: false });
        return undefined;
      }

      const data = (await response.json()) as {
        message: string;
        token: string;
        user?: LoginUserData;
      };
      const expiresAt = Date.now() + SESSION_DURATION_MS;
      persistSessionToken(data.token, expiresAt);
      setState({ error: null, done: true, loading: false });
      return { ...data, expiresAt } as LoginSuccess;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unexpected error";
      setState({ error: message, done: false, loading: false });
      return undefined;
    }
  };

  return { loginUser, ...state };
};

export type { LoginCredentials, LoginSuccess };
export default useLoginUser;

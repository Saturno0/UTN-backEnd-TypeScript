import { useState } from "react";
import { buildApiUrl, API_CONFIG } from "../../config/api";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginSuccess {
  message: string;
  token: string;
}

interface LoginState {
  error: string | null;
  done: boolean;
  loading: boolean;
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

      const data = (await response.json()) as LoginSuccess;
      sessionStorage.setItem("token", data.token);
      setState({ error: null, done: true, loading: false });
      return data;
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

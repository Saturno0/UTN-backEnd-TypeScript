import { useState } from "react";
import { buildApiUrl, API_CONFIG } from "../../config/api";

interface UpdateUserPayload {
  nombre?: string;
  email?: string;
  password?: string;
}

interface UpdateUserResponse {
  message: string;
  product?: unknown;
}

interface MutationState {
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

const useUpdateUser = () => {
  const [state, setState] = useState<MutationState>({
    error: null,
    done: false,
    loading: false,
  });

  const updateUser = async (
    id: string,
    payload: UpdateUserPayload
  ): Promise<UpdateUserResponse | undefined> => {
    setState({ error: null, done: false, loading: true });

    try {
      const response = await fetch(
        `${buildApiUrl(API_CONFIG.USERS.UPDATE)}/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const message = await parseErrorMessage(response);
        setState({ error: message, done: false, loading: false });
        return undefined;
      }

      const data = (await response.json()) as UpdateUserResponse;
      setState({ error: null, done: true, loading: false });
      return data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unexpected error";
      setState({ error: message, done: false, loading: false });
      return undefined;
    }
  };

  return { updateUser, ...state };
};

export type { UpdateUserPayload, UpdateUserResponse };
export default useUpdateUser;

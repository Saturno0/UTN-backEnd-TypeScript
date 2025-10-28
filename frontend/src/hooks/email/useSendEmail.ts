import { useState } from "react";
import { buildApiUrl, API_CONFIG } from "../../config/api";
import type { FormData, CartItem } from "../../types/types";

interface SendEmailPayload extends FormData {
  items: CartItem[];
  total: number;
}

interface SendEmailResponse {
  success: boolean;
  message?: string;
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
  } catch (_error) {
    // ignore JSON parse errors and fall back to status text
  }
  return response.statusText || "Request failed";
};

const useSendEmail = () => {
  const [state, setState] = useState<MutationState>({
    error: null,
    done: false,
    loading: false,
  });

  const sendEmail = async (
    payload: SendEmailPayload
  ): Promise<SendEmailResponse | undefined> => {
    setState({ error: null, done: false, loading: true });

    try {
      const response = await fetch(buildApiUrl(API_CONFIG.EMAIL.SEND), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message = await parseErrorMessage(response);
        setState({ error: message, done: false, loading: false });
        return undefined;
      }

      const data = (await response.json()) as SendEmailResponse;
      setState({ error: null, done: true, loading: false });
      return data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unexpected error";
      setState({ error: message, done: false, loading: false });
      return undefined;
    }
  };

  return { sendEmail, ...state };
};

export type { SendEmailPayload, SendEmailResponse };
export default useSendEmail;


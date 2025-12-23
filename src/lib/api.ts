export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function request<T>(
  path: string,
  options: {
    method?: HttpMethod;
    body?: unknown;
    token?: string | null;
  } = {},
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const res = await fetch(url, {
    method: options.method ?? "POST",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const data = (await res.json()) as { message?: string; error?: string };
      message = data.message || data.error || message;
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(message);
  }

  return (await res.json()) as T;
}

export interface LoginResponse {
  token: string;
  userName?: string;
}

export async function loginApi(payload: {
  email: string;
  password: string;
}): Promise<LoginResponse> {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

// Facts from backend - dynamic structure
export type FactsResponse = Record<string, string[]>;

export async function getFactsApi(): Promise<FactsResponse> {
  return request<FactsResponse>("/expert-system/facts", {
    method: "GET",
  });
}

// Dropout risk request - dynamic based on facts
export interface DropoutRiskRequest {
  [key: string]: string | undefined;
}

export interface DropoutRiskResponse {
  willDropout: boolean;
  riskLevel: "Low" | "Medium" | "High";
  explanation: string;
  remedies: string[];
}

export async function evaluateDropoutRiskApi(
  payload: DropoutRiskRequest,
  token?: string | null,
): Promise<DropoutRiskResponse> {
  return request<DropoutRiskResponse>("/expert-system/dropout-risk", {
    method: "POST",
    body: payload,
    token: token ?? undefined,
  });
}

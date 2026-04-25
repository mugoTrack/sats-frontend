import { appConfig } from "@/lib/config";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginApiUser {
  id: string;
  name: string;
  email: string;
  status: string;
  is_system_admin: boolean;
  is_node: boolean;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: LoginApiUser;
}

export async function loginWithApi(payload: LoginRequest) {
  const response = await fetch(`${appConfig.apiBaseUrl}/users/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.status !== 200) {
    const message =
      response.status === 401
        ? "Invalid email or password"
        : `Login failed with status ${response.status}`;

    throw new Error(message);
  }

  const data = (await response.json()) as LoginResponse;
  console.log("Login response:", data);
  return data;
}

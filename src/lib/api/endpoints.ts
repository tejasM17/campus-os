import { apiCall } from "./client";
import type { Profile } from "./types";

export interface LoginResponse {
  access_token: string;
  expires_in: number;
  profile: Profile;
}

export function loginRequest(email_id: string, otp: string) {
  return apiCall<LoginResponse>("POST", "/api/v1/auth/login", {
    body: { email_id, otp },
  });
}

export function adminLoginRequest(email_id: string, otp: string) {
  return apiCall<LoginResponse>("POST", "/api/v1/auth/admin/login", {
    body: { email_id, otp },
  });
}

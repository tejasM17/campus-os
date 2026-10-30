import { apiCall } from "./client";
import type { Paged, Profile, FoundPost } from "./types";

export type FoundPostStatus = "active" | "archived";

export function listPostsRequest(
  status: FoundPostStatus,
  cursor?: string,
) {
  const params = new URLSearchParams();
  if (status === "archived") params.set("status", status);
  if (cursor) params.set("cursor", cursor);
  const query = params.toString();
  return apiCall<Paged<FoundPost>>("GET", `/api/v1/findit/posts${query ? `?${query}` : ""}`);
}

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

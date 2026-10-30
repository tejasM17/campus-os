import { apiCall } from "./client";
import type { Claim, Paged, Profile, FoundPost } from "./types";

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

export function getPostRequest(postId: string) {
  return apiCall<FoundPost>("GET", `/api/v1/findit/posts/${encodeURIComponent(postId)}`);
}

export function listClaimsRequest(postId: string) {
  return apiCall<Paged<Claim>>(
    "GET",
    `/api/v1/findit/posts/${encodeURIComponent(postId)}/claims`,
  );
}

export function createClaimRequest(postId: string, message: string) {
  return apiCall<Claim>(
    "POST",
    `/api/v1/findit/posts/${encodeURIComponent(postId)}/claims`,
    { body: { message } },
  );
}

export function withdrawClaimRequest(claimId: string) {
  return apiCall<void>("DELETE", `/api/v1/findit/claims/${encodeURIComponent(claimId)}`);
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

import { apiCall } from "./client";
import type { Claim, Paged, Profile, FoundPost, LostRequest } from "./types";

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

export function myClaimsRequest(cursor?: string) {
  const params = new URLSearchParams();
  if (cursor) params.set("cursor", cursor);
  const query = params.toString();
  return apiCall<Paged<Claim>>("GET", `/api/v1/findit/claims/me${query ? `?${query}` : ""}`);
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

export interface FoundPostInput {
  title: string;
  description: string;
  location_found: string;
  found_on: string;
  images?: File[];
  remove_images?: boolean;
}

function postFormData(input: Partial<FoundPostInput>) {
  const data = new FormData();
  if (input.title !== undefined) data.set("title", input.title);
  if (input.description !== undefined) data.set("description", input.description);
  if (input.location_found !== undefined) data.set("location_found", input.location_found);
  if (input.found_on !== undefined) data.set("found_on", input.found_on);
  input.images?.forEach((image) => data.append("images", image));
  if (input.remove_images) data.set("remove_images", "true");
  return data;
}

export function createPostRequest(input: FoundPostInput) {
  return apiCall<FoundPost>("POST", "/api/v1/findit/posts", { formData: postFormData(input) });
}

export function updatePostRequest(postId: string, input: Partial<FoundPostInput> & { status?: FoundPostStatus }) {
  const data = postFormData(input);
  if (input.status) data.set("status", input.status);
  return apiCall<FoundPost>("PATCH", `/api/v1/findit/posts/${encodeURIComponent(postId)}`, { formData: data });
}

export function deletePostRequest(postId: string) {
  return apiCall<void>("DELETE", `/api/v1/findit/posts/${encodeURIComponent(postId)}`);
}

export interface Resolution {
  claim_id: string;
  claimant_email: string;
  note?: string;
  resolved_by: string;
  resolved_at: string;
}

export function getResolutionRequest(postId: string) {
  return apiCall<Resolution>("GET", `/api/v1/findit/posts/${encodeURIComponent(postId)}/resolution`);
}

export function resolvePostRequest(postId: string, claim_id: string, note?: string) {
  return apiCall<Resolution>("POST", `/api/v1/findit/posts/${encodeURIComponent(postId)}/resolution`, {
    body: { claim_id, ...(note ? { note } : {}) },
  });
}

export function updateResolutionRequest(postId: string, claim_id: string, note?: string) {
  return apiCall<Resolution>("PATCH", `/api/v1/findit/posts/${encodeURIComponent(postId)}/resolution`, {
    body: { claim_id, ...(note ? { note } : {}) },
  });
}

export function undoResolutionRequest(postId: string) {
  return apiCall<void>("DELETE", `/api/v1/findit/posts/${encodeURIComponent(postId)}/resolution`);
}

export type LostRequestStatus = "active" | "archived";

export interface LostRequestFilters {
  status: LostRequestStatus;
  mine?: boolean;
}

export interface LostRequestInput {
  title: string;
  description?: string;
  location_lost?: string;
  lost_on?: string;
}

export function listLostRequestsRequest(
  filters: LostRequestFilters,
  cursor?: string,
) {
  const params = new URLSearchParams({ status: filters.status });
  if (filters.mine) params.set("mine", "true");
  if (cursor) params.set("cursor", cursor);
  return apiCall<Paged<LostRequest>>(
    "GET",
    `/api/v1/findit/lost-requests?${params.toString()}`,
  );
}

export function createLostRequestRequest(input: LostRequestInput) {
  return apiCall<LostRequest>("POST", "/api/v1/findit/lost-requests", {
    body: input,
  });
}

export function updateLostRequestRequest(
  requestId: string,
  input: Partial<LostRequestInput> & { status?: LostRequestStatus },
) {
  return apiCall<LostRequest>(
    "PATCH",
    `/api/v1/findit/lost-requests/${encodeURIComponent(requestId)}`,
    { body: input },
  );
}

export function deleteLostRequestRequest(requestId: string) {
  return apiCall<void>(
    "DELETE",
    `/api/v1/findit/lost-requests/${encodeURIComponent(requestId)}`,
  );
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

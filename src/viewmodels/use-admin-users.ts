"use client";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminMeRequest,
  createAdminUserRequest,
  deleteAdminUserRequest,
  getAdminUserRequest,
  listAdminUsersRequest,
  regenerateAdminUserOtpRequest,
  updateAdminUserRequest,
  type AdminUserUpdate,
  type CreateAdminUserInput,
} from "@/src/lib/api/endpoints";
import type { ManagedRole } from "@/src/lib/api/types";

export function useAdminMe(enabled = true) {
  return useQuery({
    queryKey: ["admin", "me"],
    queryFn: adminMeRequest,
    enabled,
    retry: false,
  });
}

export function useAdminUsers(role?: ManagedRole, enabled = true) {
  return useInfiniteQuery({
    queryKey: ["admin", "users", role ?? "all"],
    queryFn: ({ pageParam }) => listAdminUsersRequest({ role, cursor: pageParam ?? undefined }),
    initialPageParam: null as string | null,
    getNextPageParam: (page) => page.next_cursor ?? undefined,
    enabled,
  });
}

export function useAdminUser(emailId: string | null, enabled = true) {
  return useQuery({
    queryKey: ["admin", "user", emailId],
    queryFn: async () => {
      const user = await getAdminUserRequest(emailId ?? "");
      const { otp, ...profile } = user;
      void otp;
      return profile;
    },
    enabled: Boolean(emailId) && enabled,
    retry: false,
  });
}

export function useCreateAdminUser() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAdminUserInput) => createAdminUserRequest(input),
    gcTime: 0,
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useUpdateAdminUser(emailId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (input: AdminUserUpdate) => {
      await updateAdminUserRequest(emailId, input);
    },
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: ["admin", "user", emailId] }),
        client.invalidateQueries({ queryKey: ["admin", "users"] }),
      ]);
    },
  });
}

export function useDeleteAdminUser() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (emailId: string) => deleteAdminUserRequest(emailId),
    onSuccess: async (_result, emailId) => {
      client.removeQueries({ queryKey: ["admin", "user", emailId] });
      await client.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useRegenerateAdminUserOtp() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (emailId: string) => regenerateAdminUserOtpRequest(emailId),
    gcTime: 0,
    onSuccess: async (_result, emailId) => {
      await Promise.all([
        client.invalidateQueries({ queryKey: ["admin", "users"] }),
        client.invalidateQueries({ queryKey: ["admin", "user", emailId] }),
      ]);
    },
  });
}

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPostRequest,
  deletePostRequest,
  getResolutionRequest,
  resolvePostRequest,
  undoResolutionRequest,
  updatePostRequest,
  updateResolutionRequest,
  type FoundPostInput,
} from "@/src/lib/api/endpoints";

export function useCreatePost() {
  const client = useQueryClient();
  return useMutation({ mutationFn: (input: FoundPostInput) => createPostRequest(input), onSuccess: async () => {
    await client.invalidateQueries({ queryKey: ["posts"] });
  } });
}

export function useUpdatePost(postId: string) {
  const client = useQueryClient();
  return useMutation({ mutationFn: (input: Partial<FoundPostInput> & { status?: "active" | "archived" }) => updatePostRequest(postId, input), onSuccess: async () => {
    await Promise.all([client.invalidateQueries({ queryKey: ["post", postId] }), client.invalidateQueries({ queryKey: ["posts"] })]);
  } });
}

export function useDeletePost(postId: string) {
  const client = useQueryClient();
  return useMutation({ mutationFn: () => deletePostRequest(postId), onSuccess: async () => {
    await Promise.all([client.invalidateQueries({ queryKey: ["posts"] }), client.removeQueries({ queryKey: ["post", postId] })]);
  } });
}

export function useResolution(postId: string, enabled: boolean) {
  return useQuery({ queryKey: ["resolution", postId], queryFn: () => getResolutionRequest(postId), enabled: Boolean(postId) && enabled, retry: false });
}

function useResolutionMutation(postId: string, mutationFn: (claimId: string, note?: string) => Promise<unknown>) {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ claimId, note }: { claimId: string; note?: string }) => mutationFn(claimId, note), onSuccess: async () => {
    await Promise.all([client.invalidateQueries({ queryKey: ["post", postId] }), client.invalidateQueries({ queryKey: ["claims", postId] }), client.invalidateQueries({ queryKey: ["posts"] }), client.invalidateQueries({ queryKey: ["resolution", postId] })]);
  } });
}

export function useResolvePost(postId: string) {
  return useResolutionMutation(postId, (claimId, note) => resolvePostRequest(postId, claimId, note));
}

export function useUpdateResolution(postId: string) {
  return useResolutionMutation(postId, (claimId, note) => updateResolutionRequest(postId, claimId, note));
}

export function useUndoResolution(postId: string) {
  const client = useQueryClient();
  return useMutation({ mutationFn: () => undoResolutionRequest(postId), onSuccess: async () => {
    await Promise.all([client.invalidateQueries({ queryKey: ["post", postId] }), client.invalidateQueries({ queryKey: ["claims", postId] }), client.invalidateQueries({ queryKey: ["posts"] }), client.invalidateQueries({ queryKey: ["resolution", postId] })]);
  } });
}

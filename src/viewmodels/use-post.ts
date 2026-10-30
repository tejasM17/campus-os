"use client";

import { useQuery } from "@tanstack/react-query";
import { getPostRequest } from "@/src/lib/api/endpoints";

export function usePost(postId: string, enabled = true) {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPostRequest(postId),
    enabled: Boolean(postId) && enabled,
  });
}

"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { listPostsRequest, type FoundPostStatus } from "@/src/lib/api/endpoints";

export function useFoundPosts(status: FoundPostStatus, enabled = true) {
  return useInfiniteQuery({
    queryKey: ["posts", status, null],
    queryFn: ({ pageParam }) => listPostsRequest(status, pageParam ?? undefined),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
    enabled,
  });
}

"use client";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createLostRequestRequest,
  deleteLostRequestRequest,
  listLostRequestsRequest,
  updateLostRequestRequest,
  type LostRequestFilters,
  type LostRequestInput,
  type LostRequestStatus,
} from "@/src/lib/api/endpoints";

export function useLostRequests(filters: LostRequestFilters, enabled = true) {
  return useInfiniteQuery({
    queryKey: ["lost", filters],
    queryFn: ({ pageParam }) => listLostRequestsRequest(filters, pageParam ?? undefined),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
    enabled,
  });
}

function useInvalidateLostRequests() {
  const client = useQueryClient();
  return () => client.invalidateQueries({ queryKey: ["lost"] });
}

export function useCreateLostRequest() {
  const invalidate = useInvalidateLostRequests();
  return useMutation({
    mutationFn: (input: LostRequestInput) => createLostRequestRequest(input),
    onSuccess: invalidate,
  });
}

export function useUpdateLostRequest(requestId: string) {
  const invalidate = useInvalidateLostRequests();
  return useMutation({
    mutationFn: (input: Partial<LostRequestInput> & { status?: LostRequestStatus }) =>
      updateLostRequestRequest(requestId, input),
    onSuccess: invalidate,
  });
}

export function useDeleteLostRequest(requestId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: () => deleteLostRequestRequest(requestId),
    onSuccess: () => client.invalidateQueries({ queryKey: ["lost"] }),
  });
}

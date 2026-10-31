"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { meRequest } from "@/src/lib/api/endpoints";
import { hasValidSession, useSessionStore } from "@/src/store/session";

export function useProfileRefresh() {
  const token = useSessionStore((state) => state.token);
  const expiresAt = useSessionStore((state) => state.expiresAt);
  const setProfile = useSessionStore((state) => state.setProfile);
  const query = useQuery({
    queryKey: ["profile", token],
    queryFn: meRequest,
    enabled: hasValidSession({ token, expiresAt }),
    retry: false,
  });

  useEffect(() => {
    if (query.data) setProfile(query.data);
  }, [query.data, setProfile]);

  return query;
}

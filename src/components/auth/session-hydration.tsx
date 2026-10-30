"use client";

import { useEffect } from "react";
import { useSessionStore } from "@/src/store/session";

export function SessionHydration() {
  const setHydrated = useSessionStore((state) => state.setHydrated);
  useEffect(() => {
    async function hydrateSession() {
      await useSessionStore.persist.rehydrate();
      setHydrated();
    }
    void hydrateSession();
  }, [setHydrated]);
  return null;
}

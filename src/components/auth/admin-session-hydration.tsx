"use client";

import { useEffect } from "react";
import { useAdminSessionStore } from "@/src/store/admin-session";

export function AdminSessionHydration() {
  const setHydrated = useAdminSessionStore((state) => state.setHydrated);
  useEffect(() => {
    async function hydrateAdminSession() {
      await useAdminSessionStore.persist.rehydrate();
      setHydrated();
    }
    void hydrateAdminSession();
  }, [setHydrated]);
  return null;
}

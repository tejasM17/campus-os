"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { hasValidSession, useSessionStore } from "@/src/store/session";

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useSessionStore((state) => state.token);
  const expiresAt = useSessionStore((state) => state.expiresAt);
  const hydrated = useSessionStore((state) => state.hydrated);
  const valid = hasValidSession({ token, expiresAt });

  useEffect(() => {
    if (hydrated && !valid) router.replace("/login");
  }, [hydrated, router, valid]);

  if (!hydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-5">
        <p role="status" className="text-sm text-muted-foreground">
          Restoring your session...
        </p>
      </main>
    );
  }

  if (!valid) return null;
  return children;
}

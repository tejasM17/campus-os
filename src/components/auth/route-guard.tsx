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

  const blocked = !hydrated || !valid;

  return (
    <>
      <div hidden={blocked} aria-hidden={blocked} inert={blocked}>
        {children}
      </div>
      {blocked && (
        <main className="flex min-h-screen items-center justify-center bg-background px-5">
          <p role="status" className="text-sm text-muted-foreground">
            {hydrated ? "Redirecting to sign in…" : "Restoring your session…"}
          </p>
        </main>
      )}
    </>
  );
}

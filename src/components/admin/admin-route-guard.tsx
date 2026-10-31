"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { hasValidAdminSession, useAdminSessionStore } from "@/src/store/admin-session";

export function AdminRouteGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const token = useAdminSessionStore((state) => state.token);
  const profile = useAdminSessionStore((state) => state.profile);
  const expiresAt = useAdminSessionStore((state) => state.expiresAt);
  const hydrated = useAdminSessionStore((state) => state.hydrated);
  const valid = hasValidAdminSession({ token, profile, expiresAt });

  useEffect(() => {
    if (hydrated && !valid) router.replace("/admin-login");
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
            {hydrated ? "Redirecting to admin sign in…" : "Restoring your admin session…"}
          </p>
        </main>
      )}
    </>
  );
}

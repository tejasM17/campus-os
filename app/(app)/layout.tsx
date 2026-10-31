import type { ReactNode } from "react";
import { RouteGuard } from "@/src/components/auth/route-guard";
import { AppShell } from "@/src/components/app-shell";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <RouteGuard><AppShell>{children}</AppShell></RouteGuard>
  );
}

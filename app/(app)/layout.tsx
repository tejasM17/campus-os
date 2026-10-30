import type { ReactNode } from "react";
import { RouteGuard } from "@/src/components/auth/route-guard";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <RouteGuard>
      {children}
    </RouteGuard>
  );
}

import type { ReactNode } from "react";
import { AdminRouteGuard } from "@/src/components/admin/admin-route-guard";
import { AdminShell } from "@/src/features/admin/admin-shell";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminRouteGuard><AdminShell>{children}</AdminShell></AdminRouteGuard>;
}

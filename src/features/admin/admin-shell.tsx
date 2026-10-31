"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminSessionStore } from "@/src/store/admin-session";
import { useAdminMe } from "@/src/viewmodels/use-admin-users";
import type { ReactNode } from "react";

export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAdminSessionStore((state) => state.token);
  const logout = useAdminSessionStore((state) => state.logout);
  const queryClient = useQueryClient();
  const me = useAdminMe(Boolean(token));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
          <Link href="/admin" className="font-semibold tracking-tight">CampusOS <span className="text-primary">/ Admin</span></Link>
          <nav aria-label="Administration" className="flex items-center gap-2 sm:gap-4">
            <Link href="/admin/users" aria-current={pathname.startsWith("/admin/users") ? "page" : undefined} className={`rounded-md px-3 py-2 text-sm font-medium ${pathname.startsWith("/admin/users") ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}>Users</Link>
            <span className="hidden max-w-48 truncate text-sm text-muted-foreground sm:inline" title={me.data?.email_id}>
              {me.isPending ? <Skeleton className="h-4 w-24" /> : me.data?.name ?? "Administrator"}
            </span>
            <Button type="button" variant="ghost" className="min-h-11" onClick={() => { queryClient.removeQueries({ queryKey: ["admin"] }); logout(); router.replace("/admin-login"); }}>Sign out</Button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8 sm:pt-10 lg:px-12">
        {me.isError && <Alert variant="destructive" className="mb-6" role="alert"><AlertTitle>Admin profile could not be refreshed</AlertTitle><AlertDescription>{me.error instanceof Error ? me.error.message : "The request could not be completed."}</AlertDescription></Alert>}
        {children}
      </main>
    </div>
  );
}

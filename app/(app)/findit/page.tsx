"use client";

import { useRouter } from "next/navigation";
import { useSessionStore } from "@/src/store/session";

export default function FindItFoundationPage() {
  const router = useRouter();
  const profile = useSessionStore((state) => state.profile);
  const logout = useSessionStore((state) => state.logout);

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <p className="font-semibold tracking-tight">CampusOS <span className="text-primary">/ FindIt</span></p>
          <button
            type="button"
            onClick={() => {
              logout();
              router.replace("/login");
            }}
            className="min-h-10 rounded-lg px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            Sign out
          </button>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <p className="text-sm font-semibold text-primary">FindIt · Lost &amp; Found</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">You’re signed in</h1>
        <p className="mt-3 text-muted-foreground">
          {profile?.name} <span aria-hidden="true">·</span> {profile?.role.replaceAll("_", " ")}
        </p>
      </section>
    </main>
  );
}

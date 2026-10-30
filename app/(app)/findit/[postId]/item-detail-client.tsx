"use client";

import Link from "next/link";
import { use, useEffect } from "react";
import { ArrowLeft, CalendarDays, MapPin, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { ClaimForm } from "@/src/components/findit/claim-form";
import { ClaimsList } from "@/src/components/findit/claims-list";
import { ItemImageGallery } from "@/src/components/findit/item-image-gallery";
import { StatusBadge } from "@/src/components/findit/status-badge";
import { ApiError } from "@/src/lib/api/errors";
import { hasValidSession, useSessionStore } from "@/src/store/session";
import { useClaims, useCreateClaim, useWithdrawClaim } from "@/src/viewmodels/use-claims";
import { usePost } from "@/src/viewmodels/use-post";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" }).format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date(value));
}

export default function ItemDetailPage({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = use(params);
  const token = useSessionStore((state) => state.token);
  const expiresAt = useSessionStore((state) => state.expiresAt);
  const profile = useSessionStore((state) => state.profile);
  const enabled = hasValidSession({ token, expiresAt });
  const postQuery = usePost(postId, enabled);
  const claimsQuery = useClaims(postId, enabled);
  const createClaim = useCreateClaim(postId);
  const withdrawClaim = useWithdrawClaim(postId);
  const post = postQuery.data;
  const claims = claimsQuery.data?.items ?? [];
  const hasClaim = Boolean(profile && claims.some((claim) => claim.claimant_email.toLowerCase() === profile.email_id.toLowerCase()));

  useEffect(() => {
    if (!createClaim.error) return;
    const duplicate = createClaim.error instanceof ApiError && createClaim.error.code === "ALREADY_EXISTS";
    toast.add({ title: duplicate ? "Claim already submitted" : "Couldn’t submit claim", description: createClaim.error.message, priority: "high" });
  }, [createClaim.error]);

  useEffect(() => {
    if (!withdrawClaim.error) return;
    toast.add({ title: "Couldn’t withdraw claim", description: withdrawClaim.error.message, priority: "high" });
  }, [withdrawClaim.error]);

  if (postQuery.isPending) {
    return <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-12" aria-label="Loading item details">
      <Skeleton className="h-6 w-32" />
      <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]">
        <Skeleton className="aspect-[4/3] rounded-2xl" />
        <div className="space-y-4"><Skeleton className="h-10 w-3/4" /><Skeleton className="h-5 w-1/2" /><Skeleton className="h-32 w-full" /></div>
      </div>
    </main>;
  }

  if (postQuery.isError || !post) {
    return <main className="mx-auto w-full max-w-3xl px-5 py-16 text-center sm:px-8">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground"><PackageSearch aria-hidden="true" className="size-7" /></div>
      <h1 className="mt-5 text-2xl font-semibold">Item details couldn’t be loaded</h1>
      <p className="mt-2 text-muted-foreground">{postQuery.error instanceof Error ? postQuery.error.message : "Please try again."}</p>
      <div className="mt-6 flex justify-center gap-3"><Button type="button" variant="outline" onClick={() => void postQuery.refetch()}>Try again</Button><Button nativeButton={false} render={<Link href="/findit" />} variant="ghost">Back to found items</Button></div>
    </main>;
  }

  const isClosed = post.resolved || post.status === "archived";
  const banner = post.resolved ? "Item returned to owner" : post.status === "archived" ? "This post is archived" : null;

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-7 sm:px-8 sm:pt-9 lg:px-12">
        <Link href="/findit" className="inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
          <ArrowLeft aria-hidden="true" className="size-4" /> Back to found items
        </Link>

        {banner && <div className={`mt-5 rounded-xl border px-4 py-3 text-sm font-medium ${post.resolved ? "border-sky-300 bg-sky-50 text-sky-950 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-100" : "border-border bg-muted text-foreground"}`} role="status">{banner}</div>}

        <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)] lg:gap-12">
          <ItemImageGallery images={post.images} title={post.title} />

          <div>
            <div className="flex flex-wrap items-center gap-3"><StatusBadge post={post} /><span className="text-xs text-muted-foreground">Post {post.post_id}</span></div>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">{post.title}</h1>
            <p className="mt-5 whitespace-pre-wrap text-base leading-7 text-muted-foreground">{post.description}</p>

            <dl className="mt-6 grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2">
              <div className="flex items-start gap-3"><MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" /><div><dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Found at</dt><dd className="mt-1 text-sm font-medium">{post.location_found}</dd></div></div>
              <div className="flex items-start gap-3"><CalendarDays aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" /><div><dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Found on</dt><dd className="mt-1 text-sm font-medium"><time dateTime={post.found_on}>{post.found_on}</time></dd></div></div>
            </dl>

            <div className="mt-5 space-y-2 text-sm text-muted-foreground">
              <p>Posted by <span className="font-medium text-foreground">{post.created_by}</span></p>
              <p>Posted <time dateTime={post.created_at}>{formatDateTime(post.created_at)}</time></p>
              <p>Last updated <time dateTime={post.updated_at}>{formatDateTime(post.updated_at)}</time></p>
            </div>

            {post.resolution && (
              <section className="mt-5 rounded-xl border border-sky-300 bg-sky-50 p-4 text-sm text-sky-950 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-100" aria-label="Resolution details">
                <h2 className="font-semibold">Resolution details</h2>
                <dl className="mt-3 space-y-2"><div><dt className="inline font-medium">Approved claim: </dt><dd className="inline">{post.resolution.claim_id}</dd></div><div><dt className="inline font-medium">Claimant: </dt><dd className="inline">{post.resolution.claimant_email}</dd></div>{post.resolution.note && <div><dt className="inline font-medium">Note: </dt><dd className="inline">{post.resolution.note}</dd></div>}<div><dt className="inline font-medium">Resolved by: </dt><dd className="inline">{post.resolution.resolved_by}</dd></div><div><dt className="inline font-medium">Resolved on: </dt><dd className="inline"><time dateTime={post.resolution.resolved_at}>{formatDateTime(post.resolution.resolved_at)}</time></dd></div></dl>
              </section>
            )}

            {!isClosed && <div className="mt-7 rounded-2xl border border-border bg-card p-5 sm:p-6"><h2 className="text-lg font-semibold">Recognise this item?</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">Share a detail that only the owner would know. Staff will review your claim.</p><div className="mt-5"><ClaimForm submitting={createClaim.isPending} submitted={hasClaim || createClaim.isSuccess} onSubmit={async (message) => { await createClaim.mutateAsync(message); }} /></div></div>}
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.72fr)]">
          <ClaimsList claims={claims} profile={profile} withdrawingClaimId={withdrawClaim.isPending ? withdrawClaim.variables ?? null : null} onWithdraw={(claimId) => withdrawClaim.mutateAsync(claimId)} />
          <aside className="h-fit rounded-2xl border border-border bg-muted/50 p-5 sm:p-6">
            <h2 className="font-semibold">Item details</h2>
            <dl className="mt-4 space-y-3 text-sm"><div className="flex justify-between gap-4"><dt className="text-muted-foreground">Item ID</dt><dd className="text-right font-medium">{post.post_id}</dd></div><div className="flex justify-between gap-4"><dt className="text-muted-foreground">Photos</dt><dd className="text-right font-medium">{post.images.length}</dd></div><div className="flex justify-between gap-4"><dt className="text-muted-foreground">Status</dt><dd className="text-right font-medium capitalize">{post.resolved ? "resolved" : post.status}</dd></div><div className="flex justify-between gap-4"><dt className="text-muted-foreground">Created</dt><dd className="text-right font-medium"><time dateTime={post.created_at}>{formatDate(post.created_at)}</time></dd></div><div className="flex justify-between gap-4"><dt className="text-muted-foreground">Updated</dt><dd className="text-right font-medium"><time dateTime={post.updated_at}>{formatDate(post.updated_at)}</time></dd></div></dl>
          </aside>
        </div>
        {claimsQuery.isError && <p className="mt-5 text-sm text-destructive" role="alert">Claims couldn’t be loaded: {claimsQuery.error.message}</p>}
      </section>
    </main>
  );
}

"use client";

import { useState } from "react";
import { Phone, UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ClaimStatusBadge } from "@/src/components/findit/claim-status-badge";
import { ApiError } from "@/src/lib/api/errors";
import type { Claim, Profile } from "@/src/lib/api/types";

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0] ?? "").join("").toUpperCase() || "?";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date(value));
}

export function ClaimsList({ claims, profile, withdrawingClaimId, onWithdraw }: {
  claims: Claim[];
  profile: Profile | null;
  withdrawingClaimId: string | null;
  onWithdraw: (claimId: string) => Promise<void>;
}) {
  const [lockedClaims, setLockedClaims] = useState<string[]>([]);
  const isStaff = profile?.role === "office_staff";

  return (
    <section aria-labelledby="claims-heading" className="rounded-2xl border border-border bg-card p-5 sm:p-7">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-primary">Community claims</p>
          <h2 id="claims-heading" className="mt-1 text-xl font-semibold tracking-tight">Claims</h2>
        </div>
        <span className="text-sm text-muted-foreground">{claims.length} {claims.length === 1 ? "claim" : "claims"}</span>
      </div>
      {claims.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-border bg-muted/40 px-4 py-8 text-center text-sm text-muted-foreground">No claims yet.</p>
      ) : (
        <ul className="mt-5 space-y-4">
          {claims.map((claim) => {
            const locked = lockedClaims.includes(claim.claim_id);
            const canWithdraw = !isStaff && claim.decision === "pending" && claim.status === "active" && !locked;
            return (
              <li key={claim.claim_id} className="rounded-xl border border-border p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <Avatar aria-hidden="true" className="size-10"><AvatarFallback>{initials(claim.claimant_name)}</AvatarFallback></Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="font-semibold">{claim.claimant_name}</h3>
                        <p className="text-sm capitalize text-muted-foreground">{claim.claimant_role.replaceAll("_", " ")}</p>
                      </div>
                      <ClaimStatusBadge decision={claim.decision} />
                    </div>
                    {isStaff && (
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5"><UserRound aria-hidden="true" className="size-3.5" />{claim.claimant_email}</span>
                        {claim.claimant_phone_number && <a className="inline-flex min-h-8 items-center gap-1.5 underline-offset-4 hover:underline" href={`tel:${claim.claimant_phone_number}`}><Phone aria-hidden="true" className="size-3.5" />{claim.claimant_phone_number}</a>}
                      </div>
                    )}
                  </div>
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-foreground">{claim.message}</p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
                  <span>Submitted <time dateTime={claim.created_at}>{formatDate(claim.created_at)}</time></span>
                  <span className="capitalize">{claim.status}</span>
                </div>
                {canWithdraw && (
                  <Button type="button" variant="outline" className="mt-4 min-h-11" disabled={withdrawingClaimId === claim.claim_id} onClick={() => void onWithdraw(claim.claim_id).catch((error: unknown) => {
                    if (error instanceof ApiError && error.code === "CLAIM_LOCKED") {
                      setLockedClaims((current) => current.includes(claim.claim_id) ? current : [...current, claim.claim_id]);
                    }
                  })}>
                    {withdrawingClaimId === claim.claim_id ? "Withdrawing…" : "Withdraw"}
                  </Button>
                )}
                {locked && <p className="mt-4 text-sm text-muted-foreground" role="status">This claim can no longer be withdrawn because staff have started reviewing it.</p>}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

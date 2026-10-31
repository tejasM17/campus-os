"use client";

import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const claimSchema = z.object({ message: z.string().min(10, "Add at least 10 characters.").max(1000, "Keep your message under 1,000 characters.") });

export function ClaimForm({ submitting, onSubmit, submitted }: {
  submitting: boolean;
  submitted: boolean;
  onSubmit: (message: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (submitted) {
    return <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm font-medium text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100" role="status">Claim submitted</div>;
  }

  if (!open) {
    return <Button type="button" className="min-h-12 w-full sm:w-auto" onClick={() => setOpen(true)}>This is mine</Button>;
  }

  const validateAndSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = claimSchema.safeParse({ message });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Enter a valid claim message.");
      return;
    }
    setError(null);
    try {
      await onSubmit(result.data.message);
    } catch {
      // The page-level mutation handler presents the API message in a toast.
    }
  };

  return (
    <form onSubmit={validateAndSubmit} className="space-y-3" noValidate>
      <label htmlFor="claim-message" className="block text-sm font-medium">Tell us how you can identify this item</label>
      <Textarea
        id="claim-message"
        value={message}
        maxLength={1000}
        onChange={(event) => { setMessage(event.target.value); if (error) setError(null); }}
        placeholder="Share a detail that helps staff confirm it belongs to you."
        aria-invalid={Boolean(error)}
        aria-describedby="claim-message-hint claim-message-count claim-message-error"
        className="min-h-32 resize-y"
        disabled={submitting}
      />
      <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
        <span id="claim-message-hint">10–1,000 characters</span>
        <span id="claim-message-count" aria-live="polite">{message.length} / 1,000</span>
      </div>
      {error && <p id="claim-message-error" className="text-sm font-medium text-destructive" role="alert">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" className="min-h-11" disabled={submitting}>{submitting ? "Submitting…" : "Submit claim"}</Button>
        <Button type="button" variant="outline" className="min-h-11" disabled={submitting} onClick={() => { setOpen(false); setError(null); }}>Cancel</Button>
      </div>
    </form>
  );
}

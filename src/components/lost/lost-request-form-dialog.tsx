"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { LostRequest } from "@/src/lib/api/types";
import type { LostRequestInput } from "@/src/lib/api/endpoints";

function localDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function LostRequestFormDialog({ open, onOpenChange, request, submitting, onSubmit }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request?: LostRequest;
  submitting: boolean;
  onSubmit: (input: LostRequestInput) => Promise<void>;
}) {
  const [title, setTitle] = useState(request?.title ?? "");
  const [description, setDescription] = useState(request?.description ?? "");
  const [location, setLocation] = useState(request?.location_lost ?? "");
  const [lostOn, setLostOn] = useState(request?.lost_on ?? "");
  const [error, setError] = useState<string | null>(null);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (title.trim().length < 3 || title.trim().length > 100) {
      setError("Title must be 3–100 characters."); return;
    }
    if (lostOn && lostOn > localDate()) { setError("Choose a date that is not in the future."); return; }
    if (request && !title.trim() && !description.trim() && !location.trim() && !lostOn) {
      setError("Update at least one field."); return;
    }
    setError(null);
    try {
      await onSubmit(request ? {
        title: title.trim(),
        description: description.trim(),
        location_lost: location.trim(),
        lost_on: lostOn,
      } : {
        title: title.trim(),
        ...(description.trim() ? { description: description.trim() } : {}),
        ...(location.trim() ? { location_lost: location.trim() } : {}),
        ...(lostOn ? { lost_on: lostOn } : {}),
      });
      onOpenChange(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The report could not be saved.");
    }
  }

  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-h-[90dvh] max-w-xl overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{request ? "Edit lost item report" : "Report a lost item"}</DialogTitle>
        <DialogDescription>Add details that could help someone recognise what you lost.</DialogDescription>
      </DialogHeader>
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="lost-title" className="mb-1.5 block font-medium">Title <span aria-hidden="true">*</span></label>
          <Input id="lost-title" value={title} minLength={3} maxLength={100} required aria-invalid={Boolean(error && (title.trim().length < 3 || title.trim().length > 100))} onChange={(event) => setTitle(event.target.value)} />
          <p className="mt-1 text-xs text-muted-foreground">3–100 characters</p>
        </div>
        <div>
          <label htmlFor="lost-description" className="mb-1.5 block font-medium">Description</label>
          <Textarea id="lost-description" value={description} onChange={(event) => setDescription(event.target.value)} className="min-h-24" />
        </div>
        <div>
          <label htmlFor="lost-location" className="mb-1.5 block font-medium">Where did you lose it?</label>
          <Input id="lost-location" value={location} onChange={(event) => setLocation(event.target.value)} />
        </div>
        <div>
          <label htmlFor="lost-date" className="mb-1.5 block font-medium">Date lost</label>
          <Input id="lost-date" type="date" value={lostOn} onChange={(event) => setLostOn(event.target.value)} />
        </div>
        {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
        <DialogFooter>
          <Button type="button" variant="outline" className="min-h-11" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" className="min-h-11" disabled={submitting}>{submitting ? "Saving…" : request ? "Save changes" : "Submit report"}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>;
}

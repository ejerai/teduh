"use client";

import { useState, useTransition } from "react";
import { AlertCircle, Trash2 } from "lucide-react";
import { deleteResidentAction } from "@/app/actions/residents";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const MAX_REASON = 500;

export function DeleteResidentDialog({ id, name }: { id: string; name: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleOpenChange(next: boolean) {
    if (pending) return;
    setOpen(next);
    if (!next) {
      setReason("");
      setError(null);
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      // Jika berhasil, aksi langsung memindahkan ke daftar penghuni.
      const result = await deleteResidentAction(id, reason);
      if (result && !result.ok) setError(result.message);
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" variant="destructive" className="h-10 rounded-xl px-4">
          <Trash2 className="size-4" />
          Hapus
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-3xl sm:max-w-md">
        <form onSubmit={submit} className="grid gap-5">
          <DialogHeader className="pr-8 text-left">
            <DialogTitle className="text-lg font-semibold tracking-tight">
              Hapus penghuni?
            </DialogTitle>
            <DialogDescription>
              Data <span className="font-medium text-foreground">{name}</span> beserta
              berkasnya akan dihapus dan tidak bisa dikembalikan. Alasan yang kamu tulis
              tercatat di halaman Riwayat.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="delete-reason" className="text-sm font-medium">
              Alasan penghapusan <span className="text-destructive">*</span>
            </Label>
            <textarea
              id="delete-reason"
              required
              rows={4}
              maxLength={MAX_REASON}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError(null);
              }}
              placeholder="Contoh: Pindah ke keluarga, data ganda, salah input"
              className="w-full rounded-2xl border border-input bg-muted/60 px-3 py-2.5 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
            <p className="text-right text-xs text-muted-foreground tabular-nums">
              {reason.length}/{MAX_REASON}
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl px-5"
              disabled={pending}
              onClick={() => handleOpenChange(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={pending || reason.trim().length === 0}
              className="h-11 rounded-xl bg-destructive px-5 text-white hover:bg-destructive/90"
            >
              {pending ? "Menghapus..." : "Hapus penghuni"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

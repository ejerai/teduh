"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FileText, Pencil, Plus, Search, type LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { HistoryAction, HistoryEntry, StaffRole } from "@/types/history";

type Filter = "semua" | HistoryAction;

const filters: { value: Filter; label: string }[] = [
  { value: "semua", label: "Semua" },
  { value: "tambah", label: "Tambah" },
  { value: "ubah", label: "Ubah" },
  { value: "berkas", label: "Berkas" },
];

const actionStyle: Record<
  HistoryAction,
  { icon: LucideIcon; label: string; className: string }
> = {
  tambah: {
    icon: Plus,
    label: "menambahkan penghuni",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
  ubah: {
    icon: Pencil,
    label: "mengubah data",
    className: "bg-primary/10 text-primary",
  },
  berkas: {
    icon: FileText,
    label: "mengunggah berkas",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  },
};

const roleLabel: Record<StaffRole, string> = {
  admin: "Admin",
  petugas: "Petugas",
  pengasuh: "Pengasuh",
};

export function HistoryList({ entries }: { entries: HistoryEntry[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("semua");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries
      .filter((e) => {
        const matchAction = filter === "semua" || e.action === filter;
        const matchQuery =
          q === "" ||
          e.residentName.toLowerCase().includes(q) ||
          e.actor.toLowerCase().includes(q) ||
          e.summary.toLowerCase().includes(q);
        return matchAction && matchQuery;
      })
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }, [entries, query, filter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 @2xl:flex-row @2xl:items-center @2xl:justify-between">
        <div className="relative w-full @2xl:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari penghuni, petugas, atau perubahan"
            className="h-11 rounded-2xl border-0 bg-muted pl-10 shadow-none"
          />
        </div>

        <div className="inline-flex max-w-full overflow-x-auto rounded-2xl bg-muted p-1">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded-xl px-3.5 py-1.5 text-sm font-medium transition-all",
                filter === f.value
                  ? "bg-card shadow-sm"
                  : "text-foreground/60 hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-border">
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            Tidak ada riwayat yang cocok.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((e) => {
              const style = actionStyle[e.action];
              const Icon = style.icon;
              return (
                <li
                  key={e.id}
                  className="flex gap-4 p-4 transition-colors hover:bg-muted/40 @lg:p-5"
                >
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-2xl",
                      style.className
                    )}
                  >
                    <Icon className="size-[18px]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 @2xl:flex-row @2xl:items-start @2xl:justify-between @2xl:gap-6">
                      <p className="text-sm">
                        <span className="font-medium">{e.actor}</span>{" "}
                        <span className="text-muted-foreground">
                          ({roleLabel[e.role]}) {style.label} untuk
                        </span>{" "}
                        <Link
                          href={`/residents/${e.residentId}`}
                          className="font-medium hover:text-primary"
                        >
                          {e.residentName}
                        </Link>
                      </p>
                      <time
                        dateTime={e.timestamp}
                        className="shrink-0 text-xs text-muted-foreground"
                      >
                        {formatDateTime(e.timestamp)}
                      </time>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {e.summary}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
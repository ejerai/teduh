"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { formatAdmission, getAge, getStay } from "@/lib/format";
import { mobilityLabel } from "@/lib/labels";
import { cn } from "@/lib/utils";
import type { Resident, ResidentStatus } from "@/types/resident";

type Filter = "semua" | ResidentStatus;

const filters: { value: Filter; label: string }[] = [
  { value: "semua", label: "Semua" },
  { value: "aktif", label: "Aktif" },
  { value: "keluar", label: "Keluar" },
];

export function ResidentsTable({ residents }: { residents: Resident[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("semua");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return residents.filter((r) => {
      const matchStatus = filter === "semua" || r.status === filter;
      const matchQuery =
        q === "" ||
        r.fullName.toLowerCase().includes(q) ||
        (r.nickname ?? "").toLowerCase().includes(q) ||
        (r.referral ?? "").toLowerCase().includes(q) ||
        (r.healthNotes ?? "").toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [residents, query, filter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 @2xl:flex-row @2xl:items-center @2xl:justify-between">
        <div className="relative w-full @2xl:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama, rujukan, atau catatan"
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

      <p className="text-sm text-muted-foreground">
        {filtered.length} dari {residents.length} penghuni
      </p>

      <div className="overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Nama</TableHead>
              <TableHead>Umur</TableHead>
              <TableHead className="hidden @2xl:table-cell">Masuk</TableHead>
              <TableHead className="hidden @2xl:table-cell">Lama tinggal</TableHead>
              <TableHead className="hidden @4xl:table-cell">Alat bantu</TableHead>
              <TableHead className="hidden @4xl:table-cell">Rujukan</TableHead>
              <TableHead className="pr-6">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="pl-6 font-medium">
                  <Link href={`/residents/${r.id}`} className="hover:text-primary">
                    {r.fullName}
                  </Link>
                  {r.nickname && (
                    <span className="font-normal text-muted-foreground"> ({r.nickname})</span>
                  )}
                </TableCell>
                <TableCell>{getAge(r.birthDate)} th</TableCell>
                <TableCell className="hidden @2xl:table-cell">
                  {formatAdmission(r.admissionDate, r.admissionApprox)}
                </TableCell>
                <TableCell className="hidden @2xl:table-cell">
                  {getStay(r.admissionDate)}
                </TableCell>
                <TableCell className="hidden @4xl:table-cell">
                  {r.mobility ? mobilityLabel[r.mobility] : "-"}
                </TableCell>
                <TableCell className="hidden @4xl:table-cell">{r.referral ?? "-"}</TableCell>
                <TableCell className="pr-6">
                  <StatusBadge status={r.status} />
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  Tidak ada penghuni yang cocok.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

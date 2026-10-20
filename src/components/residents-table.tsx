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
import { formatDate, getAge } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Resident, ResidentStatus } from "@/types/resident";

type Filter = "semua" | ResidentStatus;

const filters: { value: Filter; label: string }[] = [
  { value: "semua", label: "Semua" },
  { value: "aktif", label: "Aktif" },
  { value: "dirawat", label: "Dirawat" },
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
        r.roomNumber.toLowerCase().includes(q) ||
        r.guardian.name.toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [residents, query, filter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama, kamar, atau wali"
            className="h-10 rounded-xl bg-white pl-9"
          />
        </div>

        <div className="inline-flex rounded-xl bg-black/5 p-1">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
                filter === f.value
                  ? "bg-white shadow-sm"
                  : "text-foreground/60 hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-black/5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Nama</TableHead>
              <TableHead>Umur</TableHead>
              <TableHead>Kamar</TableHead>
              <TableHead>Masuk</TableHead>
              <TableHead>Wali</TableHead>
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
                </TableCell>
                <TableCell>{getAge(r.birthDate)} th</TableCell>
                <TableCell>{r.roomNumber}</TableCell>
                <TableCell>{formatDate(r.admissionDate)}</TableCell>
                <TableCell>
                  {r.guardian.name}
                  <span className="text-muted-foreground"> ({r.guardian.relationship})</span>
                </TableCell>
                <TableCell className="pr-6">
                  <StatusBadge status={r.status} />
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
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
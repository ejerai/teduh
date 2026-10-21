"use client";

import { useMemo, useState } from "react";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

const statusBar: Record<ResidentStatus, { label: string; bar: string }> = {
  aktif: { label: "Aktif", bar: "bg-emerald-500" },
  dirawat: { label: "Dirawat", bar: "bg-amber-500" },
  keluar: { label: "Keluar", bar: "bg-zinc-400" },
};

function csvCell(value: string | number) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function buildCsv(rows: Resident[]) {
  const header = [
    "Nama",
    "Jenis kelamin",
    "Tanggal lahir",
    "Umur",
    "Kamar",
    "Tanggal masuk",
    "Status",
    "Wali",
    "Hubungan",
    "Telepon wali",
    "Jumlah berkas",
  ];
  const lines = rows.map((r) =>
    [
      r.fullName,
      r.gender === "L" ? "Laki-laki" : "Perempuan",
      formatDate(r.birthDate),
      getAge(r.birthDate),
      r.roomNumber,
      formatDate(r.admissionDate),
      r.status,
      r.guardian.name,
      r.guardian.relationship,
      `="${r.guardian.phone}"`, // agar Excel tidak menghapus angka 0 di depan
      r.documentCount,
    ]
      .map(csvCell)
      .join(",")
  );
  // BOM di depan supaya Excel membaca huruf dengan benar
  return "\uFEFF" + [header.map(csvCell).join(","), ...lines].join("\r\n");
}

export function ReportPanel({ residents }: { residents: Resident[] }) {
  const [filter, setFilter] = useState<Filter>("semua");

  const rows = useMemo(
    () => residents.filter((r) => filter === "semua" || r.status === filter),
    [residents, filter]
  );

  const totalDocs = rows.reduce((n, r) => n + r.documentCount, 0);

  function downloadCsv() {
    const blob = new Blob([buildCsv(rows)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const today = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `laporan-penghuni-${today}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-4 @4xl:grid-cols-3 @4xl:items-start">
      {/* Pratinjau */}
      <div className="space-y-4 @4xl:col-span-2">
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

        <div className="overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Nama</TableHead>
                <TableHead>Kamar</TableHead>
                <TableHead className="hidden @2xl:table-cell">Masuk</TableHead>
                <TableHead className="hidden @2xl:table-cell">Berkas</TableHead>
                <TableHead className="pr-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="pl-6 font-medium">{r.fullName}</TableCell>
                  <TableCell>{r.roomNumber}</TableCell>
                  <TableCell className="hidden @2xl:table-cell">
                    {formatDate(r.admissionDate)}
                  </TableCell>
                  <TableCell className="hidden @2xl:table-cell">
                    {r.documentCount}
                  </TableCell>
                  <TableCell className="pr-6">
                    <StatusBadge status={r.status} />
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-muted-foreground"
                  >
                    Tidak ada data untuk filter ini.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Samping: ekspor dan ringkasan */}
      <div className="space-y-4">
        <section className="rounded-3xl border border-border bg-card p-5 shadow-sm @lg:p-6">
          <h2 className="text-base font-semibold tracking-tight">Ekspor laporan</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} penghuni · {totalDocs} berkas sesuai filter di samping.
          </p>

          <div className="mt-5 space-y-2.5">
            <Button
              type="button"
              onClick={downloadCsv}
              disabled={rows.length === 0}
              className="h-11 w-full rounded-xl text-[15px] font-semibold"
            >
              <Download className="size-4" />
              Unduh CSV
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled
              className="h-11 w-full rounded-xl"
            >
              <FileSpreadsheet className="size-4" />
              Excel (.xlsx) · segera
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled
              className="h-11 w-full rounded-xl"
            >
              <FileText className="size-4" />
              PDF · segera
            </Button>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-5 shadow-sm @lg:p-6">
          <h2 className="text-base font-semibold tracking-tight">
            Komposisi status
          </h2>
          <div className="mt-5 space-y-4">
            {(Object.keys(statusBar) as ResidentStatus[]).map((s) => {
              const count = residents.filter((r) => r.status === s).length;
              const pct = residents.length
                ? Math.round((count / residents.length) * 100)
                : 0;
              return (
                <div key={s}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{statusBar[s].label}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {count} · {pct}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn("h-full rounded-full", statusBar[s].bar)}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
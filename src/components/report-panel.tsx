"use client";

import { useMemo, useState } from "react";
import { Download, FileText } from "lucide-react";
import { ResidentCard } from "@/components/resident-card";
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
import { formatAdmission, getAge, getStay } from "@/lib/format";
import { genderLabel, mobilityLabel } from "@/lib/labels";
import { downloadResidentsPdf } from "@/lib/report-pdf";
import { cn } from "@/lib/utils";
import type { Resident, ResidentStatus } from "@/types/resident";

type Filter = "semua" | ResidentStatus;

const filters: { value: Filter; label: string }[] = [
  { value: "semua", label: "Semua" },
  { value: "aktif", label: "Aktif" },
  { value: "keluar", label: "Keluar" },
];

const statusBar: Record<ResidentStatus, { label: string; bar: string }> = {
  aktif: { label: "Aktif", bar: "bg-emerald-500" },
  keluar: { label: "Keluar", bar: "bg-zinc-400" },
};

function csvCell(value: string | number) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function buildCsv(rows: Resident[]) {
  const header = [
    "Nama",
    "Panggilan",
    "Jenis kelamin",
    "Tanggal lahir",
    "Umur",
    "Ukuran baju",
    "Tanggal masuk",
    "Lama tinggal",
    "Rujukan",
    "Alat bantu",
    "Catatan kesehatan",
    "Status",
  ];
  const lines = rows.map((r) =>
    [
      r.fullName,
      r.nickname ?? "",
      genderLabel[r.gender],
      r.birthDate, // format YYYY-MM-DD supaya Excel membacanya sebagai tanggal
      getAge(r.birthDate),
      r.clothingSize ?? "",
      r.admissionDate ? formatAdmission(r.admissionDate, r.admissionApprox) : "",
      getStay(r.admissionDate),
      r.referral ?? "",
      r.mobility ? mobilityLabel[r.mobility] : "",
      r.healthNotes ?? "",
      r.status,
    ]
      .map(csvCell)
      .join(",")
  );
  // BOM di depan supaya Excel membaca huruf dengan benar
  return "\uFEFF" + [header.map(csvCell).join(","), ...lines].join("\r\n");
}

export function ReportPanel({ residents }: { residents: Resident[] }) {
  const [filter, setFilter] = useState<Filter>("semua");
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const rows = useMemo(
    () => residents.filter((r) => filter === "semua" || r.status === filter),
    [residents, filter]
  );


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

  async function downloadPdf() {
    setPdfError(null);
    setPdfBusy(true);
    try {
      const label = filters.find((f) => f.value === filter)?.label ?? "Semua";
      await downloadResidentsPdf(rows, label);
    } catch {
      setPdfError("PDF gagal dibuat. Coba lagi, atau pakai CSV.");
    } finally {
      setPdfBusy(false);
    }
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

        {/* Layar kecil: kartu dengan semua data */}
        <div className="space-y-3 @4xl:hidden">
          {rows.map((r) => (
            <ResidentCard key={r.id} resident={r} />
          ))}
          {rows.length === 0 && (
            <p className="rounded-3xl bg-card py-10 text-center text-sm text-muted-foreground shadow-sm ring-1 ring-border">
              Tidak ada data untuk filter ini.
            </p>
          )}
        </div>

        {/* Layar lebar: tabel */}
        <div className="hidden overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-border @4xl:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Nama</TableHead>
                <TableHead>Umur</TableHead>
                <TableHead>Masuk</TableHead>
                <TableHead>Alat bantu</TableHead>
                <TableHead className="pr-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="pl-6 font-medium">{r.fullName}</TableCell>
                  <TableCell>{getAge(r.birthDate)} th</TableCell>
                  <TableCell>
                    {formatAdmission(r.admissionDate, r.admissionApprox)}
                  </TableCell>
                  <TableCell>{r.mobility ? mobilityLabel[r.mobility] : "-"}</TableCell>
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
            {rows.length} penghuni sesuai filter yang dipilih.
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
              onClick={downloadPdf}
              disabled={rows.length === 0 || pdfBusy}
              className="h-11 w-full rounded-xl text-[15px] font-semibold"
            >
              <FileText className="size-4" />
              {pdfBusy ? "Membuat PDF..." : "Unduh PDF"}
            </Button>
            {pdfError && (
              <p role="alert" className="text-sm text-destructive">
                {pdfError}
              </p>
            )}
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
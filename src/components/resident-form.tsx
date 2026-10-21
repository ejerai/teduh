"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Resident, ResidentStatus } from "@/types/resident";

interface FormValues {
  fullName: string;
  gender: "L" | "P";
  birthDate: string;
  roomNumber: string;
  admissionDate: string;
  status: ResidentStatus;
  guardianName: string;
  guardianRelationship: string;
  guardianPhone: string;
}

const emptyValues: FormValues = {
  fullName: "",
  gender: "L",
  birthDate: "",
  roomNumber: "",
  admissionDate: "",
  status: "aktif",
  guardianName: "",
  guardianRelationship: "",
  guardianPhone: "",
};

function toValues(r: Resident): FormValues {
  return {
    fullName: r.fullName,
    gender: r.gender,
    birthDate: r.birthDate,
    roomNumber: r.roomNumber,
    admissionDate: r.admissionDate,
    status: r.status,
    guardianName: r.guardian.name,
    guardianRelationship: r.guardian.relationship,
    guardianPhone: r.guardian.phone,
  };
}

const inputClass =
  "h-11 rounded-2xl bg-muted/60 shadow-none dark:[color-scheme:dark]";

function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-sm @lg:p-6">
      <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
      <div className="mt-5 grid gap-5 @2xl:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  required,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      {children}
    </div>
  );
}

function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div
      role="radiogroup"
      className="inline-flex max-w-full overflow-x-auto rounded-2xl bg-muted p-1"
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-xl px-3.5 py-1.5 text-sm font-medium transition-all",
            value === o.value
              ? "bg-card shadow-sm"
              : "text-foreground/60 hover:text-foreground"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function ResidentForm({ resident }: { resident?: Resident }) {
  const [values, setValues] = useState<FormValues>(
    resident ? toValues(resident) : emptyValues
  );
  const [saved, setSaved] = useState(false);

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setSaved(false);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("Data form (belum disimpan ke database):", values);
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {saved && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
        >
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          <p>
            Form valid. Data belum benar-benar tersimpan karena penyimpanan ke
            database dikerjakan di tahap backend. Isinya bisa dilihat di
            console browser (F12).
          </p>
        </div>
      )}

      <Panel title="Data penghuni" description="Kolom bertanda * wajib diisi.">
        <Field label="Nama lengkap" htmlFor="fullName" required className="@2xl:col-span-2">
          <Input
            id="fullName"
            required
            value={values.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            placeholder="Nama sesuai identitas"
            className={inputClass}
          />
        </Field>

        <Field label="Jenis kelamin" required>
          <Segmented
            value={values.gender}
            onChange={(v) => set("gender", v)}
            options={[
              { value: "L", label: "Laki-laki" },
              { value: "P", label: "Perempuan" },
            ]}
          />
        </Field>

        <Field label="Status" required>
          <Segmented
            value={values.status}
            onChange={(v) => set("status", v)}
            options={[
              { value: "aktif", label: "Aktif" },
              { value: "dirawat", label: "Dirawat" },
              { value: "keluar", label: "Keluar" },
            ]}
          />
        </Field>

        <Field label="Tanggal lahir" htmlFor="birthDate" required>
          <Input
            id="birthDate"
            type="date"
            required
            value={values.birthDate}
            onChange={(e) => set("birthDate", e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Tanggal masuk" htmlFor="admissionDate" required>
          <Input
            id="admissionDate"
            type="date"
            required
            value={values.admissionDate}
            onChange={(e) => set("admissionDate", e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Nomor kamar" htmlFor="roomNumber" required>
          <Input
            id="roomNumber"
            required
            value={values.roomNumber}
            onChange={(e) => set("roomNumber", e.target.value)}
            placeholder="Contoh: A-01"
            className={inputClass}
          />
        </Field>
      </Panel>

      <Panel
        title="Wali / kontak keluarga"
        description="Orang yang dihubungi untuk keperluan penghuni."
      >
        <Field label="Nama wali" htmlFor="guardianName" required>
          <Input
            id="guardianName"
            required
            value={values.guardianName}
            onChange={(e) => set("guardianName", e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Hubungan" htmlFor="guardianRelationship" required>
          <Input
            id="guardianRelationship"
            required
            value={values.guardianRelationship}
            onChange={(e) => set("guardianRelationship", e.target.value)}
            placeholder="Contoh: Anak, Cucu, Istri"
            className={inputClass}
          />
        </Field>

        <Field label="Nomor telepon" htmlFor="guardianPhone" required className="@2xl:col-span-2">
          <Input
            id="guardianPhone"
            type="tel"
            inputMode="tel"
            required
            value={values.guardianPhone}
            onChange={(e) => set("guardianPhone", e.target.value)}
            placeholder="08xxxxxxxxxx"
            className={inputClass}
          />
        </Field>
      </Panel>

      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
        <Link
          href={resident ? `/residents/${resident.id}` : "/residents"}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-11 rounded-xl px-5"
          )}
        >
          Batal
        </Link>
        <Button type="submit" className="h-11 rounded-xl px-6">
          Simpan
        </Button>
      </div>
    </form>
  );
}
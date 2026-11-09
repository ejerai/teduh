"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import {
  createResidentAction,
  updateResidentAction,
  type ResidentFormState,
} from "@/app/actions/residents";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CLOTHING_SIZES, MOBILITIES, mobilityLabel } from "@/lib/labels";
import { cn } from "@/lib/utils";
import type { Resident } from "@/types/resident";

interface FormValues {
  fullName: string;
  nickname: string;
  gender: "L" | "P";
  birthDate: string;
  clothingSize: string;
  admissionDate: string;
  admissionApprox: boolean;
  referral: string;
  mobility: string;
  healthNotes: string;
  status: "aktif" | "keluar";
}

const emptyValues: FormValues = {
  fullName: "",
  nickname: "",
  gender: "P",
  birthDate: "",
  clothingSize: "",
  admissionDate: "",
  admissionApprox: false,
  referral: "",
  mobility: "",
  healthNotes: "",
  status: "aktif",
};

function toValues(r: Resident): FormValues {
  return {
    fullName: r.fullName,
    nickname: r.nickname ?? "",
    gender: r.gender,
    birthDate: r.birthDate,
    clothingSize: r.clothingSize ?? "",
    admissionDate: r.admissionDate ?? "",
    admissionApprox: r.admissionApprox,
    referral: r.referral ?? "",
    mobility: r.mobility ?? "",
    healthNotes: r.healthNotes ?? "",
    status: r.status,
  };
}

const inputClass = "h-11 rounded-2xl bg-muted/60 shadow-none dark:[color-scheme:dark]";
const selectClass =
  "h-11 w-full rounded-2xl border border-input bg-muted/60 px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

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
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-5 grid gap-5 @2xl:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  required,
  error,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
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
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Segmented<T extends string>({
  name,
  value,
  onChange,
  options,
}: {
  name: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div role="radiogroup" className="inline-flex max-w-full overflow-x-auto rounded-2xl bg-muted p-1">
      <input type="hidden" name={name} value={value} />
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-xl px-3.5 py-1.5 text-sm font-medium transition-all",
            value === o.value ? "bg-card shadow-sm" : "text-foreground/60 hover:text-foreground"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function ResidentForm({ resident }: { resident?: Resident }) {
  const action = resident
    ? updateResidentAction.bind(null, resident.id)
    : createResidentAction;
  const [state, formAction, pending] = useActionState<ResidentFormState, FormData>(action, {});
  const [values, setValues] = useState<FormValues>(resident ? toValues(resident) : emptyValues);

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }
  const err = state.errors ?? {};

  return (
    <form action={formAction} className="space-y-4">
      {state.message && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p>{state.message}</p>
        </div>
      )}

      <Panel title="Data penghuni" description="Kolom bertanda * wajib diisi.">
        <Field label="Nama lengkap" htmlFor="fullName" required error={err.fullName} className="@2xl:col-span-2">
          <Input
            id="fullName"
            name="fullName"
            required
            value={values.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            placeholder="Nama sesuai identitas"
            className={inputClass}
          />
        </Field>

        <Field label="Nama panggilan" htmlFor="nickname" error={err.nickname}>
          <Input
            id="nickname"
            name="nickname"
            value={values.nickname}
            onChange={(e) => set("nickname", e.target.value)}
            placeholder="Contoh: Yoke"
            className={inputClass}
          />
        </Field>

        <Field label="Jenis kelamin" required error={err.gender}>
          <Segmented
            name="gender"
            value={values.gender}
            onChange={(v) => set("gender", v)}
            options={[
              { value: "L", label: "Laki-laki" },
              { value: "P", label: "Perempuan" },
            ]}
          />
        </Field>

        <Field label="Tanggal lahir" htmlFor="birthDate" required error={err.birthDate}>
          <Input
            id="birthDate"
            name="birthDate"
            type="date"
            required
            value={values.birthDate}
            onChange={(e) => set("birthDate", e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Ukuran baju" htmlFor="clothingSize" error={err.clothingSize}>
          <select
            id="clothingSize"
            name="clothingSize"
            value={values.clothingSize}
            onChange={(e) => set("clothingSize", e.target.value)}
            className={selectClass}
          >
            <option value="">Belum dicatat</option>
            {CLOTHING_SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Status" required error={err.status}>
          <Segmented
            name="status"
            value={values.status}
            onChange={(v) => set("status", v)}
            options={[
              { value: "aktif", label: "Aktif" },
              { value: "keluar", label: "Keluar" },
            ]}
          />
        </Field>
      </Panel>

      <Panel title="Masuk panti" description="Jika hanya tahu lama tinggalnya, isi perkiraan tanggal lalu centang kotak perkiraan.">
        <Field label="Tanggal masuk" htmlFor="admissionDate" error={err.admissionDate}>
          <Input
            id="admissionDate"
            name="admissionDate"
            type="date"
            value={values.admissionDate}
            onChange={(e) => set("admissionDate", e.target.value)}
            className={inputClass}
          />
          <label className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              name="admissionApprox"
              checked={values.admissionApprox}
              onChange={(e) => set("admissionApprox", e.target.checked)}
              className="size-4 accent-[var(--primary)]"
            />
            Tanggal ini perkiraan
          </label>
        </Field>

        <Field label="Asal rujukan" htmlFor="referral" error={err.referral}>
          <Input
            id="referral"
            name="referral"
            value={values.referral}
            onChange={(e) => set("referral", e.target.value)}
            placeholder="Contoh: Dinas Sosial, Pak John, datang sendiri"
            className={inputClass}
          />
        </Field>
      </Panel>

      <Panel title="Kondisi" description="Opsional. Catat alat bantu dan kondisi yang perlu diketahui pengasuh.">
        <Field label="Alat bantu" htmlFor="mobility" error={err.mobility}>
          <select
            id="mobility"
            name="mobility"
            value={values.mobility}
            onChange={(e) => set("mobility", e.target.value)}
            className={selectClass}
          >
            <option value="">Belum dicatat</option>
            {MOBILITIES.map((m) => (
              <option key={m} value={m}>
                {mobilityLabel[m]}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Catatan kesehatan" htmlFor="healthNotes" error={err.healthNotes} className="@2xl:col-span-2">
          <textarea
            id="healthNotes"
            name="healthNotes"
            rows={3}
            value={values.healthNotes}
            onChange={(e) => set("healthNotes", e.target.value)}
            placeholder="Contoh: pengapuran, stroke kronis"
            className="w-full rounded-2xl border border-input bg-muted/60 px-3 py-2.5 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          />
        </Field>
      </Panel>

      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
        <Link
          href={resident ? `/residents/${resident.id}` : "/residents"}
          className={cn(buttonVariants({ variant: "outline" }), "h-11 rounded-xl px-5")}
        >
          Batal
        </Link>
        <Button type="submit" disabled={pending} className="h-11 rounded-xl px-6">
          {pending ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
}

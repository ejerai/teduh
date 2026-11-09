"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { CLOTHING_SIZES, MOBILITIES, mobilityLabel, genderLabel } from "@/lib/labels";
import type { ClothingSize, Gender, Mobility, ResidentStatus } from "@/types/resident";

export type ResidentFormState = {
  message?: string;
  errors?: Partial<Record<string, string>>;
};

type Parsed = {
  fullName: string;
  nickname: string | null;
  gender: Gender;
  birthDate: Date;
  clothingSize: ClothingSize | null;
  admissionDate: Date | null;
  admissionApprox: boolean;
  referral: string | null;
  mobility: Mobility | null;
  healthNotes: string | null;
  status: ResidentStatus;
};

function parseDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const d = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== value ? null : d;
}

const text = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const optional = (fd: FormData, key: string) => text(fd, key) || null;

function parse(fd: FormData): { data?: Parsed; errors?: Record<string, string> } {
  const errors: Record<string, string> = {};

  const fullName = text(fd, "fullName");
  if (!fullName) errors.fullName = "Nama lengkap wajib diisi.";

  const gender = text(fd, "gender");
  if (gender !== "L" && gender !== "P") errors.gender = "Pilih jenis kelamin.";

  const birthDate = parseDate(text(fd, "birthDate"));
  if (!birthDate) errors.birthDate = "Tanggal lahir wajib diisi dengan benar.";
  else if (birthDate > new Date() || birthDate.getUTCFullYear() < 1900)
    errors.birthDate = "Tanggal lahir tidak masuk akal.";

  const admissionRaw = text(fd, "admissionDate");
  const admissionDate = admissionRaw ? parseDate(admissionRaw) : null;
  if (admissionRaw && !admissionDate) errors.admissionDate = "Tanggal masuk tidak valid.";
  else if (admissionDate && admissionDate > new Date())
    errors.admissionDate = "Tanggal masuk tidak boleh di masa depan.";

  const clothingRaw = text(fd, "clothingSize");
  if (clothingRaw && !(CLOTHING_SIZES as readonly string[]).includes(clothingRaw))
    errors.clothingSize = "Ukuran baju tidak valid.";

  const mobilityRaw = text(fd, "mobility");
  if (mobilityRaw && !(MOBILITIES as readonly string[]).includes(mobilityRaw))
    errors.mobility = "Pilihan alat bantu tidak valid.";

  const status = text(fd, "status");
  if (status !== "aktif" && status !== "keluar") errors.status = "Status tidak valid.";

  if (Object.keys(errors).length > 0) return { errors };

  return {
    data: {
      fullName,
      nickname: optional(fd, "nickname"),
      gender: gender as Gender,
      birthDate: birthDate as Date,
      clothingSize: (clothingRaw || null) as ClothingSize | null,
      admissionDate,
      admissionApprox: admissionDate ? fd.get("admissionApprox") === "on" : false,
      referral: optional(fd, "referral"),
      mobility: (mobilityRaw || null) as Mobility | null,
      healthNotes: optional(fd, "healthNotes"),
      status: status as ResidentStatus,
    },
  };
}

async function authorize() {
  const user = await getSession();
  if (!user) return { error: "Sesi berakhir. Silakan masuk lagi." } as const;
  if (user.role === "pengasuh")
    return { error: "Peran Pengasuh hanya bisa melihat data penghuni." } as const;
  return { user } as const;
}

function refresh() {
  revalidatePath("/", "layout");
}

export async function createResidentAction(
  _prev: ResidentFormState,
  formData: FormData,
): Promise<ResidentFormState> {
  const auth = await authorize();
  if ("error" in auth) return { message: auth.error };

  const { data, errors } = parse(formData);
  if (!data) return { errors, message: "Periksa kembali isian yang ditandai." };

  const created = await prisma.$transaction(async (tx) => {
    const r = await tx.resident.create({ data });
    await tx.historyEntry.create({
      data: {
        action: "tambah",
        summary: "Penghuni baru ditambahkan",
        residentName: r.fullName,
        residentId: r.id,
        actorId: auth.user.id,
      },
    });
    return r;
  });

  refresh();
  redirect(`/residents/${created.id}`);
}

const fieldLabels: Record<string, string> = {
  fullName: "Nama",
  nickname: "Panggilan",
  gender: "Jenis kelamin",
  birthDate: "Tanggal lahir",
  clothingSize: "Ukuran baju",
  admissionDate: "Tanggal masuk",
  admissionApprox: "Tanggal masuk perkiraan",
  referral: "Rujukan",
  mobility: "Alat bantu",
  healthNotes: "Catatan kesehatan",
  status: "Status",
};

function show(key: string, value: unknown): string {
  if (value === null || value === undefined || value === "") return "kosong";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (key === "gender") return genderLabel[value as Gender];
  if (key === "mobility") return mobilityLabel[value as Mobility];
  if (typeof value === "boolean") return value ? "ya" : "tidak";
  return String(value);
}

export async function updateResidentAction(
  id: string,
  _prev: ResidentFormState,
  formData: FormData,
): Promise<ResidentFormState> {
  const auth = await authorize();
  if ("error" in auth) return { message: auth.error };

  const { data, errors } = parse(formData);
  if (!data) return { errors, message: "Periksa kembali isian yang ditandai." };

  const before = await prisma.resident.findUnique({ where: { id } });
  if (!before) return { message: "Data penghuni tidak ditemukan." };

  const changes: string[] = [];
  for (const key of Object.keys(data) as (keyof Parsed)[]) {
    const a = before[key] instanceof Date ? (before[key] as Date).getTime() : before[key];
    const b = data[key] instanceof Date ? (data[key] as Date).getTime() : data[key];
    if (a === b) continue;
    changes.push(
      key === "healthNotes"
        ? "Catatan kesehatan diperbarui"
        : `${fieldLabels[key]}: ${show(key, before[key])} → ${show(key, data[key])}`,
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.resident.update({ where: { id }, data });
    if (changes.length > 0) {
      await tx.historyEntry.create({
        data: {
          action: "ubah",
          summary: changes.join("; "),
          residentName: data.fullName,
          residentId: id,
          actorId: auth.user.id,
        },
      });
    }
  });

  refresh();
  redirect(`/residents/${id}`);
}

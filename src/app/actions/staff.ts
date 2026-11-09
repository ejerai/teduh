"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import type { StaffRole } from "@/types/history";

export type ActionResult = { ok: boolean; message: string };

const ROLES: StaffRole[] = ["admin", "petugas", "pengasuh"];
const fail = (message: string): ActionResult => ({ ok: false, message });

async function requireAdmin() {
  const user = await getSession();
  return user && user.role === "admin" ? user : null;
}

export async function updateProfileAction(name: string): Promise<ActionResult> {
  const user = await getSession();
  if (!user) return fail("Sesi berakhir. Silakan masuk lagi.");
  const clean = name.trim();
  if (!clean) return fail("Nama tidak boleh kosong.");
  await prisma.user.update({ where: { id: user.id }, data: { name: clean } });
  revalidatePath("/", "layout");
  return { ok: true, message: "Profil tersimpan." };
}

export async function changePasswordAction(
  current: string,
  next: string,
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return fail("Sesi berakhir. Silakan masuk lagi.");
  if (next.length < 8) return fail("Kata sandi baru minimal 8 karakter.");

  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user || !(await bcrypt.compare(current, user.passwordHash)))
    return fail("Kata sandi saat ini salah.");

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(next, 10) },
  });
  return { ok: true, message: "Kata sandi diperbarui." };
}

export async function createStaffAction(input: {
  name: string;
  email: string;
  role: StaffRole;
  password: string;
}): Promise<ActionResult> {
  if (!(await requireAdmin())) return fail("Hanya admin yang bisa menambah petugas.");

  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  if (!name || !email) return fail("Nama dan email wajib diisi.");
  if (!ROLES.includes(input.role)) return fail("Peran tidak valid.");
  if (input.password.length < 8) return fail("Kata sandi awal minimal 8 karakter.");

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return fail("Email itu sudah terdaftar.");

  await prisma.user.create({
    data: {
      name,
      email,
      role: input.role,
      passwordHash: await bcrypt.hash(input.password, 10),
    },
  });
  revalidatePath("/", "layout");
  return { ok: true, message: "Petugas ditambahkan." };
}

export async function updateStaffAction(
  id: string,
  patch: { role?: StaffRole; active?: boolean },
): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin) return fail("Hanya admin yang bisa mengubah akun petugas.");
  if (admin.id === id) return fail("Akun sendiri tidak bisa diubah dari sini.");
  if (patch.role && !ROLES.includes(patch.role)) return fail("Peran tidak valid.");

  await prisma.user.update({
    where: { id },
    data: {
      ...(patch.role !== undefined && { role: patch.role }),
      ...(patch.active !== undefined && { active: patch.active }),
    },
  });
  revalidatePath("/", "layout");
  return { ok: true, message: "Perubahan tersimpan." };
}

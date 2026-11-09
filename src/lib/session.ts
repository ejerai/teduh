import { cache } from "react";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";
import type { SessionUser } from "@/types/user";

const COOKIE = "teduh_session";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 jam

function secret() {
  const s = process.env.AUTH_SECRET;
  if (s) return s;
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET belum diisi di environment production.");
  }
  return "teduh-dev-secret-hanya-untuk-lokal";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export async function createSession(userId: string) {
  const exp = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = `${userId}.${exp}`;
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

/** Pengguna yang sedang masuk, atau null. Dicek ulang ke database (akun nonaktif langsung ditolak). */
export const getSession = cache(async (): Promise<SessionUser | null> => {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;

  const [userId, exp, sig] = token.split(".");
  if (!userId || !exp || !sig) return null;

  const expected = Buffer.from(sign(`${userId}.${exp}`));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  if (Number(exp) < Date.now()) return null;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.active) return null;

  return { id: user.id, name: user.name, email: user.email, role: user.role };
});

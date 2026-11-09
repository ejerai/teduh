import { prisma } from "@/lib/prisma";
import type { HistoryEntry } from "@/types/history";
import type { Resident } from "@/types/resident";
import type { StaffMember } from "@/types/user";

const iso = (d: Date) => d.toISOString().slice(0, 10);

type ResidentRow = Awaited<ReturnType<typeof prisma.resident.findMany>>[number];

function toResident(r: ResidentRow, documentCount: number): Resident {
  return {
    id: r.id,
    fullName: r.fullName,
    nickname: r.nickname,
    gender: r.gender,
    birthDate: iso(r.birthDate),
    clothingSize: r.clothingSize,
    admissionDate: r.admissionDate ? iso(r.admissionDate) : null,
    admissionApprox: r.admissionApprox,
    referral: r.referral,
    mobility: r.mobility,
    healthNotes: r.healthNotes,
    status: r.status,
    documentCount,
  };
}

export async function getResidents(): Promise<Resident[]> {
  const rows = await prisma.resident.findMany({
    orderBy: { fullName: "asc" },
    include: { _count: { select: { documents: true } } },
  });
  return rows.map((r) => toResident(r, r._count.documents));
}

export async function getResident(id: string): Promise<Resident | null> {
  const r = await prisma.resident.findUnique({
    where: { id },
    include: { _count: { select: { documents: true } } },
  });
  return r ? toResident(r, r._count.documents) : null;
}

export async function getHistory(limit = 300): Promise<HistoryEntry[]> {
  const rows = await prisma.historyEntry.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { actor: { select: { name: true, role: true } } },
  });
  return rows.map((h) => ({
    id: h.id,
    residentId: h.residentId,
    residentName: h.residentName,
    action: h.action,
    summary: h.summary,
    actor: h.actor.name,
    role: h.actor.role,
    timestamp: h.createdAt.toISOString(),
  }));
}

export async function getStaff(): Promise<StaffMember[]> {
  const rows = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });
  return rows.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    active: u.active,
  }));
}

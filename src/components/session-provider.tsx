"use client";

import { createContext, useContext } from "react";
import type { SessionUser, StaffMember } from "@/types/user";

interface SessionValue {
  user: SessionUser;
  staff: StaffMember[]; // hanya terisi untuk admin
}

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({
  user,
  staff,
  children,
}: SessionValue & { children: React.ReactNode }) {
  return <SessionContext.Provider value={{ user, staff }}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession harus dipakai di dalam SessionProvider");
  return ctx;
}

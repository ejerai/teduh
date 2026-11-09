import type { StaffRole } from "@/types/history";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
}

export interface StaffMember extends SessionUser {
  active: boolean;
}

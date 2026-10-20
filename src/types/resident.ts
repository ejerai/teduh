export type ResidentStatus = "aktif" | "dirawat" | "keluar";

export interface Guardian {
  name: string;
  relationship: string;
  phone: string;
}

export interface Resident {
  id: string;
  fullName: string;
  gender: "L" | "P";
  birthDate: string; // format YYYY-MM-DD
  roomNumber: string;
  admissionDate: string;
  status: ResidentStatus;
  guardian: Guardian;
  documentCount: number;
}
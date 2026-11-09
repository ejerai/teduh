export type ResidentStatus = "aktif" | "keluar";
export type Gender = "L" | "P";
export type ClothingSize = "S" | "M" | "L" | "XL" | "XXL";
export type Mobility = "mandiri" | "tongkat" | "kursi_roda" | "bed_rest";

export interface Resident {
  id: string;
  fullName: string;
  nickname: string | null;
  gender: Gender;
  birthDate: string; // YYYY-MM-DD
  clothingSize: ClothingSize | null;
  admissionDate: string | null; // YYYY-MM-DD
  admissionApprox: boolean; // true = tanggal masuk hanya perkiraan dari lama tinggal
  referral: string | null;
  mobility: Mobility | null;
  healthNotes: string | null;
  status: ResidentStatus;
  documentCount: number;
}

export type HistoryAction = "tambah" | "ubah" | "berkas";
export type StaffRole = "admin" | "petugas" | "pengasuh";

export interface HistoryEntry {
  id: string;
  residentId: string | null; // null jika data penghuni sudah dihapus
  residentName: string;
  action: HistoryAction;
  summary: string;
  actor: string;
  role: StaffRole;
  timestamp: string; // ISO 8601
}

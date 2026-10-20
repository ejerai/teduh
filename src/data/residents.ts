import type { Resident } from "@/types/resident";

export const residents: Resident[] = [
  {
    id: "r-001",
    fullName: "Sutrisno Hadiwijaya",
    gender: "L",
    birthDate: "1944-03-12",
    roomNumber: "A-01",
    admissionDate: "2022-06-01",
    status: "aktif",
    guardian: { name: "Rina Hadiwijaya", relationship: "Anak", phone: "081200000001" },
    documentCount: 5,
  },
  {
    id: "r-002",
    fullName: "Maria Magdalena",
    gender: "P",
    birthDate: "1941-11-27",
    roomNumber: "A-03",
    admissionDate: "2021-02-15",
    status: "dirawat",
    guardian: { name: "Daniel Magdalena", relationship: "Cucu", phone: "081200000002" },
    documentCount: 8,
  },
  {
    id: "r-003",
    fullName: "Yohanes Pranoto",
    gender: "L",
    birthDate: "1948-07-04",
    roomNumber: "B-02",
    admissionDate: "2023-09-20",
    status: "aktif",
    guardian: { name: "Lestari Pranoto", relationship: "Istri", phone: "081200000003" },
    documentCount: 4,
  },
];
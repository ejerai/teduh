import type { Gender, Mobility } from "@/types/resident";

export const genderLabel: Record<Gender, string> = {
  L: "Laki-laki",
  P: "Perempuan",
};

export const mobilityLabel: Record<Mobility, string> = {
  mandiri: "Mandiri",
  tongkat: "Tongkat",
  kursi_roda: "Kursi roda",
  bed_rest: "Bed rest",
};

export const CLOTHING_SIZES = ["S", "M", "L", "XL", "XXL"] as const;
export const MOBILITIES = ["mandiri", "tongkat", "kursi_roda", "bed_rest"] as const;

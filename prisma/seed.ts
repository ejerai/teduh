import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../generated/prisma/client";

type SeedResident = {
  fullName: string;
  nickname?: string;
  gender: "L" | "P";
  birthDate: string;
  clothingSize?: "S" | "M" | "L" | "XL" | "XXL";
  stayMonths?: number;
  referral?: string;
  mobility?: "mandiri" | "tongkat" | "kursi_roda" | "bed_rest";
  healthNotes?: string;
};

type SeedFile = { recordedAt: string; residents: SeedResident[] };

const adapter = new PrismaPg({
  connectionString: `${process.env.DATABASE_URL}`,
});
const prisma = new PrismaClient({ adapter });

// Data asli ada di residents.json (tidak ikut Git). Kalau tidak ada, pakai file contoh.
function loadSeedFile(): { file: SeedFile; source: string } {
  const dir = path.join(process.cwd(), "prisma", "seed-data");
  const real = path.join(dir, "residents.json");
  const example = path.join(dir, "residents.example.json");
  const source = fs.existsSync(real) ? real : example;
  return {
    file: JSON.parse(fs.readFileSync(source, "utf-8")) as SeedFile,
    source,
  };
}

// Panti hanya mencatat lama tinggal, jadi tanggal masuk diperkirakan (tanggal 1 pada bulan yang dihitung mundur).
function monthsBefore(isoDate: string, months: number) {
  const d = new Date(isoDate);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - months, 1));
}

async function main() {
  const { file, source } = loadSeedFile();

  // Bersihkan dulu (urutan penting karena ada relasi)
  await prisma.historyEntry.deleteMany();
  await prisma.document.deleteMany();
  await prisma.resident.deleteMany();
  await prisma.user.deleteMany();

  // Satu-satunya akun pengurus. GANTI email dan kata sandi sebelum dipakai sungguhan.
  const passwordHash = await bcrypt.hash("teduh123", 10);
  await prisma.user.create({
    data: {
      name: "Ibu Hana",
      email: "hana@teduh.test",
      passwordHash,
      role: "admin",
    },
  });

  for (const r of file.residents) {
    await prisma.resident.create({
      data: {
        fullName: r.fullName,
        nickname: r.nickname ?? null,
        gender: r.gender,
        birthDate: new Date(r.birthDate),
        clothingSize: r.clothingSize ?? null,
        admissionDate:
          r.stayMonths != null
            ? monthsBefore(file.recordedAt, r.stayMonths)
            : null,
        admissionApprox: r.stayMonths != null,
        referral: r.referral ?? null,
        mobility: r.mobility ?? null,
        healthNotes: r.healthNotes ?? null,
      },
    });
  }

  console.log(
    `Seed selesai dari ${path.basename(source)}: 1 pengurus, ${file.residents.length} penghuni.`,
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

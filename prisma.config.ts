import "dotenv/config";
import { defineConfig } from "prisma/config";

// File ini harus bernama prisma.config.ts supaya otomatis dikenali Prisma CLI.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env["postgresql://postgres:ejra@localhost:5432/panti_db?schema=public"],
  },
});

import Link from "next/link";
import {
  ArrowRight,
  DatabaseBackup,
  FileBarChart,
  FileText,
  History,
  Lock,
  Search,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { HeroArt } from "@/components/hero-art";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const features: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Users,
    title: "Data penghuni digital",
    description:
      "Catat identitas, kamar, status, dan kontak wali setiap penghuni lansia dalam satu database terpusat.",
  },
  {
    icon: FileText,
    title: "Unggah berkas",
    description:
      "Simpan dokumen penghuni secara digital, rapi per penghuni, dan hanya bisa dibuka setelah masuk.",
  },
  {
    icon: Search,
    title: "Pencarian dan filter",
    description:
      "Temukan penghuni lewat nama, kamar, atau wali, lalu saring berdasarkan status dalam hitungan detik.",
  },
  {
    icon: History,
    title: "Riwayat perubahan",
    description:
      "Setiap perubahan data tercatat: siapa yang mengubah, apa yang berubah, dan kapan.",
  },
  {
    icon: FileBarChart,
    title: "Dashboard dan laporan",
    description:
      "Lihat ringkasan jumlah penghuni dan ekspor laporan ke PDF atau Excel saat dibutuhkan.",
  },
  {
    icon: ShieldCheck,
    title: "Akses sesuai peran",
    description:
      "Admin, petugas, dan pengasuh hanya melihat dan mengubah data sesuai tugas masing-masing.",
  },
];

const security: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Lock,
    title: "Akses terbatas",
    description: "Data hanya dapat dibuka petugas yang memiliki akun dan peran yang sesuai.",
  },
  {
    icon: ShieldCheck,
    title: "Koneksi terenkripsi",
    description: "Seluruh akses melalui HTTPS agar data tidak terbaca di perjalanan.",
  },
  {
    icon: DatabaseBackup,
    title: "Backup berkala",
    description: "Data dicadangkan secara berkala supaya aman dari kehilangan.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar melayang */}
      <header className="sticky top-3 z-50 px-3">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full border border-border bg-card/80 pl-4 pr-2 shadow-sm backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
              T
            </div>
            <span className="font-semibold tracking-tight">Teduh</span>
          </Link>

          <div className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#fitur" className="transition-colors hover:text-foreground">
              Fitur
            </a>
            <a href="#keamanan" className="transition-colors hover:text-foreground">
              Keamanan
            </a>
          </div>

          <div className="flex items-center gap-1">
            <ThemeToggle compact />
            <Link
              href="/login"
              className={cn(buttonVariants(), "h-10 rounded-full px-5 text-sm font-semibold")}
            >
              Masuk
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="px-3 pt-4 sm:pt-6">
          <div className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-border bg-card">
            <div aria-hidden className="hero-glow absolute inset-0 -z-20" />
            <div
              aria-hidden
              className="hero-art-mask pointer-events-none absolute inset-y-0 right-0 -z-10 w-full opacity-40 lg:w-3/5 lg:opacity-100"
            >
              <HeroArt />
            </div>

            <div className="flex min-h-[460px] max-w-2xl flex-col items-start justify-center p-7 sm:p-12 lg:min-h-[520px]">
              <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-muted-foreground dark:bg-white/10">
                Untuk Panti Jompo Kemah Beth Shalom
              </span>

              <h1 className="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                Data penghuni panti, tertata dengan tenang.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Teduh membantu petugas mencatat data lansia, menyimpan berkas,
                dan menelusuri setiap perubahan, semuanya dalam satu tempat yang
                rapi dan aman.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants(),
                    "h-12 rounded-xl px-6 text-[15px] font-semibold shadow-[0_8px_20px_-8px_var(--primary)]"
                  )}
                >
                  Masuk ke Teduh
                  <ArrowRight className="size-4" />
                </Link>
                <a
                  href="#fitur"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-12 rounded-xl bg-card/60 px-6 text-[15px] font-medium"
                  )}
                >
                  Lihat fitur
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Fitur */}
        <section id="fitur" className="scroll-mt-24 px-4 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-primary">Fitur</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Semua yang dibutuhkan petugas panti
              </h2>
              <p className="mt-3 text-muted-foreground">
                Dari mencatat penghuni baru sampai membuat laporan, tanpa lagi
                bergantung pada berkas fisik yang tersebar.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Keamanan */}
        <section id="keamanan" className="scroll-mt-24 px-3 pb-20 sm:pb-24">
          <div className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-border bg-card p-7 sm:p-12">
            <div aria-hidden className="hero-glow absolute inset-0 -z-10 opacity-60" />

            <div className="max-w-2xl">
              <p className="text-sm font-medium text-primary">Keamanan</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Data pribadi lansia dijaga dengan serius
              </h2>
              <p className="mt-3 text-muted-foreground">
                Teduh dirancang dengan akses terbatas dan pencatatan yang jelas,
                karena data penghuni bersifat rahasia.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {security.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-3xl border border-border bg-card/80 p-6 backdrop-blur"
                >
                  <Icon className="size-6 text-primary" />
                  <h3 className="mt-4 font-semibold tracking-tight">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground">
              T
            </div>
            <span className="font-medium text-foreground">Teduh</span>
          </div>
          <p>
            Capstone Project Kelompok 03, Universitas Budi Luhur ·{" "}
            {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
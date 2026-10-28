import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronDown,
  DatabaseBackup,
  FileText,
  Lock,
  MessageCircle,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { HeroArt } from "@/components/hero-art";
import { StatusBadge } from "@/components/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { supportUrl } from "@/lib/config";
import { cn } from "@/lib/utils";
import type { ResidentStatus } from "@/types/resident";
import { LogoMark } from "@/components/logo";

/* data fiktif */

const previewResidents: {
  name: string;
  initials: string;
  room: string;
  status: ResidentStatus;
  points: string[];
  by: string;
}[] = [
  {
    name: "Sutrisno Hadiwijaya",
    initials: "SH",
    room: "A-01",
    status: "aktif",
    points: ["Masuk 1 Juni 2022", "Wali: Rina Hadiwijaya (Anak)", "5 berkas terunggah"],
    by: "Ratna Dewi",
  },
  {
    name: "Maria Magdalena",
    initials: "MM",
    room: "A-03",
    status: "dirawat",
    points: ["Masuk 15 Februari 2021", "Wali: Daniel Magdalena (Cucu)", "8 berkas terunggah"],
    by: "Maria Lestari",
  },
  {
    name: "Yohanes Pranoto",
    initials: "YP",
    room: "B-02",
    status: "aktif",
    points: ["Masuk 20 September 2023", "Wali: Lestari Pranoto (Istri)", "4 berkas terunggah"],
    by: "Ratna Dewi",
  },
];

const historyRows: {
  icon: LucideIcon;
  tone: string;
  who: string;
  role: string;
  action: string;
  target: string;
  detail: string;
  time: string;
}[] = [
  {
    icon: Pencil,
    tone: "bg-primary/10 text-primary",
    who: "Maria Lestari",
    role: "Pengasuh",
    action: "mengubah data untuk",
    target: "Maria Magdalena",
    detail: "Status: Aktif → Dirawat",
    time: "08.40",
  },
  {
    icon: FileText,
    tone: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    who: "Ratna Dewi",
    role: "Petugas",
    action: "mengunggah berkas untuk",
    target: "Petrus Wijaya",
    detail: "Surat rujukan",
    time: "Kemarin",
  },
  {
    icon: Plus,
    tone: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    who: "Ratna Dewi",
    role: "Petugas",
    action: "menambahkan penghuni",
    target: "Ruth Kristiani",
    detail: "Kamar C-02",
    time: "Kemarin",
  },
];

const roles = [
  {
    name: "Admin",
    description: "Mengelola akun petugas, melihat seluruh data, dan mengekspor laporan.",
  },
  {
    name: "Petugas",
    description: "Menambah dan mengubah data penghuni, serta mengunggah berkas.",
  },
  {
    name: "Pengasuh",
    description: "Melihat data penghuni dan memperbarui status perawatan.",
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

const faqs: { q: string; a: React.ReactNode }[] = [
  {
    q: "Apa itu Teduh?",
    a: "Teduh adalah sistem informasi untuk mencatat dan mengelola data penghuni lansia di Kemah Beth Shalom: identitas, kamar, kontak wali, berkas, dan riwayat perubahan, semuanya di satu tempat.",
  },
  {
    q: "Siapa yang bisa mengakses Teduh?",
    a: "Hanya petugas panti yang memiliki akun. Akun dibuat oleh admin, dan setiap akun punya peran (admin, petugas, atau pengasuh) yang menentukan apa yang boleh dilihat dan diubah.",
  },
  {
    q: "Apakah data penghuni aman?",
    a: "Data hanya bisa dibuka setelah masuk, koneksi memakai HTTPS, data dicadangkan secara berkala, dan setiap perubahan tercatat di riwayat.",
  },
  {
    q: "Bisakah berkas penghuni diunggah?",
    a: "Bisa. Dokumen disimpan per penghuni dan hanya dapat dibuka oleh petugas yang sudah masuk.",
  },
  {
    q: "Bisakah laporan diekspor?",
    a: "Bisa. Data penghuni dapat diekspor sebagai laporan, difilter berdasarkan status.",
  },
  {
    q: "Bagaimana jika saya butuh bantuan?",
    a: (
      <>
        Hubungi kami lewat{" "}
        <a
          href={supportUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary hover:underline"
        >
          WhatsApp
        </a>
        . Kami akan membantu sesegera mungkin.
      </>
    ),
  },
];

/* ---------- Komponen kecil ---------- */

function MockFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[28px] border border-border bg-card p-4 shadow-sm sm:p-5">
      {children}
    </div>
  );
}

function FeatureSection({
  id,
  eyebrow,
  title,
  description,
  reverse,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  reverse?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 px-4 py-14 sm:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className={cn(reverse && "lg:order-2")}>
          <p className="text-sm font-medium text-primary">{eyebrow}</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{description}</p>
        </div>
        <div className={cn(reverse && "lg:order-1")}>{children}</div>
      </div>
    </section>
  );
}

/* main */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-3 z-50 px-3">
        <nav className="mx-auto flex h-12 w-full max-w-2xl items-center justify-between gap-4 rounded-full border border-border bg-card/80 pl-3 pr-1.5 shadow-sm backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-2">
            <LogoMark className="size-7 text-primary" />
            <span className="font-semibold tracking-tight">Teduh</span>
          </Link>

          <div className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
            <a href="#fitur" className="transition-colors hover:text-foreground">
              Fitur
            </a>
            <a href="#keamanan" className="transition-colors hover:text-foreground">
              Keamanan
            </a>
            <a href="#faq" className="transition-colors hover:text-foreground">
              FAQ
            </a>
          </div>

          <div className="flex items-center gap-0.5">
            <Link
              href="/login"
              className={cn(buttonVariants(), "h-9 rounded-full px-4 text-sm font-semibold")}
            >
              Masuk
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="px-4 pt-14 sm:pt-20">
          <div className="mx-auto max-w-6xl">
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Data penghuni panti, tertata dan mudah ditemukan
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Catat identitas, kamar, wali, dan berkas setiap lansia. Cari dalam
              hitungan detik, dan setiap perubahan tercatat siapa yang
              melakukannya.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
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
            <p className="mt-4 text-sm text-muted-foreground">
              Khusus petugas Kemah Beth Shalom. Akun dibuat oleh admin panti.
            </p>
          </div>

          {/* Pratinjau produk */}
          <div className="mx-auto mt-12 max-w-6xl rounded-[32px] border border-border bg-muted/40 p-3 sm:p-4">
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-2.5">
                <LogoMark className="size-7 text-primary" />
                <p className="text-sm font-medium">Penghuni terbaru</p>
              </div>
              <p className="text-xs text-muted-foreground">Contoh tampilan</p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {previewResidents.map((r) => (
                <article
                  key={r.name}
                  className="flex flex-col rounded-3xl border border-border bg-card p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">Kamar {r.room}</p>
                    <StatusBadge status={r.status} />
                  </div>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight">{r.name}</h3>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {r.points.map((p) => (
                      <li key={p} className="flex gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex items-center gap-2.5 border-t border-border pt-4">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {r.initials}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Diperbarui oleh{" "}
                      <span className="font-medium text-foreground">{r.by}</span>
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Pencarian */}
        <FeatureSection
          id="fitur"
          eyebrow="Pencarian"
          title="Temukan penghuni dengan cepat"
          description="Cari lewat nama, nomor kamar, atau nama wali, lalu saring berdasarkan status. Tidak perlu lagi membuka berkas fisik satu per satu."
        >
          <MockFrame>
            <div className="flex items-center gap-3 rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
              <Search className="size-4" />
              Cari nama, kamar, atau wali
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Kamar A-01", "Status dirawat", "Wali: Hadiwijaya", "Masuk 2023"].map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground"
                >
                  {c}
                </span>
              ))}
            </div>
            <div className="mt-4 inline-flex rounded-2xl bg-muted p-1 text-sm">
              <span className="rounded-xl bg-card px-3.5 py-1.5 font-medium shadow-sm">Semua</span>
              {["Aktif", "Dirawat", "Keluar"].map((l) => (
                <span key={l} className="px-3.5 py-1.5 text-foreground/60">
                  {l}
                </span>
              ))}
            </div>
            <div className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border">
              {previewResidents.map((r) => (
                <div key={r.name} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{r.name}</p>
                    <p className="text-xs text-muted-foreground">Kamar {r.room}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              ))}
            </div>
          </MockFrame>
        </FeatureSection>

        {/* Riwayat */}
        <FeatureSection
          reverse
          eyebrow="Riwayat perubahan"
          title="Setiap perubahan tercatat dengan jelas"
          description="Siapa yang mengubah, apa yang berubah, dan kapan. Kalau ada pertanyaan soal data penghuni, jawabannya bisa ditelusuri langsung."
        >
          <MockFrame>
            <div className="flex items-center justify-between px-1 pb-3">
              <p className="text-sm font-medium">Riwayat terbaru</p>
              <p className="text-xs text-muted-foreground">Contoh tampilan</p>
            </div>
            <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border">
              {historyRows.map((h) => {
                const Icon = h.icon;
                return (
                  <li key={h.target} className="flex gap-3 p-4">
                    <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", h.tone)}>
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{h.who}</span>{" "}
                        <span className="text-muted-foreground">
                          ({h.role}) {h.action}
                        </span>{" "}
                        <span className="font-medium">{h.target}</span>
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {h.detail} · {h.time}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </MockFrame>
        </FeatureSection>

        {/* Peran */}
        <FeatureSection
          eyebrow="Akses sesuai peran"
          title="Setiap petugas melihat sesuai tugasnya"
          description="Admin, petugas, dan pengasuh punya hak akses berbeda. Data sensitif hanya bisa diubah oleh yang berwenang."
        >
          <MockFrame>
            <ul className="space-y-3">
              {roles.map((r) => (
                <li key={r.name} className="rounded-2xl border border-border p-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {r.name[0]}
                    </span>
                    <p className="font-medium">{r.name}</p>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.description}</p>
                </li>
              ))}
            </ul>
          </MockFrame>
        </FeatureSection>

        {/* Laporan */}
        <FeatureSection
          reverse
          eyebrow="Dashboard dan laporan"
          title="Ringkasan dan laporan, siap kapan saja"
          description="Lihat jumlah penghuni per status sekilas, lalu ekspor laporan saat dibutuhkan untuk pengurus atau pihak terkait."
        >
          <MockFrame>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Total", value: "8" },
                { label: "Aktif", value: "5" },
                { label: "Dirawat", value: "2" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-border p-4">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="mt-1 text-3xl font-semibold tabular-nums leading-none tracking-tight">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3">
              {[
                { label: "Aktif", pct: 63, bar: "bg-emerald-500" },
                { label: "Dirawat", pct: 25, bar: "bg-amber-500" },
                { label: "Keluar", pct: 12, bar: "bg-zinc-400" },
              ].map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{b.label}</span>
                    <span className="tabular-nums text-muted-foreground">{b.pct}%</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                    <div className={cn("h-full rounded-full", b.bar)} style={{ width: `${b.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </MockFrame>
        </FeatureSection>

        {/* Keamanan */}
        <section id="keamanan" className="scroll-mt-24 px-3 py-10 sm:py-16">
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
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-24 px-4 py-14 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Pertanyaan umum</h2>
            <div className="mt-8 space-y-3">
              {faqs.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-2xl border border-border bg-card px-5 py-4 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium">
                    {f.q}
                    <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Ajakan penutup */}
        <section className="px-3 pb-16 sm:pb-24">
          <div className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-border bg-card">
            <div aria-hidden className="hero-glow absolute inset-0 -z-20" />
            <div
              aria-hidden
              className="hero-art-mask pointer-events-none absolute inset-y-0 right-0 -z-10 w-full opacity-40 lg:w-1/2 lg:opacity-100"
            >
              <HeroArt />
            </div>

            <div className="max-w-xl p-7 sm:p-12">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Mulai dengan data yang tertata
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                Masuk dan lihat sendiri bagaimana Teduh membantu pekerjaan harian
                petugas panti.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants(),
                    "h-11 rounded-xl px-5 text-[15px] font-semibold shadow-[0_8px_20px_-8px_var(--primary)]"
                  )}
                >
                  Masuk ke Teduh
                  <ArrowRight className="size-4" />
                </Link>
                <a
                  href={supportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-11 rounded-xl bg-card/60 px-5 text-[15px] font-medium"
                  )}
                >
                  <MessageCircle className="size-4" />
                  Hubungi via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-12">
        <div className="mx-auto grid max-w-6xl gap-10 text-sm md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <LogoMark className="size-7 text-primary" />
              <span className="font-semibold">Teduh</span>
            </div>
            <p className="mt-3 max-w-xs leading-relaxed text-muted-foreground">
              Sistem informasi data penghuni untuk Panti Jompo Kemah Beth Shalom.
            </p>
          </div>

          <div>
            <p className="font-medium">Produk</p>
            <ul className="mt-3 space-y-2 text-muted-foreground">
              <li>
                <a href="#fitur" className="hover:text-foreground">Fitur</a>
              </li>
              <li>
                <a href="#keamanan" className="hover:text-foreground">Keamanan</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-foreground">Pertanyaan umum</a>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-medium">Bantuan</p>
            <ul className="mt-3 space-y-2 text-muted-foreground">
              <li>
                <a href={supportUrl} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                  WhatsApp
                </a>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground">Masuk</Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-6xl border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
          Teduh. © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
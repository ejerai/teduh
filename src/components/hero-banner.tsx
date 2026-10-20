import Link from "next/link";
import { UserPlus } from "lucide-react";
import { HeroArt } from "@/components/hero-art";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroBanner() {
  return (
    <section className="relative isolate overflow-hidden rounded-[28px] border border-border bg-card">
      <div aria-hidden className="hero-glow absolute inset-0 -z-20" />
      <div
        aria-hidden
        className="hero-art-mask pointer-events-none absolute inset-y-0 right-0 -z-10 w-full opacity-40 @2xl:w-3/5 @2xl:opacity-100"
      >
        <HeroArt />
      </div>

      <div className="flex min-h-[300px] max-w-lg flex-col items-start justify-center p-6 @2xl:p-9">
        <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-muted-foreground dark:bg-white/10">
          Beranda petugas
        </span>

        <h2 className="mt-4 text-2xl font-medium tracking-tight @2xl:text-[28px]">
          Selamat datang di Teduh
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
          Teduh membantu petugas mencatat data penghuni lansia, menyimpan
          berkas, dan menelusuri riwayat perubahan, semuanya dalam satu tempat
          yang rapi dan aman.
        </p>

        <Link
          href="/residents/new"
          className={cn(
            buttonVariants(),
            "mt-6 h-11 rounded-xl px-5 text-[15px] font-semibold shadow-[0_8px_20px_-8px_var(--primary)]"
          )}
        >
          <UserPlus className="size-4" />
          Tambah penghuni
        </Link>

        <p className="mt-4 max-w-sm text-xs leading-relaxed text-muted-foreground/80">
          Data penghuni bersifat rahasia dan hanya dapat diakses petugas yang
          berwenang. Setiap perubahan tercatat di riwayat.
        </p>
      </div>
    </section>
  );
}
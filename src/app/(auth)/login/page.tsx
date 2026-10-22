import { HeroArt } from "@/components/hero-art";
import { LoginForm } from "@/components/login-form";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-2">
      {/* Kolom form */}
      <div className="relative flex items-center justify-center p-6 sm:p-10">
        <div className="absolute right-4 top-4">
          <ThemeToggle compact />
        </div>

        <div className="w-full max-w-sm">

          <h1 className="mt-10 text-3xl font-semibold tracking-tight">Masuk</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Selamat datang, Panti Jompo & Panti Asuhan Kemah Beth Shalom.
          </p>

          <LoginForm />

          <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
            Lupa kata sandi? Hubungi admin panti. <a className="text-primary" href="https://teduh-nine.vercel.app/dashboard">Lihat dashboard.</a>
          </p>
        </div>
      </div>

      {/* Panel ilustrasi, hanya di layar lebar */}
      <aside className="relative m-3 hidden overflow-hidden rounded-[28px] border border-border bg-card lg:block">
        <div aria-hidden className="hero-glow absolute inset-0" />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] [mask-image:linear-gradient(to_bottom,transparent,#000_35%)]"
        >
          <HeroArt />
        </div>

        <div className="relative max-w-md p-10">
          <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-muted-foreground dark:bg-white/10">
            Sistem informasi penghuni
          </span>
          <h2 className="mt-5 text-3xl font-medium tracking-tight">
            Data penghuni, tertata dan aman.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Catat data lansia, simpan berkas, dan telusuri setiap perubahan
            dalam satu tempat yang rapi.
          </p>
        </div>
      </aside>
    </main>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  Check,
  CheckCircle2,
  Minus,
  Monitor,
  Moon,
  Palette,
  ShieldCheck,
  Sun,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useThemeSwitch } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import type { StaffRole } from "@/types/history";

// Sementara tetap. Setelah login sungguhan dibuat, data ini diambil dari sesi pengguna.
const currentUser = {
  name: "Andre Pratama",
  email: "andre@teduh.test",
  role: "admin" as StaffRole,
};

const roleLabel: Record<StaffRole, string> = {
  admin: "Admin",
  petugas: "Petugas",
  pengasuh: "Pengasuh",
};

const fieldClass = "h-11 rounded-2xl bg-muted/60 shadow-none";
const selectClass =
  "h-10 rounded-xl border border-input bg-muted/60 px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50";

type TabId = "akun" | "tampilan" | "petugas" | "keamanan";

const tabs: { id: TabId; label: string; icon: LucideIcon; adminOnly?: boolean }[] = [
  { id: "akun", label: "Akun saya", icon: User },
  { id: "tampilan", label: "Tampilan", icon: Palette },
  { id: "petugas", label: "Petugas & peran", icon: Users, adminOnly: true },
  { id: "keamanan", label: "Keamanan & data", icon: ShieldCheck },
];

function Block({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Notice({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <p
      role="status"
      className={cn(
        "flex items-start gap-2 rounded-2xl px-4 py-3 text-sm",
        ok
          ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300"
          : "bg-red-50 text-red-800 dark:bg-red-500/10 dark:text-red-300"
      )}
    >
      {ok && <CheckCircle2 className="mt-0.5 size-4 shrink-0" />}
      <span>{children}</span>
    </p>
  );
}

function Switch({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-10 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-primary" : "bg-muted-foreground/30"
      )}
    >
      <span
        className={cn(
          "absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition-transform",
          checked && "translate-x-4"
        )}
      />
    </button>
  );
}

/* ---------- Tab: Akun saya ---------- */

function AccountTab() {
  const [name, setName] = useState(currentUser.name);
  const [profileSaved, setProfileSaved] = useState(false);
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwMessage, setPwMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileSaved(true);
  }

  function savePassword(e: React.FormEvent) {
    e.preventDefault();
    if (pw.next.length < 8) {
      setPwMessage({ ok: false, text: "Kata sandi baru minimal 8 karakter." });
      return;
    }
    if (pw.next !== pw.confirm) {
      setPwMessage({ ok: false, text: "Konfirmasi kata sandi tidak sama." });
      return;
    }
    setPwMessage({
      ok: true,
      text: "Form valid. Kata sandi benar-benar diperbarui setelah backend terhubung.",
    });
    setPw({ current: "", next: "", confirm: "" });
  }

  return (
    <div className="space-y-8">
      <Block title="Profil" description="Informasi akun yang kamu pakai untuk masuk.">
        <form onSubmit={saveProfile} className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
              {initials}
            </div>
            <div>
              <p className="font-medium">{name || "Tanpa nama"}</p>
              <span className="mt-1 inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {roleLabel[currentUser.role]}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="set-name">Nama</Label>
            <Input
              id="set-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setProfileSaved(false);
              }}
              className={fieldClass}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="set-email">Email</Label>
            <Input id="set-email" value={currentUser.email} disabled className={fieldClass} />
            <p className="text-xs text-muted-foreground">
              Email dipakai untuk masuk dan hanya bisa diubah oleh admin.
            </p>
          </div>

          {profileSaved && (
            <Notice ok>
              Perubahan profil tersimpan sementara. Penyimpanan permanen aktif setelah
              backend terhubung.
            </Notice>
          )}
          <Button type="submit" className="h-10 rounded-xl px-5">
            Simpan profil
          </Button>
        </form>
      </Block>

      <Block title="Ganti kata sandi" description="Gunakan minimal 8 karakter.">
        <form onSubmit={savePassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pw-current">Kata sandi saat ini</Label>
            <Input
              id="pw-current"
              type="password"
              autoComplete="current-password"
              required
              value={pw.current}
              onChange={(e) => setPw({ ...pw, current: e.target.value })}
              className={fieldClass}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pw-new">Kata sandi baru</Label>
              <Input
                id="pw-new"
                type="password"
                autoComplete="new-password"
                required
                value={pw.next}
                onChange={(e) => setPw({ ...pw, next: e.target.value })}
                className={fieldClass}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pw-confirm">Ulangi kata sandi baru</Label>
              <Input
                id="pw-confirm"
                type="password"
                autoComplete="new-password"
                required
                value={pw.confirm}
                onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
                className={fieldClass}
              />
            </div>
          </div>
          {pwMessage && <Notice ok={pwMessage.ok}>{pwMessage.text}</Notice>}
          <Button type="submit" variant="outline" className="h-10 rounded-xl px-5">
            Perbarui kata sandi
          </Button>
        </form>
      </Block>
    </div>
  );
}

/* ---------- Tab: Tampilan ---------- */

const themeOptions = [
  { value: "light", label: "Terang", icon: Sun },
  { value: "dark", label: "Gelap", icon: Moon },
  { value: "system", label: "Sistem", icon: Monitor },
] as const;

function AppearanceTab() {
  const { theme, setTheme } = useTheme();
  const switchTheme = useThemeSwitch();

  function choose(mode: "light" | "dark" | "system", el: HTMLElement) {
    if (mode === "system") setTheme("system");
    else switchTheme(mode, el);
  }

  return (
    <Block
      title="Tema"
      description="Pilih tampilan yang nyaman untuk mata. Pilihan Sistem mengikuti pengaturan perangkat."
    >
      <div className="grid grid-cols-3 gap-3">
        {themeOptions.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={(e) => choose(value, e.currentTarget)}
            aria-pressed={theme === value}
            className={cn(
              "flex flex-col items-center gap-2 rounded-2xl border p-4 text-sm font-medium transition-all active:scale-[0.98]",
              theme === value
                ? "border-primary bg-primary/5 text-primary"
                : "border-border text-muted-foreground hover:bg-muted"
            )}
          >
            <Icon className="size-5" />
            {label}
          </button>
        ))}
      </div>
    </Block>
  );
}

/* ---------- Tab: Petugas & peran (admin) ---------- */

interface Staff {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  active: boolean;
}

const initialStaff: Staff[] = [
  { id: "s-1", name: "Andre Pratama", email: "andre@teduh.test", role: "admin", active: true },
  { id: "s-2", name: "Ratna Dewi", email: "ratna@teduh.test", role: "petugas", active: true },
  { id: "s-3", name: "Maria Lestari", email: "maria@teduh.test", role: "pengasuh", active: true },
];

const permissions: { label: string; access: [boolean, boolean, boolean] }[] = [
  { label: "Melihat data penghuni", access: [true, true, true] },
  { label: "Menambah dan mengubah penghuni", access: [true, true, false] },
  { label: "Memperbarui status perawatan", access: [true, true, true] },
  { label: "Mengunggah berkas", access: [true, true, false] },
  { label: "Melihat riwayat perubahan", access: [true, true, true] },
  { label: "Mengekspor laporan", access: [true, true, false] },
  { label: "Mengelola akun petugas", access: [true, false, false] },
];

function StaffTab() {
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: "", email: "", role: "petugas" as StaffRole });

  function update(id: string, patch: Partial<Staff>) {
    setStaff((list) => list.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function add(e: React.FormEvent) {
    e.preventDefault();
    setStaff((list) => [
      ...list,
      { id: `s-${Date.now()}`, name: draft.name, email: draft.email, role: draft.role, active: true },
    ]);
    setDraft({ name: "", email: "", role: "petugas" });
    setAdding(false);
  }

  return (
    <div className="space-y-8">
      <Block
        title="Akun petugas"
        description="Atur siapa yang boleh masuk dan apa peran mereka. Akun yang dinonaktifkan tidak bisa masuk."
      >
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border">
          {staff.map((s) => {
            const isSelf = s.email === currentUser.email;
            return (
              <li key={s.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {s.name}
                    {isSelf && <span className="text-muted-foreground"> (kamu)</span>}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{s.email}</p>
                </div>
                <select
                  aria-label={`Peran ${s.name}`}
                  value={s.role}
                  disabled={isSelf}
                  onChange={(e) => update(s.id, { role: e.target.value as StaffRole })}
                  className={selectClass}
                >
                  {(Object.keys(roleLabel) as StaffRole[]).map((r) => (
                    <option key={r} value={r}>
                      {roleLabel[r]}
                    </option>
                  ))}
                </select>
                <Switch
                  label={`Aktifkan akun ${s.name}`}
                  checked={s.active}
                  disabled={isSelf}
                  onChange={(v) => update(s.id, { active: v })}
                />
              </li>
            );
          })}
        </ul>

        {adding ? (
          <form onSubmit={add} className="mt-4 space-y-3 rounded-2xl border border-border p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="new-name">Nama</Label>
                <Input
                  id="new-name"
                  required
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  className={fieldClass}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-email">Email</Label>
                <Input
                  id="new-email"
                  type="email"
                  required
                  value={draft.email}
                  onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                  className={fieldClass}
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select
                aria-label="Peran petugas baru"
                value={draft.role}
                onChange={(e) => setDraft({ ...draft, role: e.target.value as StaffRole })}
                className={selectClass}
              >
                {(Object.keys(roleLabel) as StaffRole[]).map((r) => (
                  <option key={r} value={r}>
                    {roleLabel[r]}
                  </option>
                ))}
              </select>
              <div className="ml-auto flex gap-2">
                <Button type="button" variant="outline" className="h-10 rounded-xl" onClick={() => setAdding(false)}>
                  Batal
                </Button>
                <Button type="submit" className="h-10 rounded-xl">
                  Tambah
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="mt-4 h-10 rounded-xl px-4"
            onClick={() => setAdding(true)}
          >
            Tambah petugas
          </Button>
        )}
      </Block>

      <Block title="Hak akses per peran" description="Ringkasan apa yang bisa dilakukan tiap peran.">
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[420px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-4 py-3 font-medium">Kemampuan</th>
                <th className="px-3 py-3 text-center font-medium">Admin</th>
                <th className="px-3 py-3 text-center font-medium">Petugas</th>
                <th className="px-3 py-3 text-center font-medium">Pengasuh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {permissions.map((p) => (
                <tr key={p.label}>
                  <td className="px-4 py-2.5">{p.label}</td>
                  {p.access.map((ok, i) => (
                    <td key={i} className="px-3 py-2.5">
                      <span className="flex justify-center">
                        {ok ? (
                          <Check className="size-4 text-primary" />
                        ) : (
                          <Minus className="size-4 text-muted-foreground/50" />
                        )}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Block>
    </div>
  );
}

/* ---------- Tab: Keamanan & data ---------- */

function SecurityTab({ onNavigate }: { onNavigate: () => void }) {
  const [timeout, setTimeoutMinutes] = useState("30");
  const [signedOut, setSignedOut] = useState(false);

  return (
    <div className="space-y-8">
      <Block
        title="Batas waktu sesi"
        description="Setelah tidak aktif selama waktu ini, kamu otomatis keluar. Berguna kalau perangkat dipakai bergantian."
      >
        <select
          aria-label="Batas waktu sesi"
          value={timeout}
          onChange={(e) => setTimeoutMinutes(e.target.value)}
          className={cn(selectClass, "w-full sm:w-56")}
        >
          <option value="15">15 menit</option>
          <option value="30">30 menit</option>
          <option value="60">60 menit</option>
        </select>
      </Block>

      <Block
        title="Perangkat yang masuk"
        description="Keluar dari semua perangkat jika kamu lupa logout di komputer lain."
      >
        {signedOut && (
          <div className="mb-3">
            <Notice ok>Permintaan diterima. Fitur ini aktif setelah backend terhubung.</Notice>
          </div>
        )}
        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-xl px-4"
          onClick={() => setSignedOut(true)}
        >
          Keluar dari semua perangkat
        </Button>
      </Block>

      <Block
        title="Cadangan data"
        description="Data dicadangkan secara berkala. Kamu juga bisa membuat cadangan manual sebelum perubahan besar."
      >
        <Button type="button" variant="outline" disabled className="h-10 rounded-xl px-4">
          Cadangkan sekarang
        </Button>
        <p className="mt-2 text-xs text-muted-foreground">
          Tersedia setelah backend terhubung.
        </p>
      </Block>

      <Block title="Log aktivitas" description="Lihat siapa mengubah apa, dan kapan.">
        <Link
          href="/history"
          onClick={onNavigate}
          className="text-sm font-medium text-primary hover:underline"
        >
          Buka riwayat perubahan →
        </Link>
      </Block>
    </div>
  );
}

/* ---------- Dialog ---------- */

export function SettingsDialog({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<TabId>("akun");

  const visibleTabs = tabs.filter((t) => !t.adminOnly || currentUser.role === "admin");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="gap-0 overflow-hidden rounded-3xl p-0 sm:max-w-3xl">
        <DialogHeader className="border-b border-border px-6 py-4 text-left">
          <DialogTitle className="text-lg font-semibold tracking-tight">Pengaturan</DialogTitle>
          <DialogDescription>Kelola akun, tampilan, dan keamanan Teduh.</DialogDescription>
        </DialogHeader>

        <div className="grid h-[min(560px,75vh)] grid-rows-[auto_minmax(0,1fr)] md:grid-cols-[210px_minmax(0,1fr)] md:grid-rows-1">
          <nav className="flex gap-1 overflow-x-auto border-b border-border p-3 md:flex-col md:border-b-0 md:border-r">
            {visibleTabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  tab === id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </nav>

          <div className="min-h-0 overflow-y-auto p-5 md:p-6">
            {tab === "akun" && <AccountTab />}
            {tab === "tampilan" && <AppearanceTab />}
            {tab === "petugas" && <StaffTab />}
            {tab === "keamanan" && <SecurityTab onNavigate={() => setOpen(false)} />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
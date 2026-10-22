"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  History,
  FileBarChart,
  Headset,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { SettingsDialog } from "@/components/settings-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { supportUrl } from "@/lib/config";
import { cn } from "@/lib/utils";

export const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/residents", label: "Penghuni", icon: Users },
  { href: "/history", label: "Riwayat", icon: History },
  { href: "/reports", label: "Laporan", icon: FileBarChart },
];

export function navItemClass(active: boolean) {
  return cn(
    "flex w-full items-center gap-3 whitespace-nowrap rounded-2xl px-3.5 py-3 text-left text-sm font-medium transition-all",
    active
      ? "bg-primary text-primary-foreground shadow-sm"
      : "text-muted-foreground hover:bg-muted hover:text-foreground"
  );
}

function SidebarToggleIcon({
  open,
  className,
}: {
  open: boolean;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="4.5" width="18" height="15" rx="4" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9.5 4.5v15" stroke="currentColor" strokeWidth="1.7" />
      <rect
        x="4.6"
        y="6.1"
        width="3.6"
        height="11.8"
        rx="1.9"
        fill="currentColor"
        className={cn("transition-opacity duration-200", open ? "opacity-100" : "opacity-0")}
      />
    </svg>
  );
}

function Label({ children, expanded }: { children: React.ReactNode; expanded: boolean }) {
  return (
    <span className={cn("transition-opacity duration-200", expanded ? "opacity-100" : "opacity-0")}>
      {children}
    </span>
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  expanded,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  expanded: boolean;
}) {
  return (
    <Link href={href} className={navItemClass(active)}>
      <Icon className="size-5 shrink-0" />
      <Label expanded={expanded}>{label}</Label>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [pinned, setPinned] = useState(true);
  const [hovered, setHovered] = useState(false);

  const expanded = pinned || hovered;
  const floating = !pinned && hovered;

  function toggle() {
    setPinned((p) => !p);
    setHovered(false);
  }

  return (
    // layout service
    <div
      className={cn(
        "relative hidden shrink-0 transition-[width] duration-300 ease-out md:block",
        pinned ? "w-[280px]" : "w-24"
      )}
    >
      <aside
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "fixed bottom-3 left-3 top-3 z-40 flex flex-col overflow-hidden rounded-[28px] border border-border bg-card/90 p-3 backdrop-blur-xl transition-[width,box-shadow] duration-300 ease-out",
          expanded ? "w-64" : "w-[72px]",
          floating ? "shadow-2xl" : "shadow-sm"
        )}
      >
        {/* Header: logo + tombol buka/tutup */}
        <div className="flex h-14 items-center justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="mx-1 flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-lg font-semibold text-primary-foreground">
              T
            </div>
            <div
              className={cn(
                "min-w-0 whitespace-nowrap transition-opacity duration-200",
                expanded ? "opacity-100" : "opacity-0"
              )}
            >
              <p className="text-lg font-semibold leading-tight tracking-tight">Teduh</p>
              <p className="text-xs text-muted-foreground">Kemah Beth Shalom</p>
            </div>
          </div>

          <button
            onClick={toggle}
            aria-label={pinned ? "Tutup sidebar" : "Kunci sidebar terbuka"}
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95",
              expanded ? "opacity-100" : "pointer-events-none opacity-0"
            )}
          >
            <SidebarToggleIcon open={pinned} className="size-[22px]" />
          </button>
        </div>

        {/* Menu utama */}
        <nav className="mt-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              {...item}
              active={pathname.startsWith(item.href)}
              expanded={expanded}
            />
          ))}
        </nav>

        {/* Bagian bawah */}
        <div className="mt-auto flex flex-col gap-1">
          <a
            href={supportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={navItemClass(false)}
          >
            <Headset className="size-5 shrink-0" />
            <Label expanded={expanded}>Bantuan</Label>
          </a>

          <SettingsDialog
            trigger={
              <button type="button" className={navItemClass(false)}>
                <Settings className="size-5 shrink-0" />
                <Label expanded={expanded}>Pengaturan</Label>
              </button>
            }
          />

          <div className="mt-2 px-1 pb-1">
            <ThemeToggle compact={!expanded} />
          </div>
        </div>
      </aside>
    </div>
  );
}
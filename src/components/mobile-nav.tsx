"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { navItems } from "@/components/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl">
        <button
          onClick={() => setOpen(true)}
          aria-label="Buka menu"
          className="flex size-9 items-center justify-center rounded-xl transition-all hover:bg-muted active:scale-95"
        >
          <Menu className="size-5" />
        </button>
        <span className="font-semibold tracking-tight">Teduh</span>
      </header>

      <div
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-72 flex-col bg-card p-4 shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-lg font-semibold text-primary-foreground">
              T
            </div>
            <div>
              <p className="text-lg font-semibold leading-tight tracking-tight">Teduh</p>
              <p className="text-xs text-muted-foreground">Kemah Beth Shalom</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Tutup menu"
            className="flex size-9 items-center justify-center rounded-xl transition-all hover:bg-muted active:scale-95"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="mt-4 flex flex-col gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-5 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-4">
          <ThemeToggle />
        </div>
      </aside>
    </div>
  );
}
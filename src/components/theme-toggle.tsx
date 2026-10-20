"use client";

import { flushSync } from "react-dom";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const DURATION = 2050; // ms, lama lingkaran melebar
const EASING = "cubic-bezier(0.32, 0.72, 0, 1)";
const BLUR = 45; // px, tingkat blur awal halaman baru

type Mode = "light" | "dark";
type ViewTransitionLike = {
  ready: Promise<unknown>;
  finished: Promise<unknown>;
};
type DocWithViewTransition = Document & {
  startViewTransition?: (callback: () => void) => ViewTransitionLike;
};

function useThemeSwitch() {
  const { setTheme } = useTheme();

  return (next: Mode, origin: HTMLElement) => {
    const root = document.documentElement;
    const currentlyDark = root.classList.contains("dark");

    if ((next === "dark") === currentlyDark) {
      setTheme(next);
      return;
    }

    const doc = document as DocWithViewTransition;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    root.dataset.themeSwitching = "";
    const finish = () => {
      delete root.dataset.themeSwitching;
    };

    if (reduceMotion || typeof doc.startViewTransition !== "function") {
      setTheme(next);
      window.setTimeout(finish, 450);
      return;
    }

    const rect = origin.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = doc.startViewTransition(() => {
      root.classList.toggle("dark", next === "dark");
      flushSync(() => setTheme(next));
    });

    transition.ready.then(() => {
      const options: KeyframeAnimationOptions = {
        duration: DURATION,
        easing: EASING,
        fill: "both",
      };

      root.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
          filter: [`blur(${BLUR}px)`, "blur(0px)"],
        },
        { ...options, pseudoElement: "::view-transition-new(root)" }
      );

      root.animate(
        { filter: ["blur(0px)", "blur(4px)"] },
        { ...options, pseudoElement: "::view-transition-old(root)" }
      );
    });

    transition.finished.finally(finish);
  };
}

export function ThemeToggle({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const switchTheme = useThemeSwitch();

  // sidebar close
  if (compact) {
    return (
      <button
        type="button"
        onClick={(e) =>
          switchTheme(
            document.documentElement.classList.contains("dark")
              ? "light"
              : "dark",
            e.currentTarget
          )
        }
        aria-label="Ganti tema"
        className={cn(
          "relative flex size-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95",
          className
        )}
      >
        <span className="relative size-5">
          <Sun className="theme-anim absolute inset-0 size-5 rotate-0 scale-100 transition-transform duration-500 dark:-rotate-90 dark:scale-0" />
          <Moon className="theme-anim absolute inset-0 size-5 rotate-90 scale-0 transition-transform duration-500 dark:rotate-0 dark:scale-100" />
        </span>
      </button>
    );
  }

  // sidebar open
  return (
    <div
      role="group"
      aria-label="Tema"
      className={cn("relative inline-flex items-center rounded-full bg-muted p-1", className)}
    >
      <span
        aria-hidden
        className="theme-anim pointer-events-none absolute left-1 top-1 size-8 rounded-full bg-card shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] dark:translate-x-8"
      />

      <button
        type="button"
        onClick={(e) => switchTheme("light", e.currentTarget)}
        aria-label="Mode terang"
        className="relative z-10 flex size-8 items-center justify-center rounded-full text-foreground transition-colors dark:text-muted-foreground"
      >
        <Sun className="size-4" />
      </button>

      <button
        type="button"
        onClick={(e) => switchTheme("dark", e.currentTarget)}
        aria-label="Mode gelap"
        className="relative z-10 flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors dark:text-foreground"
      >
        <Moon className="size-4" />
      </button>
    </div>
  );
}
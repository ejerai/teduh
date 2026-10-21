"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Sementara langsung masuk ke dashboard. Verifikasi akun dikerjakan di tahap backend.
    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="username"
          required
          placeholder="nama@email.com"
          className="h-11 rounded-2xl bg-muted/60 shadow-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          Kata sandi
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="Masukkan kata sandi"
            className="h-11 rounded-2xl bg-muted/60 pr-11 shadow-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            className="absolute right-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        className="h-11 w-full rounded-xl text-[15px] font-semibold shadow-[0_8px_20px_-8px_var(--primary)]"
      >
        Masuk
      </Button>
    </form>
  );
}
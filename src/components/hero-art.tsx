"use client";

import { useEffect, useRef } from "react";

const SPEED = 1; // 0.5 = lebih lambat, 2 = lebih cepat
const S = 1.25;
const W = 120;
const H = 70;
const CELL = 4;
const DOT = 2.6;
const TAU = Math.PI * 2;

const BAYER = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
];

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

const hash = (x: number, y: number, seed = 0) =>
  ((((((x + seed * 31) * 73856093) ^ ((y + seed * 17) * 19349663)) >>> 0) %
    1000) /
    1000);

const inRect = (
  x: number,
  y: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number
) => x >= x0 && x <= x1 && y >= y0 && y <= y1;

const groundY = (x: number) =>
  45 + 1.6 * Math.sin(x * 0.17) + 0.8 * Math.sin(x * 0.41);

function houseDensity(x: number, y: number) {
  const apexX = 62;
  const apexY = 9;
  const eaveY = 23;
  const half = 17;
  let d = 0;

  if (y >= apexY && y <= eaveY) {
    const hw = ((y - apexY) / (eaveY - apexY)) * half;
    if (Math.abs(x - apexX) <= hw) d = 1;
  }
  if (inRect(x, y, 49, eaveY + 1, 75, 46)) d = 0.97;
  if (inRect(x, y, 71, 11, 74, 19) && d === 0) d = 0.9; // cerobong
  if (d === 0) return 0;

  if (inRect(x, y, 59, 35, 65, 46)) d = 0.1; // pintu
  if (inRect(x, y, 52, 28, 56, 32) || inRect(x, y, 68, 28, 72, 32)) d = 0.1; // jendela

  return d * (1 - 0.4 * smooth(50, 80, x));
}

function sunDensity(x: number, y: number, r: number) {
  const dist = Math.hypot(x - 86, y - 12);
  if (dist > r) return 0;
  return 0.95 * (1 - Math.pow(dist / r, 2)) + 0.05;
}

function groundDensity(x: number, y: number) {
  const g = groundY(x);
  if (y < g) return 0;
  return smooth(30, 58, x) * (0.9 - 0.65 * ((y - g) / (H - g)));
}

function scatterDensity(x: number, y: number) {
  return 0.05 * smooth(26, 66, x) * (1 - 0.25 * (y / H));
}

function buildFrame(time: number) {
  const gray = new Path2D();
  const blue = new Path2D();
  const sunR = 8 + 0.9 * Math.sin(time * 1.1);
  const bandPos = ((time * 0.14) % 1.5) * (W + 40) - 30;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const bx = x / S;
      const by = y / S;
      const h = hash(x, y);
      const t =
        BAYER[y % 8][x % 8] / 64 +
        1 / 128 +
        0.16 * Math.sin(time * 1.5 + h * TAU);

      const d = x + y * 0.5 - bandPos;
      const wave = Math.exp(-(d * d) / (2 * 16 * 16));

      const house = Math.max(houseDensity(bx, by), sunDensity(bx, by, sunR));
      if (house > 0 && house + 0.3 * wave > t) {
        gray.rect(x * CELL, y * CELL, DOT, DOT);
        continue;
      }

      let g = groundDensity(bx, by);
      if (g > 0) {
        g += 0.12 * Math.sin(x * 0.35 - time * 1.4 + y * 0.2) + 0.25 * wave;
        if (g > t) {
          blue.rect(x * CELL, y * CELL, DOT, DOT);
          continue;
        }
      }

      const blink = Math.sin(time * 0.9 + hash(x, y, 7) * TAU);
      if (h < scatterDensity(bx, by) * (1 + 5 * wave) && blink > -0.25) {
        (by > 56 * 0.55 ? blue : gray).rect(x * CELL, y * CELL, DOT, DOT);
      }
    }
  }
  return { gray, blue };
}

export function HeroArt() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let last = 0;
    let visible = true;
    let currentTime = 0.5;
    let grayColor = "#8793aa";
    let blueColor = "#1a6bff";

    const readColors = () => {
      const root = document.documentElement;
      grayColor = root.classList.contains("dark") ? "#66728c" : "#8793aa";
      blueColor =
        getComputedStyle(root).getPropertyValue("--primary").trim() || "#1a6bff";
    };

    const paint = (time: number) => {
      currentTime = time;
      const scale = Math.max(width / (W * CELL), height / (H * CELL));
      const ox = width - W * CELL * scale;
      const oy = height - H * CELL * scale;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * ox, dpr * oy);

      const { gray, blue } = buildFrame(time);
      ctx.fillStyle = grayColor;
      ctx.fill(gray);
      ctx.fillStyle = blueColor;
      ctx.fill(blue);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      paint(currentTime);
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible || document.hidden) return;
      if (now - last < 33) return; // sekitar 30 fps
      last = now;
      paint((now / 1000) * SPEED);
    };

    readColors();
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    // Warna ikut berubah saat tema diganti
    const themeObserver = new MutationObserver(() => {
      readColors();
      paint(currentTime);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Berhenti menggambar saat tidak terlihat
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    visibilityObserver.observe(canvas);

    if (!reduceMotion) raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />;
}
import { cn } from "@/lib/utils";
//main logo web
const OUTLINE_PATH =
  "M8.6 32.0 L13.8 32.0 L13.8 26.8 L19.0 26.8 L19.0 21.6 L24.2 21.6 L24.2 16.4 L29.4 16.4 L29.4 11.2 L34.6 11.2 L34.6 16.4 L39.8 16.4 L39.8 21.6 L45.0 21.6 L45.0 26.8 L50.2 26.8 L50.2 32.0 L55.4 32.0 L55.4 37.2 L50.2 37.2 L50.2 52.8 L39.8 52.8 L39.8 42.4 L24.2 42.4 L24.2 52.8 L13.8 52.8 L13.8 37.2 L8.6 37.2 Z";

const ROWS = [
  "....X....",
  "...XXX...",
  "..XXXXX..",
  ".XXXXXXX.",
  "XXXXXXXXX",
  ".XXXXXXX.",
  ".XX...XX.",
  ".XX...XX.",
];

const CELL = 5.2;
const cells = ROWS.flatMap((row, r) =>
  [...row].flatMap((ch, c) =>
    ch === "X" ? [{ x: 9 + c * CELL, y: 11.6 + r * CELL }] : []
  )
);

export function LogoMark({
  variant = "outline",
  className,
}: {
  variant?: "outline" | "solid";
  className?: string;
}) {
  return (
    <svg
      viewBox="6 6 52 52"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      {variant === "outline" ? (
        <path
          d={OUTLINE_PATH}
          stroke="currentColor"
          strokeWidth={3.2}
          strokeLinejoin="round"
        />
      ) : (
        <g fill="currentColor">
          {cells.map(({ x, y }) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="4.4" height="4.4" rx="0.6" />
          ))}
        </g>
      )}
    </svg>
  );
}
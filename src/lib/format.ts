export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

export function formatMonthYear(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

/** Tanggal masuk. Jika hanya perkiraan, tampil sebagai "± Oktober 2020". */
export function formatAdmission(iso: string | null, approx: boolean) {
  if (!iso) return "Belum dicatat";
  return approx ? `± ${formatMonthYear(iso)}` : formatDate(iso);
}

export function getAge(birthDate: string) {
  const birth = new Date(birthDate);
  const now = new Date();
  let age = now.getUTCFullYear() - birth.getUTCFullYear();
  const m = now.getUTCMonth() - birth.getUTCMonth();
  if (m < 0 || (m === 0 && now.getUTCDate() < birth.getUTCDate())) age--;
  return age;
}

/** Lama tinggal, contoh: "6 tahun", "1 tahun 6 bulan", "10 bulan". */
export function getStay(admissionDate: string | null) {
  if (!admissionDate) return "-";
  const a = new Date(admissionDate);
  const now = new Date();
  let months =
    (now.getUTCFullYear() - a.getUTCFullYear()) * 12 +
    (now.getUTCMonth() - a.getUTCMonth());
  if (now.getUTCDate() < a.getUTCDate()) months--;
  if (months < 1) return "< 1 bulan";
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m} bulan`;
  if (m === 0) return `${y} tahun`;
  return `${y} tahun ${m} bulan`;
}

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }).format(new Date(iso));
}

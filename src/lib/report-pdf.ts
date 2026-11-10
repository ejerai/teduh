import { formatAdmission, getAge, getStay } from "@/lib/format";
import { genderLabel, mobilityLabel } from "@/lib/labels";
import type { Resident } from "@/types/resident";

const BRAND: [number, number, number] = [47, 107, 245];

const shortDate = (iso: string) => iso.split("-").reverse().join("/");

export async function buildResidentsPdf(rows: Resident[], filterLabel: string) {
  const [{ jsPDF }, { autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;

  const printedAt = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date());

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Laporan Penghuni", margin, 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(90);
  doc.text("Panti Jompo Kemah Beth Shalom", margin, 20);
  doc.text(
    `Dicetak ${printedAt}  |  Filter: ${filterLabel}  |  ${rows.length} penghuni`,
    margin,
    25.5,
  );

  autoTable(doc, {
    startY: 30,
    margin: { left: margin, right: margin, bottom: 14 },
    head: [
      [
        "No",
        "Nama",
        "Jenis kelamin",
        "Tgl lahir",
        "Umur",
        "Baju",
        "Tgl masuk",
        "Lama tinggal",
        "Alat bantu",
        "Rujukan",
        "Catatan kesehatan",
        "Status",
      ],
    ],
    body: rows.map((r, i) => [
      i + 1,
      r.nickname ? `${r.fullName} (${r.nickname})` : r.fullName,
      genderLabel[r.gender],
      shortDate(r.birthDate),
      getAge(r.birthDate),
      r.clothingSize ?? "-",
      formatAdmission(r.admissionDate, r.admissionApprox),
      getStay(r.admissionDate),
      r.mobility ? mobilityLabel[r.mobility] : "-",
      r.referral ?? "-",
      r.healthNotes ?? "-",
      r.status === "aktif" ? "Aktif" : "Keluar",
    ]),
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 8,
      cellPadding: 1.8,
      lineColor: [225, 228, 235],
      lineWidth: 0.2,
      textColor: 30,
      valign: "middle",
    },
    headStyles: { fillColor: BRAND, textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [247, 248, 251] },
    columnStyles: {
      0: { cellWidth: 8, halign: "center" },
      1: { cellWidth: 42 },
      2: { cellWidth: 20 },
      3: { cellWidth: 20 },
      4: { cellWidth: 11, halign: "center" },
      5: { cellWidth: 11, halign: "center" },
      6: { cellWidth: 26 },
      7: { cellWidth: 24 },
      8: { cellWidth: 20 },
      9: { cellWidth: 30 },
      10: { cellWidth: "auto" },
      11: { cellWidth: 14, halign: "center" },
    },
  });

  // Nomor halaman di setiap halaman
  const pages = doc.getNumberOfPages();
  doc.setFontSize(8);
  doc.setTextColor(120);
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.text(`Halaman ${p} dari ${pages}`, pageWidth - margin, pageHeight - 6, {
      align: "right",
    });
    doc.text("Teduh - Kemah Beth Shalom", margin, pageHeight - 6);
  }

  return doc;
}

/** Membuat PDF lalu mengunduhnya di browser. */
export async function downloadResidentsPdf(rows: Resident[], filterLabel: string) {
  const doc = await buildResidentsPdf(rows, filterLabel);
  const today = new Date().toISOString().slice(0, 10);
  doc.save(`laporan-penghuni-${today}.pdf`);
}

export function sanitizeFilename(name) {
  const base = String(name ?? "campaign")
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
  const trimmed = base.slice(0, 80);
  return trimmed || "campaign";
}

export function escapeCsvCell(value) {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function generateCSV(rows, headers) {
  const headerLine = headers.map((h) => escapeCsvCell(h)).join(",");
  const lines = rows.map((row) => headers.map((h) => escapeCsvCell(row[h])).join(","));
  return [headerLine, ...lines].join("\r\n");
}

export function downloadCSV(content, filename) {
  const bom = "\uFEFF";
  const blob = new Blob([bom + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  anchor.click();
  URL.revokeObjectURL(url);
}

export function formatUtcYyyymmdd(date = new Date()) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

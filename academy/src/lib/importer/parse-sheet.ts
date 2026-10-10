import ExcelJS from "exceljs";

/**
 * Reads the course workbook ("Course Sheet" + optional "XP Summary") into
 * plain rows. Cells are trimmed; a lone "/" means empty. No interpretation of
 * module/lesson structure happens here — see parse-package.ts.
 */

export const COURSE_SHEET_NAME = "Course Sheet";
export const XP_SUMMARY_SHEET_NAME = "XP Summary";

/** Rows whose first cell starts with this are production notes, not data. */
const NOTE_ROW_PREFIX = /^yellow rows/i;

export interface SheetRow {
  rowNumber: number;
  /** MODULE # cell: "Course Home", "M1"…"M7", "Bonus", "Replay". */
  moduleCode: string;
  /** TRAINING # cell: "" for module rows, "1"…"8", "2a"… */
  trainingCode: string;
  moduleName: string;
  trainingName: string;
  shortDescription: string;
  notes: string;
  video: string;
  release: string;
  resources: string;
  actionSteps: [string, string, string, string];
  xp: number | null;
}

export interface XpSummaryEntry {
  label: string;
  xp: number;
}

export interface ParsedSheet {
  /** Workbook file name inside the package (set by the caller). */
  fileName: string;
  sheetName: string;
  rows: SheetRow[];
  xpSummary: XpSummaryEntry[];
}

type ColumnKey =
  | "module"
  | "training"
  | "moduleName"
  | "trainingName"
  | "shortDescription"
  | "notes"
  | "video"
  | "release"
  | "resources"
  | "step1"
  | "step2"
  | "step3"
  | "step4"
  | "xp";

const HEADER_MATCHERS: Array<[ColumnKey, (h: string) => boolean]> = [
  ["module", (h) => h === "MODULE #" || h === "MODULE"],
  ["training", (h) => h.includes("TRAINING #")],
  ["moduleName", (h) => h.startsWith("MODULE NAME")],
  ["trainingName", (h) => h.startsWith("TRAINING NAME")],
  ["shortDescription", (h) => h.startsWith("SHORT DESCRIPTION")],
  ["notes", (h) => h.startsWith("TRAINING NOTES") || h.startsWith("NOTES")],
  ["video", (h) => h.startsWith("VIDEO")],
  ["release", (h) => h.startsWith("RELEASE")],
  ["resources", (h) => h.startsWith("RESOURCES")],
  ["step1", (h) => h.includes("ACTION STEP 1")],
  ["step2", (h) => h.includes("ACTION STEP 2")],
  ["step3", (h) => h.includes("ACTION STEP 3")],
  ["step4", (h) => h.includes("ACTION STEP 4")],
  ["xp", (h) => h === "XP" || h === "XPS"],
];

/** Parses a workbook from memory. Throws with a readable message when the course sheet is missing or malformed. */
export async function parseCourseSheet(data: Buffer | ArrayBuffer, fileName = "course-sheet.xlsx"): Promise<ParsedSheet> {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(data as Buffer);
  const ws = findWorksheet(wb, COURSE_SHEET_NAME) ?? wb.worksheets[0];
  if (!ws) throw new Error(`${fileName}: workbook has no worksheets`);
  const rows = rowsFromMatrix(worksheetToMatrix(ws));
  const xpWs = findWorksheet(wb, XP_SUMMARY_SHEET_NAME);
  const xpSummary = xpWs ? xpSummaryFromMatrix(worksheetToMatrix(xpWs)) : [];
  return { fileName, sheetName: ws.name, rows, xpSummary };
}

function findWorksheet(wb: ExcelJS.Workbook, name: string): ExcelJS.Worksheet | undefined {
  const wanted = name.toLowerCase();
  return wb.worksheets.find((w) => w.name.trim().toLowerCase() === wanted);
}

/** Every cell as trimmed text; rows/columns are 0-based in the result. */
export function worksheetToMatrix(ws: ExcelJS.Worksheet): string[][] {
  const matrix: string[][] = [];
  const cols = Math.max(ws.columnCount, 14);
  for (let r = 1; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const cells: string[] = [];
    for (let c = 1; c <= cols; c++) cells.push(cellText(row.getCell(c).value));
    matrix.push(cells);
  }
  return matrix;
}

export function cellText(v: ExcelJS.CellValue): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v.trim();
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (v instanceof Date) return v.toISOString();
  if (typeof v === "object") {
    if ("richText" in v) return v.richText.map((r) => r.text).join("").trim();
    if ("hyperlink" in v) return cellText(v.text);
    if ("sharedFormula" in v || "formula" in v) return v.result === undefined ? "" : cellText(v.result);
    if ("error" in v) return "";
  }
  return String(v).trim();
}

/** "/" (and "-" / "—" alone) mean "nothing here". */
export function emptyToBlank(text: string): string {
  const t = text.trim();
  return t === "/" || t === "-" || t === "—" || t === "n/a" || t === "N/A" ? "" : t;
}

function parseXp(text: string): number | null {
  const t = emptyToBlank(text).replace(/xp/i, "").trim();
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/** Pure: maps the header row to columns and turns data rows into SheetRows. */
export function rowsFromMatrix(matrix: string[][]): SheetRow[] {
  const headerIndex = matrix.findIndex((cells) => cells.some((c) => c.toUpperCase().trim() === "MODULE #"));
  if (headerIndex < 0) throw new Error(`Course sheet: header row with "MODULE #" not found`);
  const header = matrix[headerIndex].map((h) => h.toUpperCase().replace(/\s+/g, " ").trim());
  const columns = mapColumns(header);

  const rows: SheetRow[] = [];
  for (let i = headerIndex + 1; i < matrix.length; i++) {
    const cells = matrix[i];
    const get = (key: ColumnKey) => emptyToBlank(cells[columns[key]] ?? "");
    const first = (cells[columns.module] ?? "").trim();
    if (!first || NOTE_ROW_PREFIX.test(first)) continue;
    if (cells.every((c) => !c.trim())) continue;
    rows.push({
      rowNumber: i + 1,
      moduleCode: get("module"),
      trainingCode: get("training"),
      moduleName: get("moduleName"),
      trainingName: get("trainingName"),
      shortDescription: get("shortDescription"),
      notes: get("notes"),
      video: get("video"),
      release: get("release"),
      resources: get("resources"),
      actionSteps: [get("step1"), get("step2"), get("step3"), get("step4")],
      xp: parseXp(cells[columns.xp] ?? ""),
    });
  }
  return rows;
}

function mapColumns(header: string[]): Record<ColumnKey, number> {
  const used = new Set<number>();
  const out: Partial<Record<ColumnKey, number>> = {};
  const missing: string[] = [];
  for (const [key, matches] of HEADER_MATCHERS) {
    const idx = header.findIndex((h, i) => !used.has(i) && h !== "" && matches(h));
    if (idx < 0) missing.push(key);
    else {
      used.add(idx);
      out[key] = idx;
    }
  }
  if (missing.length) throw new Error(`Course sheet: header row is missing column(s): ${missing.join(", ")}`);
  return out as Record<ColumnKey, number>;
}

/** "XP Summary" tab: label in column A, number in column B. Non-numeric rows (titles, notes, formulas without results) are skipped. */
export function xpSummaryFromMatrix(matrix: string[][]): XpSummaryEntry[] {
  const out: XpSummaryEntry[] = [];
  for (const cells of matrix) {
    const label = (cells[0] ?? "").trim();
    const xp = parseXp(cells[1] ?? "");
    if (!label || xp === null) continue;
    out.push({ label, xp });
  }
  return out;
}

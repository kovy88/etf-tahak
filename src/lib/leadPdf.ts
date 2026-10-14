import manifest from "@/data/leadPdf.json";

/**
 * Cesta k PDF. Generuje ji scripts/render-pdf.ts do src/data/leadPdf.json.
 * Proměnné prostředí mají přednost (např. pro zkušební soubor), jinak platí poslední vyrobené PDF.
 */
export const LEAD_PDF_PATH: string | null = process.env.NEXT_PUBLIC_LEAD_PDF_PATH || manifest.path || null;

/** Server: LEAD_PDF_PATH z prostředí, jinak stejné jako klient. */
export const leadPdfServerPath = (): string | null => process.env.LEAD_PDF_PATH || LEAD_PDF_PATH;

export const PDF_PREVIEWS = manifest.previews;
export const PDF_PREVIEW_SIZE = manifest.preview_size;

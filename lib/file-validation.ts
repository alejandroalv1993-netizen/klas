const PDF_MIME = "application/pdf";
const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export const MAX_RESOURCE_SIZE = 25 * 1024 * 1024;
export const ACCEPTED_RESOURCE_TYPES = `${PDF_MIME},${DOCX_MIME},.pdf,.docx`;

export type ValidatedFile = {
  extension: "pdf" | "docx";
  contentType: typeof PDF_MIME | typeof DOCX_MIME;
  bytes: Uint8Array;
};

const RISK_PATTERNS = [
  { flag: "possible_isbn", pattern: /\b(?:isbn(?:-1[03])?:?\s*)?(?:97[89][-\s]?)?\d[-\s]?\d{2,5}[-\s]?\d{2,7}[-\s]?\d{1,7}[-\s]?[\dx]\b/i },
  { flag: "copyright_notice", pattern: /copyright|all rights reserved|todos los derechos reservados|derechos reservados|editorial|publisher/i },
  { flag: "exam_or_solutionary", pattern: /examen oficial|solucionario|answer key|exam solutions|prohibida su reproducci[oó]n/i },
  { flag: "possible_personal_data", pattern: /\b\d{8}[a-z]\b|[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i },
  { flag: "official_material", pattern: /material oficial|campus virtual|moodle|blackboard|aula virtual|academia|profesorado/i }
];

export async function validateResourceFile(file: File): Promise<ValidatedFile> {
  if (!file.size || file.size > MAX_RESOURCE_SIZE) {
    throw new Error("El archivo debe pesar menos de 25 MB.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension !== "pdf" && extension !== "docx") {
    throw new Error("Solo se admiten archivos PDF o DOCX.");
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (extension === "pdf") {
    const signature = new TextDecoder().decode(bytes.slice(0, 5));
    if (signature !== "%PDF-") throw new Error("El archivo no contiene un PDF válido.");
    if (file.type && file.type !== PDF_MIME) throw new Error("El tipo MIME del PDF no es válido.");
    return { extension, contentType: PDF_MIME, bytes };
  }

  const zipSignature = bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04;
  const archiveText = new TextDecoder("latin1").decode(bytes);
  const hasDocxStructure = archiveText.includes("[Content_Types].xml") && archiveText.includes("word/");
  if (!zipSignature || !hasDocxStructure) throw new Error("El archivo no contiene un DOCX válido.");
  if (file.type && file.type !== DOCX_MIME) throw new Error("El tipo MIME del DOCX no es válido.");
  return { extension, contentType: DOCX_MIME, bytes };
}

export function scanResourceSignals(params: {
  title: string;
  description: string;
  fileName: string;
  bytes: Uint8Array;
}) {
  const rawSample = new TextDecoder("latin1", { fatal: false }).decode(params.bytes.slice(0, 350_000));
  const searchable = `${params.title}\n${params.description}\n${params.fileName}\n${rawSample}`;
  const flags = new Set<string>();

  for (const { flag, pattern } of RISK_PATTERNS) {
    if (pattern.test(searchable)) flags.add(flag);
  }

  if (/scan|scanned|fotocopia|photocopy/i.test(searchable)) flags.add("possible_scan");
  if (params.bytes.length > 12 * 1024 * 1024) flags.add("large_file_review");

  return {
    flags: Array.from(flags),
    requiresManualReview: true
  };
}

export function safeFileName(fileName: string) {
  return fileName
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
}

export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 90);
}

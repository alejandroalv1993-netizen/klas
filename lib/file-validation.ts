const PDF_MIME = "application/pdf";
const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export const MAX_RESOURCE_SIZE = 25 * 1024 * 1024;
export const ACCEPTED_RESOURCE_TYPES = `${PDF_MIME},${DOCX_MIME},.pdf,.docx`;

export type ValidatedFile = {
  extension: "pdf" | "docx";
  contentType: typeof PDF_MIME | typeof DOCX_MIME;
  bytes: Uint8Array;
};

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

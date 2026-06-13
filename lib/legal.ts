export const LEGAL_VERSION = "2026-06-13";

export const legalConfig = {
  responsibleName: process.env.LEGAL_RESPONSIBLE_NAME?.trim() || "Responsable pendiente de identificar",
  taxId: process.env.LEGAL_TAX_ID?.trim() || "Pendiente",
  address: process.env.LEGAL_ADDRESS?.trim() || "Pendiente",
  contactEmail: process.env.LEGAL_CONTACT_EMAIL?.trim() || "Pendiente",
  dpoEmail: process.env.LEGAL_DPO_EMAIL?.trim() || "No designado",
  updatedAt: process.env.LEGAL_LAST_UPDATED?.trim() || LEGAL_VERSION
};

export const legalConfigComplete = [
  process.env.LEGAL_RESPONSIBLE_NAME,
  process.env.LEGAL_TAX_ID,
  process.env.LEGAL_ADDRESS,
  process.env.LEGAL_CONTACT_EMAIL
].every((value) => Boolean(value?.trim()));

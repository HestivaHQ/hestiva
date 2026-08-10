import type { QuoteAttachment } from "./email-service";

export type UploadedQuoteFile = {
  name: string;
  type: string;
  base64: string;
};

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const MAX_BYTES = 10 * 1024 * 1024;

function sniffMime(bytes: Uint8Array): string | null {
  if (bytes.length < 4) return null;

  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47)
    return "image/png";
  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46)
    return "application/pdf";

  if (bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04) {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }

  if (
    bytes.length >= 8 &&
    bytes[0] === 0xd0 &&
    bytes[1] === 0xcf &&
    bytes[2] === 0x11 &&
    bytes[3] === 0xe0 &&
    bytes[4] === 0xa1 &&
    bytes[5] === 0xb1 &&
    bytes[6] === 0x1a &&
    bytes[7] === 0xe1
  ) {
    return "application/msword";
  }

  return null;
}

function safeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
}

export function validateQuoteAttachments(files: UploadedQuoteFile[]): QuoteAttachment[] {
  const attachments: QuoteAttachment[] = [];

  for (const file of files) {
    let buffer: Uint8Array;

    try {
      buffer = Uint8Array.from(atob(file.base64), (char) => char.charCodeAt(0));
    } catch {
      console.warn({ event: "attachment_rejected", category: "invalid_encoding" });
      continue;
    }

    if (buffer.byteLength === 0 || buffer.byteLength > MAX_BYTES) {
      console.warn({ event: "attachment_rejected", category: "size" });
      continue;
    }

    const sniffedMime = sniffMime(buffer);

    if (!sniffedMime || !ALLOWED_MIME.has(sniffedMime)) {
      console.warn({ event: "attachment_rejected", category: "content_type" });
      continue;
    }

    attachments.push({
      filename: safeFileName(file.name),
      content: file.base64,
      contentType: sniffedMime,
    });
  }

  return attachments;
}

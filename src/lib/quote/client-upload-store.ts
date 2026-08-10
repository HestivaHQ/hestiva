const MAX_FILES = 3;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_COMPRESSED_DIMENSION = 1920;
const JPEG_QUALITY = 0.82;

const ACCEPTED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/heic",
  "image/heif",
]);

const ACCEPTED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "heic", "heif"]);

let selectedFiles: File[] = [];

function isSupportedImage(file: File) {
  if (ACCEPTED_MIME_TYPES.has(file.type.toLowerCase())) return true;
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  return ACCEPTED_EXTENSIONS.has(extension);
}

function fileKey(file: File) {
  return `${file.name}:${file.size}:${file.lastModified}`;
}

function compressedFileName(name: string) {
  const base = name.replace(/\.[^.]+$/, "") || "quote-photo";
  return `${base}.jpg`;
}

async function compressBrowserImage(file: File): Promise<File> {
  if (file.type === "image/heic" || file.type === "image/heif" || /\.(heic|heif)$/i.test(file.name)) {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_COMPRESSED_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) {
      bitmap.close();
      return file;
    }
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY),
    );
    if (!blob || blob.size === 0 || blob.size >= file.size) return file;

    return new File([blob], compressedFileName(file.name), {
      type: "image/jpeg",
      lastModified: file.lastModified,
    });
  } catch {
    return file;
  }
}

export type QuoteFileSelectionResult = {
  files: readonly File[];
  error: string | null;
};

export function getQuoteFiles(): readonly File[] {
  return selectedFiles;
}

export async function addQuoteFiles(incoming: readonly File[]): Promise<QuoteFileSelectionResult> {
  const errors: string[] = [];
  const existingKeys = new Set(selectedFiles.map(fileKey));

  for (const originalFile of incoming) {
    if (selectedFiles.length >= MAX_FILES) {
      errors.push(`You can attach up to ${MAX_FILES} photos.`);
      break;
    }

    if (!isSupportedImage(originalFile)) {
      errors.push(`${originalFile.name} is not a supported image.`);
      continue;
    }

    if (originalFile.size === 0 || originalFile.size > MAX_FILE_BYTES) {
      errors.push(`${originalFile.name} must be smaller than 10 MB.`);
      continue;
    }

    const originalKey = fileKey(originalFile);
    if (existingKeys.has(originalKey)) continue;

    const file = await compressBrowserImage(originalFile);
    selectedFiles = [...selectedFiles, file];
    existingKeys.add(originalKey);
    existingKeys.add(fileKey(file));
  }

  return {
    files: selectedFiles,
    error: errors.length ? errors[0] : null,
  };
}

export function removeQuoteFile(index: number): readonly File[] {
  selectedFiles = selectedFiles.filter((_, fileIndex) => fileIndex !== index);
  return selectedFiles;
}

export function clearQuoteFiles() {
  selectedFiles = [];
}

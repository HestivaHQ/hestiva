const MAX_FILES = 10;
const MAX_FILE_BYTES = 10 * 1024 * 1024;

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

export type QuoteFileSelectionResult = {
  files: readonly File[];
  error: string | null;
};

export function getQuoteFiles(): readonly File[] {
  return selectedFiles;
}

export function addQuoteFiles(incoming: readonly File[]): QuoteFileSelectionResult {
  const errors: string[] = [];
  const existingKeys = new Set(selectedFiles.map(fileKey));

  for (const file of incoming) {
    if (selectedFiles.length >= MAX_FILES) {
      errors.push(`You can attach up to ${MAX_FILES} photos.`);
      break;
    }

    if (!isSupportedImage(file)) {
      errors.push(`${file.name} is not a supported image.`);
      continue;
    }

    if (file.size === 0 || file.size > MAX_FILE_BYTES) {
      errors.push(`${file.name} must be smaller than 10 MB.`);
      continue;
    }

    const key = fileKey(file);
    if (existingKeys.has(key)) continue;

    selectedFiles = [...selectedFiles, file];
    existingKeys.add(key);
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

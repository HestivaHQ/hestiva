export type SuccessfulSubmissionResult = Readonly<{ success: true }>;

const FAILURE_CATEGORIES = new Set([
  "validation",
  "bot",
  "origin",
  "rate_limit",
  "delivery",
  "unexpected",
]);

function rememberFailureCategory(value: Record<string, unknown>) {
  const category = value.category;
  if (typeof category !== "string" || !FAILURE_CATEGORIES.has(category)) return;

  const target = globalThis as typeof globalThis & { __hestivaFormFailureCategory?: string };
  target.__hestivaFormFailureCategory = category;
}

/** Only the server's explicit application-level acknowledgement is success. */
export function isSuccessfulSubmissionResult(value: unknown): value is SuccessfulSubmissionResult {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;

  const result = value as Record<string, unknown>;
  if (result.success === true) return true;

  rememberFailureCategory(result);
  return false;
}

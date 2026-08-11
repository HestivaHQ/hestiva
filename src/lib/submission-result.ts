export type SuccessfulSubmissionResult = Readonly<{ success: true }>;
export type SubmissionFailureCategory =
  "validation" | "bot" | "origin" | "rate_limit" | "delivery" | "unexpected" | "framework";

const FAILURE_CATEGORIES = new Set<SubmissionFailureCategory>([
  "validation",
  "bot",
  "origin",
  "rate_limit",
  "delivery",
  "unexpected",
  "framework",
]);

let lastFailureCategory: SubmissionFailureCategory | undefined;

function rememberFailureCategory(value: Record<string, unknown>) {
  const category = value.category;
  if (
    typeof category === "string" &&
    FAILURE_CATEGORIES.has(category as SubmissionFailureCategory)
  ) {
    lastFailureCategory = category as SubmissionFailureCategory;
    return;
  }

  if (
    typeof value.status === "number" ||
    value.unhandled === true ||
    value.message === "HTTPError"
  ) {
    lastFailureCategory = "framework";
  }
}

export function consumeSubmissionFailureCategory() {
  const category = lastFailureCategory;
  lastFailureCategory = undefined;
  return category;
}

/** Only the server's explicit application-level acknowledgement is success. */
export function isSuccessfulSubmissionResult(value: unknown): value is SuccessfulSubmissionResult {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    lastFailureCategory = "framework";
    return false;
  }

  const result = value as Record<string, unknown>;
  if (result.success === true) {
    lastFailureCategory = undefined;
    return true;
  }

  rememberFailureCategory(result);
  return false;
}

export type SuccessfulSubmissionResult = Readonly<{ success: true }>;

/** Only the server's explicit application-level acknowledgement is success. */
export function isSuccessfulSubmissionResult(value: unknown): value is SuccessfulSubmissionResult {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;

  return (value as Record<string, unknown>).success === true;
}

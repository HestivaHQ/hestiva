export type SubmissionStage =
  "origin" | "honeypot" | "rate_limit" | "validation" | "email_delivery";

export type SubmissionFailureCategory =
  | "invalid_request"
  | "automated_submission"
  | "rate_limited"
  | "missing_runtime_configuration"
  | "provider_failure";

export class PublicSubmissionError extends Error {
  constructor(
    readonly stage: SubmissionStage,
    readonly category: SubmissionFailureCategory,
  ) {
    super("The submission could not be processed.");
    this.name = "PublicSubmissionError";
  }
}

export function logSubmissionRejection(error: PublicSubmissionError) {
  console.error("form_submission_rejected", {
    stage: error.stage,
    category: error.category,
  });
}

export function assertHumanSubmission(website: string, elapsedMs: number) {
  if (website.trim() !== "" || (elapsedMs > 0 && elapsedMs < 3000)) {
    throw new PublicSubmissionError("honeypot", "automated_submission");
  }
}

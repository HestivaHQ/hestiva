import assert from "node:assert/strict";
import { describe, test } from "bun:test";
import { PublicSubmissionError } from "@/lib/form-security";
import { isSuccessfulSubmissionResult } from "@/lib/submission-result";

describe("isSuccessfulSubmissionResult", () => {
  test("accepts the explicit success contract", () => {
    assert.equal(isSuccessfulSubmissionResult({ success: true }), true);
  });

  test("rejects a framework-style HTTP failure object", () => {
    assert.equal(
      isSuccessfulSubmissionResult({ status: 500, unhandled: true, message: "HTTPError" }),
      false,
    );
  });

  test("rejects an absent result", () => {
    assert.equal(isSuccessfulSubmissionResult(undefined), false);
  });

  test("does not interpret a server submission failure as success", () => {
    assert.equal(
      isSuccessfulSubmissionResult(new PublicSubmissionError("email_delivery", "provider_failure")),
      false,
    );
  });
});

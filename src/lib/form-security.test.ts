import assert from "node:assert/strict";
import { describe, test } from "bun:test";
import { assertHumanSubmission, PublicSubmissionError } from "@/lib/form-security";

describe("public form security", () => {
  test("rejects a populated honeypot without identity detail", () => {
    assert.throws(() => assertHumanSubmission("bot value", 5000), PublicSubmissionError);
  });

  test("rejects an implausibly fast submission", () => {
    assert.throws(() => assertHumanSubmission("", 1000), PublicSubmissionError);
  });

  test("accepts a normally timed submission", () => {
    assert.doesNotThrow(() => assertHumanSubmission("", 5000));
  });
});

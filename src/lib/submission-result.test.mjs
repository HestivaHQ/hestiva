import { describe, expect, test } from "bun:test";
import { isSuccessfulSubmissionResult } from "./submission-result.ts";

describe("isSuccessfulSubmissionResult", () => {
  test("accepts the explicit success contract", () => {
    expect(isSuccessfulSubmissionResult({ success: true })).toBe(true);
  });

  test("rejects a framework-style HTTP failure object", () => {
    expect(
      isSuccessfulSubmissionResult({ status: 500, unhandled: true, message: "HTTPError" }),
    ).toBe(false);
  });

  test("rejects an absent result", () => {
    expect(isSuccessfulSubmissionResult(undefined)).toBe(false);
  });

  test("rejects malformed success values", () => {
    expect(isSuccessfulSubmissionResult({ success: false })).toBe(false);
    expect(isSuccessfulSubmissionResult({ success: "true" })).toBe(false);
    expect(isSuccessfulSubmissionResult(null)).toBe(false);
  });
});

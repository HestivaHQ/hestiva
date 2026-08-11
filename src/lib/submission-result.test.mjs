import { describe, expect, test } from "bun:test";
import {
  consumeSubmissionFailureCategory,
  isSuccessfulSubmissionResult,
} from "./submission-result.ts";

describe("isSuccessfulSubmissionResult", () => {
  test("accepts the explicit success contract", () => {
    expect(isSuccessfulSubmissionResult({ success: true })).toBe(true);
    expect(consumeSubmissionFailureCategory()).toBeUndefined();
  });

  test("preserves a bounded application failure category", () => {
    expect(isSuccessfulSubmissionResult({ success: false, category: "delivery" })).toBe(false);
    expect(consumeSubmissionFailureCategory()).toBe("delivery");
    expect(consumeSubmissionFailureCategory()).toBeUndefined();
  });

  test("classifies framework-style HTTP failures", () => {
    expect(
      isSuccessfulSubmissionResult({ status: 500, unhandled: true, message: "HTTPError" }),
    ).toBe(false);
    expect(consumeSubmissionFailureCategory()).toBe("framework");
  });

  test("classifies an absent result as a framework failure", () => {
    expect(isSuccessfulSubmissionResult(undefined)).toBe(false);
    expect(consumeSubmissionFailureCategory()).toBe("framework");
  });

  test("rejects malformed success values", () => {
    expect(isSuccessfulSubmissionResult({ success: false })).toBe(false);
    expect(isSuccessfulSubmissionResult({ success: "true" })).toBe(false);
    expect(isSuccessfulSubmissionResult(null)).toBe(false);
  });
});

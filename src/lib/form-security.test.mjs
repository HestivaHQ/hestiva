import { describe, expect, test } from "bun:test";
import {
  assertHoneypotEmpty,
  assertRateLimitAllowed,
  assertSameOrigin,
  contactSchema,
  PublicSubmissionError,
} from "./form-security";
import { checkIsolateRateLimit, rateLimitPolicy } from "./rate-limit";
import { sendEmailViaResend } from "./quote/email-service";

const validSubmission = {
  name: "Test Customer",
  phone: "+27 82 123 4567",
  email: "customer@example.com",
  service: "General Enquiry",
  propertyAddress: "Sandton",
  description: "Please tell me about your services.",
  preferredContact: "Email",
  urgency: "Not specified",
  files: [],
  website: "",
};

describe("public form security", () => {
  test("accepts a valid bounded submission", () => {
    expect(contactSchema.parse(validSubmission).email).toBe("customer@example.com");
  });

  test("rejects invalid, oversized, and unexpected values", () => {
    expect(contactSchema.safeParse({ ...validSubmission, email: "invalid" }).success).toBe(false);
    expect(
      contactSchema.safeParse({ ...validSubmission, description: "x".repeat(5001) }).success,
    ).toBe(false);
    expect(
      contactSchema.safeParse({ ...validSubmission, quoteReference: "chosen-by-client" }).success,
    ).toBe(false);
  });

  test("rejects a populated honeypot and cross-origin request", () => {
    expect(() => assertHoneypotEmpty("spam")).toThrow(PublicSubmissionError);
    expect(() => assertSameOrigin("https://attacker.example", "hestiva.co.za")).toThrow(
      PublicSubmissionError,
    );
    expect(() => assertSameOrigin("https://hestiva.co.za", "hestiva.co.za")).not.toThrow();
  });

  test("rejects the deterministic per-isolate rate-limit excess", async () => {
    const identity = crypto.randomUUID();
    for (let count = 0; count < rateLimitPolicy.maxSubmissions; count += 1) {
      expect(await checkIsolateRateLimit(identity, 1_000)).toBe(true);
    }
    expect(await checkIsolateRateLimit(identity, 1_000)).toBe(false);
    expect(() => assertRateLimitAllowed(false)).toThrow("Please wait and try again later");
  });

  test("times out provider fetch and never exposes its raw response", async () => {
    const hangingFetch = (_, init) =>
      new Promise((_, reject) => {
        init?.signal?.addEventListener("abort", () =>
          reject(new DOMException("secret timeout", "AbortError")),
        );
      });
    await expect(
      sendEmailViaResend(
        { to: "recipient@example.com", subject: "Test", text: "Test", html: "<p>Test</p>" },
        hangingFetch,
        5,
      ),
    ).rejects.toThrow("Email provider request failed");

    const rejectedFetch = async () =>
      new Response('{"provider_secret":"must-not-leak"}', { status: 429 });
    await expect(
      sendEmailViaResend(
        { to: "recipient@example.com", subject: "Test", text: "Test", html: "<p>Test</p>" },
        rejectedFetch,
      ),
    ).rejects.toThrow("Email provider rejected the request");
  });
});

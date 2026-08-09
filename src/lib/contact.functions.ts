import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import {
  assertHumanSubmission,
  logSubmissionRejection,
  PublicSubmissionError,
} from "@/lib/form-security";
import { EmailServiceError, sendEmailViaResend } from "@/lib/quote/email-service";
import { buildQuoteEmailPackage } from "@/lib/quote/email-templates";
import { validateQuoteAttachments } from "@/lib/quote/file-validation";
import { assertRateLimit } from "@/lib/rate-limit";

const fileSchema = z.object({
  name: z.string().min(1).max(255),
  type: z.string().min(1).max(200),
  base64: z
    .string()
    .min(1)
    .max(15 * 1024 * 1024),
});

const contactSchema = z.object({
  name: z.string().min(1).max(255),
  phone: z.string().min(1).max(50),
  email: z.string().email().max(255),
  service: z.string().min(1).max(255),
  jobType: z.string().max(255).optional().default(""),
  multipleServices: z.array(z.string().max(255)).max(20).optional().default([]),
  otherService: z.string().max(500).optional().default(""),
  propertyAddress: z.string().min(1).max(1000),
  description: z.string().min(1).max(5000),
  preferredContact: z.string().min(1).max(50),
  urgency: z.string().min(1).max(50),
  quoteReference: z.string().max(50).optional().default(""),
  files: z.array(fileSchema).max(10).optional().default([]),
  website: z.string().max(200).optional().default(""),
  elapsedMs: z
    .number()
    .int()
    .min(0)
    .max(24 * 60 * 60 * 1000)
    .optional()
    .default(0),
});

function validateInput(input: unknown) {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    const error = new PublicSubmissionError("validation", "invalid_request");
    logSubmissionRejection(error);
    throw new Error("The submission could not be processed.");
  }
  return parsed.data;
}

function assertSameOrigin() {
  const origin = getRequestHeader("origin");
  const host = getRequestHeader("x-forwarded-host") || getRequestHeader("host");
  const protocol = getRequestHeader("x-forwarded-proto") || "https";

  try {
    if (!origin || !host || new URL(origin).origin !== `${protocol}://${host}`) {
      throw new Error("origin mismatch");
    }
  } catch {
    throw new PublicSubmissionError("origin", "invalid_request");
  }
}

function getSubmittedAt() {
  return new Date().toLocaleString("en-ZA", {
    timeZone: "Africa/Johannesburg",
    dateStyle: "full",
    timeStyle: "short",
  });
}

export const submitContactForm = createServerFn({ method: "POST" })
  .validator(validateInput)
  .handler(async ({ data }) => {
    try {
      assertSameOrigin();
      assertHumanSubmission(data.website, data.elapsedMs);
      const forwarded =
        getRequestHeader("cf-connecting-ip") || getRequestHeader("x-real-ip") || "unknown";
      await assertRateLimit(forwarded);

      const attachments = validateQuoteAttachments(data.files);
      const reference = data.quoteReference || `HST-${Date.now()}`;
      const submittedAt = getSubmittedAt();
      const attachmentSummary = attachments.length
        ? attachments.map((attachment) => `- ${attachment.filename}`).join("\n")
        : "None";

      const emailPackage = buildQuoteEmailPackage({
        name: data.name,
        phone: data.phone,
        email: data.email,
        service: data.service,
        jobType: data.jobType,
        multipleServices: data.multipleServices,
        otherService: data.otherService,
        propertyAddress: data.propertyAddress,
        description: data.description,
        preferredContact: data.preferredContact,
        urgency: data.urgency,
        reference,
        submittedAt,
        attachmentSummary,
      });

      await Promise.all([
        sendEmailViaResend({
          to: "quotes@hestiva.co.za",
          subject: emailPackage.adminSubject,
          text: emailPackage.adminText,
          html: emailPackage.adminHtml,
          attachments,
        }),
        sendEmailViaResend({
          to: data.email,
          subject: emailPackage.customerSubject,
          text: emailPackage.customerText,
          html: emailPackage.customerHtml,
        }),
      ]);
      return { success: true } as const;
    } catch (cause) {
      const error =
        cause instanceof PublicSubmissionError
          ? cause
          : new PublicSubmissionError(
              "email_delivery",
              cause instanceof EmailServiceError ? cause.category : "provider_failure",
            );
      logSubmissionRejection(error);
      throw new Error("The submission could not be processed.");
    }
  });

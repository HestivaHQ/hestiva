import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { sendEmailViaResend } from "@/lib/quote/email-service";
import { buildQuoteEmailPackage } from "@/lib/quote/email-templates";
import { validateQuoteAttachments } from "@/lib/quote/file-validation";
import {
  assertHoneypotEmpty,
  assertRateLimitAllowed,
  assertSameOrigin,
  contactSchema,
  PublicSubmissionError,
} from "@/lib/form-security";
import { checkIsolateRateLimit } from "@/lib/rate-limit";

async function assertRateLimit() {
  const identity = getRequestHeader("cf-connecting-ip")?.trim();
  if (!identity) throw new PublicSubmissionError("rate_limit");
  assertRateLimitAllowed(await checkIsolateRateLimit(identity));
}

function getSubmittedAt() {
  return new Date().toLocaleString("en-ZA", {
    timeZone: "Africa/Johannesburg",
    dateStyle: "full",
    timeStyle: "short",
  });
}

function previewFailure(stage: PublicSubmissionError["category"] | "validation" | "unexpected") {
  const host = getRequestHeader("host")?.toLowerCase() ?? "";

  // Temporary diagnostic for Cloudflare Preview URLs only. It exposes only the broad
  // failure stage and never includes request data, identity, secrets, or provider output.
  if (host.endsWith(".workers.dev")) {
    return { success: false as const, diagnosticStage: stage };
  }

  return { success: false as const };
}

export const submitContactForm = createServerFn({ method: "POST" })
  .validator((data: unknown) => data)
  .handler(async ({ data }) => {
    try {
      const parsed = contactSchema.safeParse(data);
      if (!parsed.success) {
        console.error({ event: "form_submission_rejected", stage: "validation" });
        return previewFailure("validation");
      }

      const submission = parsed.data;
      assertSameOrigin(getRequestHeader("origin"), getRequestHeader("host"));
      assertHoneypotEmpty(submission.website);
      await assertRateLimit();

      const attachments = validateQuoteAttachments(submission.files);
      const reference = `HST-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
      const submittedAt = getSubmittedAt();
      const attachmentSummary = attachments.length
        ? attachments.map((attachment) => `- ${attachment.filename}`).join("\n")
        : "None";

      const emailPackage = buildQuoteEmailPackage({
        name: submission.name,
        phone: submission.phone,
        email: submission.email,
        service: submission.service,
        jobType: submission.jobType,
        multipleServices: submission.multipleServices,
        otherService: submission.otherService,
        propertyAddress: submission.propertyAddress,
        description: submission.description,
        preferredContact: submission.preferredContact,
        urgency: submission.urgency,
        reference,
        submittedAt,
        attachmentSummary,
      });

      try {
        await Promise.all([
          sendEmailViaResend({
            to: "quotes@hestiva.co.za",
            subject: emailPackage.adminSubject,
            text: emailPackage.adminText,
            html: emailPackage.adminHtml,
            attachments,
          }),
          sendEmailViaResend({
            to: submission.email,
            subject: emailPackage.customerSubject,
            text: emailPackage.customerText,
            html: emailPackage.customerHtml,
          }),
        ]);
      } catch {
        throw new PublicSubmissionError("delivery");
      }

      return { success: true as const };
    } catch (error) {
      if (error instanceof PublicSubmissionError) {
        console.error({ event: "form_submission_rejected", stage: error.category });
        return previewFailure(error.category);
      }

      console.error({ event: "form_submission_rejected", stage: "unexpected" });
      return previewFailure("unexpected");
    }
  });

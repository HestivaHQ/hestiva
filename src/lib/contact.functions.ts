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

export const submitContactForm = createServerFn({ method: "POST" })
  .inputValidator((data) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    assertSameOrigin(getRequestHeader("origin"), getRequestHeader("host"));
    assertHoneypotEmpty(data.website);
    await assertRateLimit();

    const attachments = validateQuoteAttachments(data.files);
    const reference = `HST-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
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
          to: data.email,
          subject: emailPackage.customerSubject,
          text: emailPackage.customerText,
          html: emailPackage.customerHtml,
        }),
      ]);
    } catch (emailError) {
      console.error({ event: "form_submission_failed", stage: "email_delivery", reference });
      throw new PublicSubmissionError("delivery");
    }

    return { success: true };
  });

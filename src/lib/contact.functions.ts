import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { buildContactEmailPackage } from "@/lib/contact-email-templates";
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

const CONTACT_ENQUIRY_TYPES = new Set([
  "Request a Quote",
  "General Enquiry",
  "Existing Booking",
  "Service Area Check",
  "Feedback",
]);

type SubmissionChannel = "contact" | "quote";
type SubmissionFailureCategory =
  "validation" | "bot" | "origin" | "rate_limit" | "delivery" | "unexpected";

function submissionChannel(service: string): SubmissionChannel {
  return CONTACT_ENQUIRY_TYPES.has(service) ? "contact" : "quote";
}

function adminRecipient(channel: SubmissionChannel) {
  return channel === "contact" ? "info@homent.co.za" : "quotes@homent.co.za";
}

function senderIdentity(channel: SubmissionChannel) {
  return channel === "contact"
    ? { from: "Homent <info@homent.co.za>", replyTo: "info@homent.co.za" }
    : { from: "Homent Quotes <quotes@homent.co.za>", replyTo: "quotes@homent.co.za" };
}

function failed(category: SubmissionFailureCategory) {
  return { success: false as const, category };
}

async function assertRateLimit(service: string) {
  const identity = getRequestHeader("cf-connecting-ip")?.trim();
  if (!identity) throw new PublicSubmissionError("rate_limit");
  assertRateLimitAllowed(await checkIsolateRateLimit(`${submissionChannel(service)}|${identity}`));
}

function getSubmittedAt() {
  return new Date().toLocaleString("en-ZA", {
    timeZone: "Africa/Johannesburg",
    dateStyle: "full",
    timeStyle: "short",
  });
}

export const submitContactForm = createServerFn({ method: "POST" })
  .validator((data: unknown) => data)
  .handler(async ({ data }) => {
    try {
      const parsed = contactSchema.safeParse(data);
      if (!parsed.success) {
        console.error({ event: "form_submission_rejected", stage: "validation" });
        return failed("validation");
      }

      const submission = parsed.data;
      const channel = submissionChannel(submission.service);
      assertSameOrigin(getRequestHeader("origin"), getRequestHeader("host"));
      assertHoneypotEmpty(submission.website);
      await assertRateLimit(submission.service);

      const attachments = validateQuoteAttachments(submission.files);
      const reference = `HOM-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
      const submittedAt = getSubmittedAt();
      const attachmentSummary = attachments.length
        ? attachments.map((attachment) => `- ${attachment.filename}`).join("\n")
        : "None";

      const emailPackage =
        channel === "contact"
          ? buildContactEmailPackage({
              name: submission.name,
              phone: submission.phone,
              email: submission.email,
              enquiryType: submission.service,
              suburb: submission.propertyAddress,
              description: submission.description,
              preferredContact: submission.preferredContact,
              reference,
              submittedAt,
            })
          : buildQuoteEmailPackage({
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
      const identity = senderIdentity(channel);

      try {
        await Promise.all([
          sendEmailViaResend({
            to: adminRecipient(channel),
            subject: emailPackage.adminSubject,
            text: emailPackage.adminText,
            html: emailPackage.adminHtml,
            attachments,
            ...identity,
          }),
          sendEmailViaResend({
            to: submission.email,
            subject: emailPackage.customerSubject,
            text: emailPackage.customerText,
            html: emailPackage.customerHtml,
            ...identity,
          }),
        ]);
      } catch {
        throw new PublicSubmissionError("delivery");
      }

      return { success: true as const };
    } catch (error) {
      if (error instanceof PublicSubmissionError) {
        console.error({ event: "form_submission_rejected", stage: error.category });
        return failed(error.category);
      }

      console.error({ event: "form_submission_rejected", stage: "unexpected" });
      return failed("unexpected");
    }
  });

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
  type ContactSubmission,
} from "@/lib/form-security";
import { checkIsolateRateLimit } from "@/lib/rate-limit";

const CONTACT_ENQUIRY_TYPES = new Set([
  "Request a Quote",
  "General Enquiry",
  "Existing Booking",
  "Service Area Check",
  "Feedback",
]);
const ENQUIRY_REFERENCE = /^ENQ-\d{8}-\d{4}$/;

type SubmissionChannel = "contact" | "quote";
type SubmissionFailureCategory =
  "validation" | "bot" | "origin" | "rate_limit" | "delivery" | "unexpected";

type WebsiteEnquiryPayload = {
  schemaVersion: "website-enquiry.v1";
  submissionId: string;
  submittedAt: string;
  name: string;
  phone: string;
  email: string;
  enquiryType: string;
  propertyAddress: string;
  description: string;
  preferredContact: string;
};

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

function formatSubmittedAt(value = new Date()) {
  return value.toLocaleString("en-ZA", {
    timeZone: "Africa/Johannesburg",
    dateStyle: "full",
    timeStyle: "short",
  });
}

export function buildWebsiteEnquiryPayload(
  submission: ContactSubmission,
  submissionId: string,
  submittedAt: string,
): WebsiteEnquiryPayload {
  return {
    schemaVersion: "website-enquiry.v1",
    submissionId,
    submittedAt,
    name: submission.name,
    phone: submission.phone,
    email: submission.email,
    enquiryType: submission.service,
    propertyAddress: submission.propertyAddress,
    description: submission.description,
    preferredContact: submission.preferredContact,
  };
}

async function postWebsiteEnquiry(payload: WebsiteEnquiryPayload) {
  const baseUrl = process.env.HESTIVA_OS_API_URL?.trim().replace(/\/$/, "");
  const secret = process.env.HESTIVA_WEBSITE_INTEGRATION_SECRET?.trim();
  if (!baseUrl || !secret) {
    console.error({ event: "hestiva_os_enquiry_delivery_failed", stage: "configuration" });
    throw new PublicSubmissionError("delivery");
  }

  let lastFailure: "network" | "response" = "network";
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12_000);
    try {
      const response = await fetch(`${baseUrl}/api/v1/integrations/website/enquiries`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${secret}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) {
        lastFailure = "response";
        console.error({
          event: "hestiva_os_enquiry_delivery_failed",
          stage: "response",
          status: response.status,
          attempt,
        });
        if (response.status < 500 || attempt === 2) break;
        continue;
      }

      const result = (await response.json()) as {
        submissionId?: unknown;
        enquiryReference?: unknown;
      };
      if (
        result.submissionId !== payload.submissionId ||
        typeof result.enquiryReference !== "string" ||
        !ENQUIRY_REFERENCE.test(result.enquiryReference)
      ) {
        console.error({ event: "hestiva_os_enquiry_delivery_failed", stage: "invalid_response" });
        throw new PublicSubmissionError("delivery");
      }

      return result.enquiryReference;
    } catch (error) {
      if (error instanceof PublicSubmissionError) throw error;
      lastFailure = "network";
      console.error({
        event: "hestiva_os_enquiry_delivery_failed",
        stage: "network",
        attempt,
      });
    } finally {
      clearTimeout(timer);
    }
  }

  console.error({ event: "hestiva_os_enquiry_delivery_failed", stage: lastFailure });
  throw new PublicSubmissionError("delivery");
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
      const acceptedAt = new Date();
      const submittedAt = formatSubmittedAt(acceptedAt);
      const attachmentSummary = attachments.length
        ? attachments.map((attachment) => `- ${attachment.filename}`).join("\n")
        : "None";

      let reference: string;
      if (channel === "contact") {
        const submissionId = crypto.randomUUID();
        const osPayload = buildWebsiteEnquiryPayload(
          submission,
          submissionId,
          acceptedAt.toISOString(),
        );
        reference = await postWebsiteEnquiry(osPayload);
      } else {
        reference = `HOM-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
      }

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

      let correspondenceDelivered = true;
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
        if (channel === "quote") throw new PublicSubmissionError("delivery");
        correspondenceDelivered = false;
        console.error({
          event: "contact_enquiry_correspondence_failed",
          enquiryReference: reference,
        });
      }

      return channel === "contact"
        ? { success: true as const, enquiryReference: reference, correspondenceDelivered }
        : { success: true as const };
    } catch (error) {
      if (error instanceof PublicSubmissionError) {
        console.error({ event: "form_submission_rejected", stage: error.category });
        return failed(error.category);
      }

      console.error({ event: "form_submission_rejected", stage: "unexpected" });
      return failed("unexpected");
    }
  });

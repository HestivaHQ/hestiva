import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { sendEmailViaResend } from "@/lib/quote/email-service";
import { buildQuoteEmailPackage } from "@/lib/quote/email-templates";
import { validateQuoteAttachments } from "@/lib/quote/file-validation";

const fileSchema = z.object({
  name: z.string().min(1).max(255),
  type: z.string().min(1).max(200),
  base64: z.string().min(1).max(15 * 1024 * 1024),
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
  elapsedMs: z.number().int().min(0).max(24 * 60 * 60 * 1000).optional().default(0),
});

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function assertHumanSubmission(website: string, elapsedMs: number) {
  if (website && website.trim() !== "") {
    throw new Error("Submission blocked.");
  }

  if (elapsedMs > 0 && elapsedMs < 3000) {
    throw new Error("Submission rejected: form completed too quickly.");
  }
}

async function checkRateLimit(hash: string): Promise<boolean> {
  console.log(`Rate limit check for IP hash: ${hash}`);
  return true;
}

async function assertRateLimit() {
  const fwd = getRequestHeader("x-forwarded-for") || "";
  const realIp = getRequestHeader("x-real-ip") || getRequestHeader("cf-connecting-ip") || "";
  const ip = (fwd.split(",")[0] || realIp || "unknown").trim();
  const ipHash = await sha256Hex(ip + "|hestiva-quote-form");
  const allowed = await checkRateLimit(ipHash);

  if (!allowed) {
    throw new Error("Too many requests. Please try again later or call us directly.");
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
  .inputValidator((data) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    assertHumanSubmission(data.website, data.elapsedMs);
    await assertRateLimit();

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

    try {
      await Promise.all([
        sendEmailViaResend({
          to: "info@hestiva.co.za",
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
      console.error("Email sending error:", emailError);
      const detail = emailError instanceof Error ? emailError.message : String(emailError);
      throw new Error(`Email delivery failed: ${detail}`);
    }

    return { success: true };
  });

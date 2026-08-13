import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
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
import {
  buildHestivaOsQuotePayload,
  type HestivaOsPhoto,
  type QuoteFormSnapshot,
} from "@/lib/quote/hestiva-os-contract";

const fileSchema = z
  .object({
    clientPhotoId: z.string().uuid(),
    name: z.string().trim().min(1).max(120),
    type: z.string().trim().min(1).max(100),
    base64: z.string().min(1).max(14 * 1024 * 1024),
  })
  .strict();

const laundrySchema = z
  .object({
    facilities: z.enum(["WASHER_DRYER", "WASHER_LINE", "NO_WASHER"]).optional(),
    laundryLoads: z.number().int().positive().optional(),
    ironingLoads: z.number().int().positive().optional(),
  })
  .strict();

const snapshotSchema = z
  .object({
    submissionId: z.string().uuid(),
    submittedAt: z.string().datetime({ offset: true }),
    values: z.record(z.string(), z.string()),
    addOns: z.array(z.string().trim().min(1).max(120)).max(30),
    laundry: laundrySchema.optional(),
  })
  .strict();

const structuredSubmissionSchema = z
  .object({
    snapshot: snapshotSchema,
    files: z.array(fileSchema).max(10).default([]),
    website: z.string().max(200).optional().default(""),
  })
  .strict();

function failed(category: "validation" | "bot" | "origin" | "rate_limit" | "delivery" | "unexpected") {
  return { success: false as const, category };
}

function publicEmailInput(snapshot: QuoteFormSnapshot) {
  const values = snapshot.values;
  const propertyAddress = [values.address, values.suburb, values.postcode].filter(Boolean).join(", ");
  const detailEntries = Object.entries(values)
    .filter(([, value]) => value?.trim())
    .map(([key, value]) => `${key}: ${value}`);

  return {
    name: values.fullName || "",
    phone: values.mobile || "",
    email: values.email || "",
    service: values.service || "Residential Cleaning Quote",
    jobType: values.propertyType || "",
    multipleServices: snapshot.addOns,
    otherService: "",
    propertyAddress: propertyAddress || "Address supplied in quote form",
    description: detailEntries.length
      ? detailEntries.join("\n")
      : "Residential cleaning quotation requested through the Homent website.",
    preferredContact: values.contactMethod || "Not specified",
    urgency: values.urgency || "Not specified",
    files: [],
    website: "",
  };
}

function decodeBase64(value: string) {
  return Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
}

async function sha256Hex(bytes: Uint8Array) {
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function buildPhotos(files: z.infer<typeof fileSchema>[]): Promise<HestivaOsPhoto[]> {
  const photos: HestivaOsPhoto[] = [];
  for (const file of files) {
    if (!file.type.startsWith("image/")) continue;
    const bytes = decodeBase64(file.base64);
    photos.push({
      clientPhotoId: file.clientPhotoId,
      fileName: file.name,
      contentType: file.type,
      byteSize: bytes.byteLength,
      sha256: await sha256Hex(bytes),
      transfer: { kind: "UPLOAD", dataBase64: file.base64 },
    });
  }
  return photos;
}

async function submitToHestivaOs(payload: unknown) {
  const baseUrl = process.env.HESTIVA_OS_API_URL?.trim().replace(/\/$/, "");
  const secret = process.env.HESTIVA_WEBSITE_INTEGRATION_SECRET?.trim();
  if (!baseUrl || !secret) {
    console.error({ event: "hestiva_os_quote_delivery_failed", stage: "configuration" });
    throw new PublicSubmissionError("delivery");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch(`${baseUrl}/api/integrations/website/quotes`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${secret}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!response.ok) {
      console.error({
        event: "hestiva_os_quote_delivery_failed",
        stage: "response",
        status: response.status,
      });
      throw new PublicSubmissionError("delivery");
    }
    const result = (await response.json()) as { quoteReference?: unknown };
    if (typeof result.quoteReference !== "string" || !result.quoteReference.trim()) {
      console.error({ event: "hestiva_os_quote_delivery_failed", stage: "invalid_response" });
      throw new PublicSubmissionError("delivery");
    }
    return result.quoteReference.trim();
  } catch (error) {
    if (error instanceof PublicSubmissionError) throw error;
    console.error({ event: "hestiva_os_quote_delivery_failed", stage: "network" });
    throw new PublicSubmissionError("delivery");
  } finally {
    clearTimeout(timer);
  }
}

export const submitStructuredQuoteForm = createServerFn({ method: "POST" })
  .validator((data: unknown) => data)
  .handler(async ({ data }) => {
    try {
      const parsed = structuredSubmissionSchema.safeParse(data);
      if (!parsed.success) {
        console.error({ event: "structured_quote_rejected", stage: "validation" });
        return failed("validation");
      }

      const { snapshot, files, website } = parsed.data;
      const emailInput = publicEmailInput(snapshot);
      const publicValidation = contactSchema.safeParse({
        ...emailInput,
        files: files.map(({ name, type, base64 }) => ({ name, type, base64 })),
        website,
      });
      if (!publicValidation.success) {
        console.error({ event: "structured_quote_rejected", stage: "public_validation" });
        return failed("validation");
      }

      assertSameOrigin(getRequestHeader("origin"), getRequestHeader("host"));
      assertHoneypotEmpty(website);
      const identity = getRequestHeader("cf-connecting-ip")?.trim();
      if (!identity) throw new PublicSubmissionError("rate_limit");
      assertRateLimitAllowed(await checkIsolateRateLimit(`quote|${identity}`));

      const attachments = validateQuoteAttachments(publicValidation.data.files);
      const photos = await buildPhotos(files);
      const osPayload = buildHestivaOsQuotePayload(snapshot, photos);
      const quoteReference = await submitToHestivaOs(osPayload);

      const attachmentSummary = attachments.length
        ? attachments.map((attachment) => `- ${attachment.filename}`).join("\n")
        : "None";
      const emailPackage = buildQuoteEmailPackage({
        name: publicValidation.data.name,
        phone: publicValidation.data.phone,
        email: publicValidation.data.email,
        service: publicValidation.data.service,
        jobType: publicValidation.data.jobType,
        multipleServices: publicValidation.data.multipleServices,
        otherService: publicValidation.data.otherService,
        propertyAddress: publicValidation.data.propertyAddress,
        description: publicValidation.data.description,
        preferredContact: publicValidation.data.preferredContact,
        urgency: publicValidation.data.urgency,
        reference: quoteReference,
        submittedAt: new Date(snapshot.submittedAt).toLocaleString("en-ZA", {
          timeZone: "Africa/Johannesburg",
          dateStyle: "full",
          timeStyle: "short",
        }),
        attachmentSummary,
      });

      try {
        await Promise.all([
          sendEmailViaResend({
            to: "quotes@homent.co.za",
            subject: emailPackage.adminSubject,
            text: emailPackage.adminText,
            html: emailPackage.adminHtml,
            attachments,
          }),
          sendEmailViaResend({
            to: publicValidation.data.email,
            subject: emailPackage.customerSubject,
            text: emailPackage.customerText,
            html: emailPackage.customerHtml,
          }),
        ]);
      } catch {
        throw new PublicSubmissionError("delivery");
      }

      return { success: true as const, quoteReference };
    } catch (error) {
      if (error instanceof PublicSubmissionError) {
        console.error({ event: "structured_quote_rejected", stage: error.category });
        return failed(error.category);
      }
      console.error({ event: "structured_quote_rejected", stage: "unexpected" });
      return failed("unexpected");
    }
  });

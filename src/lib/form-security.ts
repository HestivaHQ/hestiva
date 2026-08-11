import { z } from "zod";

const MAX_ATTACHMENT_BASE64_LENGTH = 14 * 1024 * 1024;
const services = [
  "Request a Quote",
  "General Enquiry",
  "Existing Booking",
  "Service Area Check",
  "Feedback",
  "Residential Cleaning Quote",
  "Regular Home Cleaning",
  "Deep Cleaning",
  "Move-In Cleaning",
  "Move-Out Cleaning",
  "Apartment Cleaning",
  "Kitchen Cleaning",
  "Bathroom Sanitisation",
  "Bedroom Cleaning",
  "Living Area Cleaning",
  "Interior Window Cleaning",
  "Laundry Folding",
  "Eco-Friendly Cleaning",
  "Post-Renovation Cleaning",
  "Add-on Services",
  "Not sure",
] as const;

const fileSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    type: z.string().trim().min(1).max(100),
    base64: z.string().min(1).max(MAX_ATTACHMENT_BASE64_LENGTH),
  })
  .strict();

export const contactSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    phone: z
      .string()
      .trim()
      .min(7)
      .max(30)
      .regex(/^\+?[0-9 ()-]+$/),
    email: z.string().trim().email().max(254),
    service: z.enum(services),
    jobType: z.string().trim().max(80).optional().default(""),
    multipleServices: z.array(z.string().trim().min(1).max(80)).max(20).optional().default([]),
    otherService: z.string().trim().max(500).optional().default(""),
    propertyAddress: z.string().trim().min(2).max(500),
    description: z.string().trim().min(2).max(5000),
    preferredContact: z.enum(["Phone", "Phone Call", "WhatsApp", "Email", "Not specified"]),
    urgency: z.string().trim().min(2).max(50),
    files: z.array(fileSchema).max(10).optional().default([]),
    website: z.string().max(200).optional().default(""),
  })
  .strict();

export type ContactSubmission = z.infer<typeof contactSchema>;

export class PublicSubmissionError extends Error {
  constructor(
    public readonly category: "bot" | "origin" | "rate_limit" | "delivery",
    message = "We could not process your request. Please try again later.",
  ) {
    super(message);
    this.name = "PublicSubmissionError";
  }
}

export function assertHoneypotEmpty(website: string) {
  if (website.trim() !== "") throw new PublicSubmissionError("bot");
}

export function assertSameOrigin(origin: string | undefined, host: string | undefined) {
  if (!origin || !host) throw new PublicSubmissionError("origin");
  try {
    if (new URL(origin).host !== host) throw new PublicSubmissionError("origin");
  } catch (error) {
    if (error instanceof PublicSubmissionError) throw error;
    throw new PublicSubmissionError("origin");
  }
}

export function assertRateLimitAllowed(allowed: boolean) {
  if (!allowed) {
    throw new PublicSubmissionError(
      "rate_limit",
      "We could not process your request. Please wait and try again later.",
    );
  }
}

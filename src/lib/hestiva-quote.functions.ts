import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { sendEmailViaResend } from "@/lib/quote/email-service";

const optionalText = z.string().trim().max(2000);

const quoteSchema = z.object({
  propertyType: z.string().trim().min(1).max(100),
  suburb: z.string().trim().min(1).max(150),
  address: z.string().trim().min(1).max(500),
  floorSize: z.string().trim().min(1).max(100),
  bedrooms: z.string().trim().min(1).max(50),
  bathrooms: z.string().trim().min(1).max(50),
  livingAreas: optionalText,
  storeys: optionalText,
  outdoor: optionalText,
  estate: optionalText,
  service: z.string().trim().min(1).max(150),
  frequency: z.string().trim().min(1).max(100),
  condition: z.string().trim().min(1).max(150),
  addons: z.array(z.string().trim().max(100)).max(20),
  preferredDate: z.string().trim().min(1).max(30),
  alternativeDate: optionalText,
  preferredTime: z.string().trim().min(1).max(100),
  flexibility: optionalText,
  urgency: optionalText,
  recurringNotes: optionalText,
  complexAccess: optionalText,
  securityInstructions: optionalText,
  parking: optionalText,
  keyHandover: optionalText,
  present: optionalText,
  pets: optionalText,
  petType: optionalText,
  petTemperament: optionalText,
  cameras: optionalText,
  offLimits: optionalText,
  fragileItems: optionalText,
  restrictions: optionalText,
  allergies: optionalText,
  attentionAreas: optionalText,
  existingDamage: optionalText,
  renovationDust: optionalText,
  applianceAddons: optionalText,
  notes: z.string().trim().max(5000),
  fullName: z.string().trim().min(2).max(150),
  mobile: z.string().trim().min(7).max(30),
  email: z.string().trim().email().max(254),
  contactMethod: z.string().trim().min(1).max(50),
  consent: z.literal(true),
  website: z.string().max(200),
  elapsedMs: z.number().int().min(0).max(86_400_000),
});

type Quote = z.infer<typeof quoteSchema>;

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
      })[character] ?? character,
  );
}

function value(value: string) {
  return value || "Not provided";
}

function section(title: string, rows: Array<[string, string]>) {
  const text = [
    title.toUpperCase(),
    ...rows.map(([label, content]) => `${label}: ${value(content)}`),
  ].join("\n");
  const htmlRows = rows
    .map(
      ([label, content]) =>
        `<tr><th align="left" style="padding:8px;border-bottom:1px solid #eadfd5;vertical-align:top">${escapeHtml(label)}</th><td style="padding:8px;border-bottom:1px solid #eadfd5;white-space:pre-wrap">${escapeHtml(value(content))}</td></tr>`,
    )
    .join("");
  return {
    text,
    html: `<h2 style="color:#5a1425">${escapeHtml(title)}</h2><table style="width:100%;border-collapse:collapse">${htmlRows}</table>`,
  };
}

function buildEmail(quote: Quote, submittedAt: string) {
  const sections = [
    section("Customer details", [
      ["Name", quote.fullName],
      ["Mobile", quote.mobile],
      ["Email", quote.email],
      ["Preferred contact", quote.contactMethod],
    ]),
    section("Property details", [
      ["Property type", quote.propertyType],
      ["Address", quote.address],
      ["Suburb", quote.suburb],
      ["Estate or complex", quote.estate],
      ["Floor size", quote.floorSize],
      ["Bedrooms", quote.bedrooms],
      ["Bathrooms", quote.bathrooms],
      ["Living areas", quote.livingAreas],
      ["Storeys", quote.storeys],
      ["Outdoor area", quote.outdoor],
    ]),
    section("Cleaning requirements", [
      ["Primary service", quote.service],
      ["Frequency", quote.frequency],
      ["Condition", quote.condition],
      ["Recurring notes", quote.recurringNotes],
      ["Areas needing attention", quote.attentionAreas],
      ["Existing damage", quote.existingDamage],
      ["Renovation dust", quote.renovationDust],
      ["Appliance add-ons", quote.applianceAddons],
    ]),
    section("Selected add-ons", [["Add-ons", quote.addons.join(", ") || "None selected"]]),
    section("Preferred dates and times", [
      ["Preferred date", quote.preferredDate],
      ["Alternative date", quote.alternativeDate],
      ["Preferred time", quote.preferredTime],
      ["Flexibility", quote.flexibility],
      ["Urgency", quote.urgency],
    ]),
    section("Access and household information", [
      ["Complex access", quote.complexAccess],
      ["Security or gate instructions", quote.securityInstructions],
      ["Parking", quote.parking],
      ["Key handover", quote.keyHandover],
      ["Someone present", quote.present],
      ["Pets", quote.pets],
      ["Pet type", quote.petType],
      ["Pet temperament", quote.petTemperament],
      ["Cameras", quote.cameras],
      ["Off-limits areas", quote.offLimits],
      ["Fragile surfaces/items", quote.fragileItems],
      ["Product restrictions", quote.restrictions],
      ["Allergies/sensitivities", quote.allergies],
    ]),
    section("Notes", [
      ["Additional notes", quote.notes],
      ["Photos", "Not submitted (photo uploads are not yet supported)"],
    ]),
    section("Submission", [["Timestamp", submittedAt]]),
  ];
  return {
    subject: `New Hestiva Quote Request — ${quote.fullName} — ${quote.suburb}`,
    text: sections.map(({ text }) => text).join("\n\n"),
    html: `<div style="font-family:Arial,sans-serif;color:#342c2a;max-width:760px;margin:auto"><h1 style="color:#5a1425">New Hestiva Quote Request</h1>${sections.map(({ html }) => html).join("")}</div>`,
  };
}

export const submitHestivaQuote = createServerFn({ method: "POST" })
  .validator((input) => quoteSchema.parse(input))
  .handler(async ({ data }) => {
    if (data.website || data.elapsedMs < 3000) throw new Error("Submission could not be accepted.");

    const sender = process.env.HESTIVA_QUOTE_FROM_EMAIL?.trim();
    if (!sender) throw new Error("Quote email service is not configured.");

    const submittedAt = new Date().toISOString();
    const email = buildEmail(data, submittedAt);
    await sendEmailViaResend({
      from: sender,
      replyTo: data.email,
      to: "quotes@hestiva.co.za",
      ...email,
    });
    return { success: true, submittedAt };
  });

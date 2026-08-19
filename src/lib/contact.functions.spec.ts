import { describe, expect, it } from "@jest/globals";
import type { ContactSubmission } from "@/lib/form-security";
import { buildWebsiteEnquiryPayload } from "@/lib/contact.functions";

const submission: ContactSubmission = {
  name: "Example Customer",
  phone: "+27 82 000 0000",
  email: "customer@example.com",
  service: "General Enquiry",
  jobType: "",
  multipleServices: [],
  otherService: "",
  propertyAddress: "Orange Farm",
  description: "Please contact me about your services.",
  preferredContact: "WhatsApp",
  urgency: "Not specified",
  files: [],
  website: "",
};

describe("buildWebsiteEnquiryPayload", () => {
  it("maps the current contact form to website-enquiry.v1 without extra fields", () => {
    expect(
      buildWebsiteEnquiryPayload(
        submission,
        "2eaa0a85-3480-4c6d-8db2-04cfefb451ec",
        "2026-08-19T07:00:00.000Z",
      ),
    ).toEqual({
      schemaVersion: "website-enquiry.v1",
      submissionId: "2eaa0a85-3480-4c6d-8db2-04cfefb451ec",
      submittedAt: "2026-08-19T07:00:00.000Z",
      name: "Example Customer",
      phone: "+27 82 000 0000",
      email: "customer@example.com",
      enquiryType: "General Enquiry",
      propertyAddress: "Orange Farm",
      description: "Please contact me about your services.",
      preferredContact: "WhatsApp",
    });
  });
});

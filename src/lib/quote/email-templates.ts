export type QuoteEmailData = {
  name: string;
  phone: string;
  email: string;
  service: string;
  jobType: string;
  multipleServices: string[];
  otherService: string;
  propertyAddress: string;
  description: string;
  preferredContact: string;
  urgency: string;
  reference: string;
  submittedAt: string;
  attachmentSummary: string;
};

export type QuoteEmailPackage = {
  adminSubject: string;
  adminText: string;
  adminHtml: string;
  customerSubject: string;
  customerText: string;
  customerHtml: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function nl2br(value: string) {
  return escapeHtml(value).replace(/\n/g, "<br />");
}

function toSouthAfricanInternationalNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("27")) return digits;
  if (digits.startsWith("0") && digits.length >= 10) return `27${digits.slice(1)}`;
  if (digits.length === 9) return `27${digits}`;

  return digits;
}

function buildClientChatUrl(phone: string, reference: string) {
  const number = toSouthAfricanInternationalNumber(phone);
  const message = `Hi, we received your Homent quote request ${reference}. We would like to confirm a few details.`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function detailRow(label: string, value: string) {
  return `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #eadfd5;color:#7a675d;font-size:13px;width:34%;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #eadfd5;color:#351019;font-size:14px;font-weight:600;vertical-align:top;">${nl2br(value || "Not provided")}</td>
    </tr>`;
}

function clickableRow(label: string, value: string, href: string) {
  return `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #eadfd5;color:#7a675d;font-size:13px;width:34%;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #eadfd5;color:#351019;font-size:14px;font-weight:600;vertical-align:top;">
        <a href="${escapeHtml(href)}" style="color:#8b5e2f;text-decoration:none;font-weight:700;">${escapeHtml(value || "Open chat")}</a>
      </td>
    </tr>`;
}

function emailShell(title: string, preheader: string, body: string) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f6f0e7;font-family:Arial,Helvetica,sans-serif;color:#351019;">
    <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">${escapeHtml(preheader)}</span>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f0e7;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:720px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #eadfd5;">
            <tr>
              <td style="background:#3b0d16;color:#ffffff;padding:22px 26px;">
                <div style="font-size:12px;letter-spacing:1.8px;text-transform:uppercase;color:#d5ac62;font-weight:700;">Homent</div>
                <h1 style="margin:8px 0 0;font-size:24px;line-height:1.25;">${escapeHtml(title)}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:26px;">${body}</td>
            </tr>
            <tr>
              <td style="padding:18px 26px;background:#fbf8f3;border-top:1px solid #eadfd5;color:#7a675d;font-size:12px;line-height:1.6;">
                Homent (Pty) Ltd<br />
                Grace in Every Detail.<br />
                Website: www.hestiva.co.za | Email: quotes@hestiva.co.za | Phone: 076 781 6550
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function getServiceDisplay(data: Pick<QuoteEmailData, "service" | "jobType" | "multipleServices" | "otherService">) {
  if (data.service === "Multiple Services Required" && data.multipleServices.length) {
    return `${data.service} (${data.multipleServices.join(", ")})`;
  }

  if (data.service === "Other (Please Describe)" && data.otherService) {
    return `${data.service}: ${data.otherService}`;
  }

  return data.service;
}

export function buildQuoteEmailPackage(data: QuoteEmailData): QuoteEmailPackage {
  const serviceDisplay = getServiceDisplay(data);
  const clientChatUrl = buildClientChatUrl(data.phone, data.reference);

  const adminSubject = `New Homent Quote Request ${data.reference} - ${data.name}`;
  const adminText = [
    "NEW HOMENT WEBSITE QUOTE REQUEST",
    "",
    `Reference Number: ${data.reference}`,
    `Submitted: ${data.submittedAt}`,
    "",
    "CLIENT DETAILS",
    `Full Name: ${data.name}`,
    `Phone Number: ${data.phone}`,
    `Chat Link: ${clientChatUrl}`,
    `Email Address: ${data.email}`,
    `Preferred Contact Method: ${data.preferredContact}`,
    "",
    "JOB DETAILS",
    `Service Required: ${serviceDisplay}`,
    data.jobType ? `Job Type: ${data.jobType}` : null,
    `Urgency: ${data.urgency}`,
    `Property Address: ${data.propertyAddress}`,
    "",
    "DESCRIPTION",
    data.description,
    "",
    "UPLOADED FILES",
    data.attachmentSummary,
    "",
    "NEXT STEP",
    "Contact the client, confirm the requirements, and arrange the quotation or site assessment.",
  ].filter(Boolean).join("\n");

  const adminHtml = emailShell(
    `New Quote Request ${data.reference}`,
    `New Homent website quote request from ${data.name}`,
    `
      <p style="margin:0 0 18px;color:#55443c;font-size:15px;line-height:1.6;">A new quote request was submitted through the Homent website.</p>
      <div style="background:#fff8e8;border:1px solid #d5ac62;border-radius:10px;padding:14px 16px;margin-bottom:20px;">
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:1.4px;color:#8b5e2f;font-weight:700;">Reference Number</div>
        <div style="font-size:22px;color:#351019;font-weight:800;margin-top:4px;">${escapeHtml(data.reference)}</div>
      </div>
      <div style="margin-bottom:20px;">
        <a href="${escapeHtml(clientChatUrl)}" style="display:inline-block;background:#238636;color:#ffffff;text-decoration:none;font-weight:700;border-radius:8px;padding:11px 16px;font-size:14px;">Message Client</a>
      </div>
      <h2 style="font-size:16px;margin:22px 0 8px;color:#351019;">Client Details</h2>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #eadfd5;border-radius:10px;overflow:hidden;border-collapse:separate;">
        ${detailRow("Full Name", data.name)}
        ${clickableRow("Phone / Chat", data.phone, clientChatUrl)}
        ${detailRow("Email Address", data.email)}
        ${detailRow("Preferred Contact", data.preferredContact)}
      </table>
      <h2 style="font-size:16px;margin:22px 0 8px;color:#351019;">Job Details</h2>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #eadfd5;border-radius:10px;overflow:hidden;border-collapse:separate;">
        ${detailRow("Service Required", serviceDisplay)}
        ${data.jobType ? detailRow("Job Type", data.jobType) : ""}
        ${detailRow("Urgency", data.urgency)}
        ${detailRow("Property Address", data.propertyAddress)}
        ${detailRow("Description", data.description)}
        ${detailRow("Uploaded Files", data.attachmentSummary)}
        ${detailRow("Submitted", data.submittedAt)}
      </table>`,
  );

  const customerSubject = `Quote Request Received ${data.reference} - Homent`;
  const customerText = [
    `Hi ${data.name},`,
    "",
    "Thank you for contacting Homent.",
    "",
    "We have received your quote request and our team will review the details.",
    `Reference Number: ${data.reference}`,
    "",
    "YOUR REQUEST SUMMARY",
    `Service: ${serviceDisplay}`,
    data.jobType ? `Job Type: ${data.jobType}` : null,
    `Urgency: ${data.urgency}`,
    `Preferred Contact: ${data.preferredContact}`,
    `Property Address: ${data.propertyAddress}`,
    "",
    "Our team will contact you to confirm the details and advise on the next step.",
    "",
    "Contact Number: 076 781 6550",
    "Email: quotes@hestiva.co.za",
    "Website: www.hestiva.co.za",
    "",
    "Kind regards,",
    "The Homent Team",
  ].filter(Boolean).join("\n");

  const customerHtml = emailShell(
    "Quote Request Received",
    `Your quote request ${data.reference} was received by Homent.`,
    `
      <p style="margin:0 0 14px;color:#55443c;font-size:15px;line-height:1.6;">Hi ${escapeHtml(data.name)},</p>
      <p style="margin:0 0 18px;color:#55443c;font-size:15px;line-height:1.6;">Thank you for contacting Homent. We have received your quote request and our team will review the details.</p>
      <div style="background:#fff8e8;border:1px solid #d5ac62;border-radius:10px;padding:14px 16px;margin-bottom:20px;">
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:1.4px;color:#8b5e2f;font-weight:700;">Reference Number</div>
        <div style="font-size:22px;color:#351019;font-weight:800;margin-top:4px;">${escapeHtml(data.reference)}</div>
      </div>
      <h2 style="font-size:16px;margin:22px 0 8px;color:#351019;">Request Summary</h2>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #eadfd5;border-radius:10px;overflow:hidden;border-collapse:separate;">
        ${detailRow("Service", serviceDisplay)}
        ${data.jobType ? detailRow("Job Type", data.jobType) : ""}
        ${detailRow("Urgency", data.urgency)}
        ${detailRow("Preferred Contact", data.preferredContact)}
        ${detailRow("Property Address", data.propertyAddress)}
      </table>
      <div style="margin-top:22px;background:#fbf8f3;border:1px solid #eadfd5;border-radius:10px;padding:14px 16px;color:#55443c;font-size:14px;line-height:1.6;">
        <strong>What happens next:</strong><br />
        Our team will contact you to confirm the details and advise on the next step.
      </div>`,
  );

  return { adminSubject, adminText, adminHtml, customerSubject, customerText, customerHtml };
}

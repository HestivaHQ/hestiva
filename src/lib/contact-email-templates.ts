export type ContactEmailData = {
  name: string;
  phone: string;
  email: string;
  enquiryType: string;
  suburb: string;
  description: string;
  preferredContact: string;
  reference: string;
  submittedAt: string;
};

export type ContactEmailPackage = {
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

function detailRow(label: string, value: string) {
  return `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #eadfd5;color:#7a675d;font-size:13px;width:34%;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #eadfd5;color:#351019;font-size:14px;font-weight:600;vertical-align:top;">${escapeHtml(value || "Not provided")}</td>
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
            <tr><td style="padding:26px;">${body}</td></tr>
            <tr>
              <td style="padding:18px 26px;background:#fbf8f3;border-top:1px solid #eadfd5;color:#7a675d;font-size:12px;line-height:1.6;">
                Homent (Pty) Ltd<br />
                Grace in Every Detail.<br />
                Website: www.homent.co.za | Email: info@homent.co.za | Phone: 068 423 1614
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function buildContactEmailPackage(data: ContactEmailData): ContactEmailPackage {
  const adminSubject = `New Homent Enquiry ${data.reference} - ${data.name}`;
  const adminText = [
    "NEW HOMENT WEBSITE ENQUIRY",
    "",
    `Reference Number: ${data.reference}`,
    `Submitted: ${data.submittedAt}`,
    "",
    `Full Name: ${data.name}`,
    `Phone Number: ${data.phone}`,
    `Email Address: ${data.email}`,
    `Preferred Contact Method: ${data.preferredContact}`,
    `Enquiry Type: ${data.enquiryType}`,
    `Suburb: ${data.suburb}`,
    "",
    "MESSAGE",
    data.description,
    "",
    "NEXT STEP",
    "Review the enquiry and respond using the customer's preferred contact method.",
  ].join("\n");

  const adminHtml = emailShell(
    `New Enquiry ${data.reference}`,
    `New Homent website enquiry from ${data.name}`,
    `
      <p style="margin:0 0 18px;color:#55443c;font-size:15px;line-height:1.6;">A new enquiry was submitted through the Homent website.</p>
      <div style="background:#fff8e8;border:1px solid #d5ac62;border-radius:10px;padding:14px 16px;margin-bottom:20px;">
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:1.4px;color:#8b5e2f;font-weight:700;">Reference Number</div>
        <div style="font-size:22px;color:#351019;font-weight:800;margin-top:4px;">${escapeHtml(data.reference)}</div>
      </div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #eadfd5;border-radius:10px;overflow:hidden;border-collapse:separate;">
        ${detailRow("Full Name", data.name)}
        ${detailRow("Phone", data.phone)}
        ${detailRow("Email", data.email)}
        ${detailRow("Preferred Contact", data.preferredContact)}
        ${detailRow("Enquiry Type", data.enquiryType)}
        ${detailRow("Suburb", data.suburb)}
        ${detailRow("Message", data.description)}
        ${detailRow("Submitted", data.submittedAt)}
      </table>`,
  );

  const customerSubject = `Enquiry Received ${data.reference} - Homent`;
  const customerText = [
    `Hi ${data.name},`,
    "",
    "Thank you for contacting Homent.",
    "",
    "We have received your enquiry and our team will review it.",
    `Reference Number: ${data.reference}`,
    "",
    "YOUR ENQUIRY SUMMARY",
    `Enquiry Type: ${data.enquiryType}`,
    `Preferred Contact: ${data.preferredContact}`,
    `Suburb: ${data.suburb}`,
    "",
    "Our team will contact you with the next step during normal business hours.",
    "",
    "Contact Number: 068 423 1614",
    "Email: info@homent.co.za",
    "Website: www.homent.co.za",
    "",
    "Kind regards,",
    "The Homent Team",
  ].join("\n");

  const customerHtml = emailShell(
    "Enquiry Received",
    `Your enquiry ${data.reference} was received by Homent.`,
    `
      <p style="margin:0 0 14px;color:#55443c;font-size:15px;line-height:1.6;">Hi ${escapeHtml(data.name)},</p>
      <p style="margin:0 0 18px;color:#55443c;font-size:15px;line-height:1.6;">Thank you for contacting Homent. We have received your enquiry and our team will review it.</p>
      <div style="background:#fff8e8;border:1px solid #d5ac62;border-radius:10px;padding:14px 16px;margin-bottom:20px;">
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:1.4px;color:#8b5e2f;font-weight:700;">Reference Number</div>
        <div style="font-size:22px;color:#351019;font-weight:800;margin-top:4px;">${escapeHtml(data.reference)}</div>
      </div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #eadfd5;border-radius:10px;overflow:hidden;border-collapse:separate;">
        ${detailRow("Enquiry Type", data.enquiryType)}
        ${detailRow("Preferred Contact", data.preferredContact)}
        ${detailRow("Suburb", data.suburb)}
      </table>
      <div style="margin-top:14px;background:#fbf8f3;border:1px solid #eadfd5;border-radius:10px;padding:14px 16px;color:#55443c;font-size:14px;line-height:1.6;">
        <strong>What happens next:</strong><br />
        Our team will review your enquiry and contact you during normal business hours.
      </div>`,
  );

  return { adminSubject, adminText, adminHtml, customerSubject, customerText, customerHtml };
}

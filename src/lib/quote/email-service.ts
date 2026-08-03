export type QuoteAttachment = {
  filename: string;
  content: string;
  contentType: string;
};

export type OutboundEmail = {
  to: string;
  subject: string;
  text: string;
  html: string;
  attachments?: QuoteAttachment[];
};

function getResendApiKey(): string {
  const key = process.env.RESEND_API_KEY;

  if (!key || key.trim() === "") {
    throw new Error("Email service not configured");
  }

  return key;
}

export async function sendEmailViaResend(email: OutboundEmail) {
  const emailPayload: Record<string, unknown> = {
    from: "Hestiva <quotes@hestiva.co.za>",
    reply_to: "quotes@hestiva.co.za",
    to: email.to,
    subject: email.subject,
    text: email.text,
    html: email.html,
  };

  if (email.attachments && email.attachments.length > 0) {
    emailPayload.attachments = email.attachments.map((attachment) => ({
      filename: attachment.filename,
      content: attachment.content,
      content_type: attachment.contentType,
    }));
  }

  let response: Response;

  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getResendApiKey()}`,
      },
      body: JSON.stringify(emailPayload),
    });
  } catch (fetchErr) {
    console.error(`Fetch error sending email to ${email.to}:`, fetchErr);
    throw new Error(`Network error contacting email provider: ${String(fetchErr)}`);
  }

  let responseBody = "";

  try {
    responseBody = await response.text();
  } catch (textErr) {
    console.error("Failed to read email provider response body:", textErr);
    responseBody = "(unable to read response)";
  }

  if (!response.ok) {
    console.error(
      `Email provider error for ${email.to}: status=${response.status}, response=${responseBody}`,
    );
    throw new Error(`Email delivery failed: ${response.status} - ${responseBody}`);
  }

  try {
    return JSON.parse(responseBody);
  } catch {
    return { success: true };
  }
}

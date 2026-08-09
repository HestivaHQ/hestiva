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

export class EmailServiceError extends Error {
  constructor(readonly category: "missing_runtime_configuration" | "provider_failure") {
    super("Email delivery failed");
    this.name = "EmailServiceError";
  }
}

function getResendApiKey(): string {
  const key = process.env.RESEND_API_KEY;

  if (!key || key.trim() === "") {
    throw new EmailServiceError("missing_runtime_configuration");
  }

  return key;
}

export async function sendEmailViaResend(email: OutboundEmail) {
  const emailPayload: Record<string, unknown> = {
    from: "Hestiva Quotes <quotes@hestiva.co.za>",
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
  } catch {
    throw new EmailServiceError("provider_failure");
  }

  if (!response.ok) {
    console.error("email_provider_rejected", { status: response.status });
    throw new EmailServiceError("provider_failure");
  }

  try {
    return await response.json();
  } catch {
    return { success: true };
  }
}

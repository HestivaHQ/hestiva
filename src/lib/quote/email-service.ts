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

const PROVIDER_TIMEOUT_MS = 10_000;

export async function sendEmailViaResend(
  email: OutboundEmail,
  fetchImplementation: typeof fetch = fetch,
  timeoutMs = PROVIDER_TIMEOUT_MS,
) {
  const emailPayload: Record<string, unknown> = {
    from: "Homent Quotes <quotes@homent.co.za>",
    reply_to: "quotes@homent.co.za",
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
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    response = await fetchImplementation("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getResendApiKey()}`,
      },
      body: JSON.stringify(emailPayload),
      signal: controller.signal,
    });
  } catch (fetchErr) {
    console.error({
      event: "email_provider_failure",
      stage: "request",
      category: "network_or_timeout",
    });
    throw new Error("Email provider request failed");
  } finally {
    clearTimeout(timeout);
  }

  let responseBody = "";

  try {
    responseBody = await response.text();
  } catch (textErr) {
    console.error({
      event: "email_provider_failure",
      stage: "response",
      category: "unreadable_body",
    });
    responseBody = "(unable to read response)";
  }

  if (!response.ok) {
    console.error({
      event: "email_provider_failure",
      stage: "response",
      statusCategory: `${Math.floor(response.status / 100)}xx`,
    });
    throw new Error("Email provider rejected the request");
  }

  try {
    return JSON.parse(responseBody);
  } catch {
    return { success: true };
  }
}

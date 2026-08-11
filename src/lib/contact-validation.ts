const PHONE_FORMAT = /^\+?[0-9 ()-]+$/;
const EMAIL_LOCAL = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/;
const DOMAIN_LABEL = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/;

export function isValidPhoneNumber(value: string) {
  const input = value.trim();
  if (!input || input.length > 30 || !PHONE_FORMAT.test(input)) return false;

  const compact = input.replace(/[ ()-]/g, "");
  if (/^0\d{9}$/.test(compact)) return true;
  return /^\+[1-9]\d{7,14}$/.test(compact);
}

export function isValidEmailAddress(value: string) {
  const email = value.trim();
  if (!email || email.length > 254 || /\s/.test(email)) return false;

  const at = email.lastIndexOf("@");
  if (at <= 0 || at !== email.indexOf("@")) return false;

  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  if (!local || local.length > 64 || !EMAIL_LOCAL.test(local)) return false;
  if (local.startsWith(".") || local.endsWith(".") || local.includes("..")) return false;

  const labels = domain.split(".");
  if (labels.length < 2 || labels.some((label) => !DOMAIN_LABEL.test(label))) return false;
  return labels.at(-1)!.length >= 2;
}

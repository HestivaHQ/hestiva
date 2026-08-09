import { PublicSubmissionError } from "@/lib/form-security";

const WINDOW_MS = 60_000;
const MAX_SUBMISSIONS = 5;
const requests = new Map<string, number[]>();

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function assertRateLimit(identity: string) {
  const identityHash = await sha256Hex(`${identity || "unknown"}|hestiva-public-form`);
  const now = Date.now();
  const recent = (requests.get(identityHash) ?? []).filter(
    (timestamp) => now - timestamp < WINDOW_MS,
  );

  if (recent.length >= MAX_SUBMISSIONS) {
    throw new PublicSubmissionError("rate_limit", "rate_limited");
  }

  recent.push(now);
  requests.set(identityHash, recent);
}

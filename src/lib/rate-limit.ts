const WINDOW_MS = 15 * 60 * 1000;
const MAX_SUBMISSIONS = 5;
const buckets = new Map<string, { count: number; resetsAt: number }>();
const isolateSalt = crypto.randomUUID();

async function hashIdentity(identity: string) {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`${isolateSalt}|${identity}`),
  );
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * A best-effort, per-Worker-isolate throttle. It is intentionally not described as a distributed
 * limit: Cloudflare may route requests to another isolate. The identity must be Cloudflare's
 * injected CF-Connecting-IP value, never a client-controlled forwarding header.
 */
export async function checkIsolateRateLimit(identity: string, now = Date.now()) {
  const key = await hashIdentity(identity);
  const current = buckets.get(key);

  if (!current || current.resetsAt <= now) {
    buckets.set(key, { count: 1, resetsAt: now + WINDOW_MS });
    return true;
  }

  if (current.count >= MAX_SUBMISSIONS) return false;
  current.count += 1;
  return true;
}

export const rateLimitPolicy = { maxSubmissions: MAX_SUBMISSIONS, windowMs: WINDOW_MS } as const;

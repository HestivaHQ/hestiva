import { createServerFn } from "@tanstack/react-start";

async function secretFingerprint(secret: string) {
  const bytes = new TextEncoder().encode(secret);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 12);
}

export const checkHestivaOsIntegrationHealth = createServerFn({ method: "GET" }).handler(
  async () => {
    const baseUrl = process.env.HESTIVA_OS_API_URL?.trim().replace(/\/$/, "");
    const secret = process.env.HESTIVA_WEBSITE_INTEGRATION_SECRET?.trim();
    if (!baseUrl || !secret) {
      console.error({
        event: "hestiva_os_integration_health_failed",
        stage: "configuration",
      });
      return { ok: false as const };
    }

    const localFingerprint = await secretFingerprint(secret);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5_000);

    try {
      const response = await fetch(`${baseUrl}/api/v1/integrations/website/health`, {
        method: "GET",
        headers: { authorization: `Bearer ${secret}` },
        signal: controller.signal,
      });

      if (!response.ok) {
        console.error({
          event: "hestiva_os_integration_health_failed",
          stage: "response",
          status: response.status,
          secretFingerprint: localFingerprint,
        });
        return { ok: false as const };
      }

      const result = (await response.json()) as {
        ok?: unknown;
        secretFingerprint?: unknown;
      };
      const remoteFingerprint =
        typeof result.secretFingerprint === "string" ? result.secretFingerprint : "missing";
      const ok = result.ok === true && remoteFingerprint === localFingerprint;

      if (!ok) {
        console.error({
          event: "hestiva_os_integration_health_failed",
          stage: "fingerprint_mismatch",
          secretFingerprint: localFingerprint,
          remoteFingerprint,
        });
        return { ok: false as const };
      }

      console.info({
        event: "hestiva_os_integration_health_ok",
        secretFingerprint: localFingerprint,
      });
      return { ok: true as const };
    } catch {
      console.error({
        event: "hestiva_os_integration_health_failed",
        stage: "network",
        secretFingerprint: localFingerprint,
      });
      return { ok: false as const };
    } finally {
      clearTimeout(timer);
    }
  },
);

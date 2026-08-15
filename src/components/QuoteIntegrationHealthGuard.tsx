import { useEffect } from "react";
import { checkHestivaOsIntegrationHealth } from "@/lib/quote/integration-health.functions";

export function QuoteIntegrationHealthGuard() {
  useEffect(() => {
    if (window.location.pathname !== "/quote") return;

    let integrationHealthy: boolean | undefined;
    let disposed = false;
    let rechecking = false;

    const check = async () => {
      try {
        const result = await checkHestivaOsIntegrationHealth();
        const healthy = result?.ok === true;
        if (!disposed) integrationHealthy = healthy;
        return healthy;
      } catch {
        if (!disposed) integrationHealthy = false;
        return false;
      }
    };

    const onClick = (event: MouseEvent) => {
      if (integrationHealthy !== false || rechecking) return;
      const button = (event.target as HTMLElement | null)?.closest(
        "button",
      ) as HTMLButtonElement | null;
      if (!button?.textContent?.includes("Send Request")) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      rechecking = true;
      const originalText = button.textContent;
      button.disabled = true;
      button.textContent = "Checking connection…";

      void check().then((healthy) => {
        rechecking = false;
        button.disabled = false;
        button.textContent = originalText || "Send Request";
        if (healthy) {
          button.click();
          return;
        }
        window.alert(
          "Our quotation system is temporarily unavailable. Your request has not been sent. Please try again shortly. Error code: Q-INTEGRATION-HEALTH.",
        );
      });
    };

    void check();
    document.addEventListener("click", onClick, true);

    return () => {
      disposed = true;
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}

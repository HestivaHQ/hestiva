import { useEffect } from "react";
import { checkHestivaOsIntegrationHealth } from "@/lib/quote/integration-health.functions";

export function QuoteIntegrationHealthGuard() {
  useEffect(() => {
    if (window.location.pathname !== "/quote") return;

    let integrationHealthy: boolean | undefined;
    let disposed = false;

    const check = async () => {
      try {
        const result = await checkHestivaOsIntegrationHealth();
        if (!disposed) integrationHealthy = result?.ok === true;
      } catch {
        if (!disposed) integrationHealthy = false;
      }
    };

    const onClick = (event: MouseEvent) => {
      if (integrationHealthy !== false) return;
      const button = (event.target as HTMLElement | null)?.closest(
        "button",
      ) as HTMLButtonElement | null;
      if (!button?.textContent?.includes("Send Request")) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      window.alert(
        "Our quotation system is temporarily unavailable. Your request has not been sent. Please try again shortly. Error code: Q-INTEGRATION-HEALTH.",
      );
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

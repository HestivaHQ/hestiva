import { useEffect, useState } from "react";
import { runServerFunctionProbe } from "@/lib/server-function-probe.functions";

export function ServerFunctionProbe() {
  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] = useState<"idle" | "running" | "passed" | "failed">("idle");
  const [detail, setDetail] = useState("Not run yet.");

  useEffect(() => {
    setEnabled(new URLSearchParams(window.location.search).get("serverFnProbe") === "1");
  }, []);

  if (!enabled) return null;

  async function runProbe() {
    setStatus("running");
    setDetail("Calling minimal TanStack server function…");

    try {
      const result = await runServerFunctionProbe();

      if (result?.ok === true && result.marker === "hestiva-server-function-runtime") {
        setStatus("passed");
        setDetail("PASS: the minimal TanStack server function executed and returned successfully.");
        return;
      }

      setStatus("failed");
      setDetail(`FAIL: unexpected result ${JSON.stringify(result)}`);
    } catch (error) {
      setStatus("failed");
      setDetail(`FAIL: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return (
    <aside className="fixed bottom-4 right-4 z-[200] w-[min(28rem,calc(100vw-2rem))] rounded-lg border bg-white p-5 shadow-2xl">
      <h2 className="text-lg font-semibold">Server Function Runtime Probe</h2>
      <p className="mt-2 text-sm leading-6">
        Temporary diagnostic. No secrets, customer data, or external requests are used.
      </p>
      <button
        type="button"
        onClick={runProbe}
        disabled={status === "running"}
        className="mt-4 rounded-md border px-4 py-2 font-semibold disabled:opacity-60"
      >
        {status === "running" ? "Running…" : "Run server function probe"}
      </button>
      <pre className="mt-4 whitespace-pre-wrap rounded-md border p-3 text-xs">{detail}</pre>
    </aside>
  );
}

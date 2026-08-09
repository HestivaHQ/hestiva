import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { runServerFunctionProbe } from "@/lib/server-function-probe.functions";

export const Route = createFileRoute("/server-function-probe")({
  component: ServerFunctionProbePage,
});

function ServerFunctionProbePage() {
  const [status, setStatus] = useState<"idle" | "running" | "passed" | "failed">("idle");
  const [detail, setDetail] = useState("Not run yet.");

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
    <main className="mx-auto max-w-2xl px-6 py-16 font-sans">
      <h1 className="text-3xl font-semibold">Server Function Runtime Probe</h1>
      <p className="mt-4 leading-7">
        Temporary diagnostic page. It calls a minimal TanStack server function that reads no
        secrets, accepts no customer data, and performs no external requests.
      </p>
      <button
        type="button"
        onClick={runProbe}
        disabled={status === "running"}
        className="mt-8 rounded-md border px-5 py-3 font-semibold disabled:opacity-60"
      >
        {status === "running" ? "Running…" : "Run server function probe"}
      </button>
      <pre className="mt-6 whitespace-pre-wrap rounded-md border p-4">{detail}</pre>
    </main>
  );
}

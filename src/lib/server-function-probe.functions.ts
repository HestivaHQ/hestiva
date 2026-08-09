import { createServerFn } from "@tanstack/react-start";

export const runServerFunctionProbe = createServerFn({ method: "POST" }).handler(async () => ({
  ok: true as const,
  marker: "hestiva-server-function-runtime" as const,
}));

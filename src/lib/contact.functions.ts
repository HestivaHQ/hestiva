import { createServerFn } from "@tanstack/react-start";

export const submitContactForm = createServerFn({ method: "POST" })
  .validator((data: unknown) => data)
  .handler(async () => ({
    success: false as const,
    diagnosticStage: "minimal_contact_function" as const,
  }));

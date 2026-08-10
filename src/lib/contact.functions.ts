import { createServerFn } from "@tanstack/react-start";
import { contactSchema } from "@/lib/form-security";

export const submitContactForm = createServerFn({ method: "POST" })
  .validator((data: unknown) => data)
  .handler(async () => ({
    success: false as const,
    diagnosticStage:
      typeof contactSchema.safeParse === "function"
        ? ("form_security_loaded" as const)
        : ("form_security_missing" as const),
  }));

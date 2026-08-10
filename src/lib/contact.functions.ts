import { createServerFn } from "@tanstack/react-start";
import { contactSchema } from "@/lib/form-security";
import { rateLimitPolicy } from "@/lib/rate-limit";

export const submitContactForm = createServerFn({ method: "POST" })
  .validator((data: unknown) => data)
  .handler(async () => ({
    success: false as const,
    diagnosticStage:
      typeof contactSchema.safeParse === "function" && rateLimitPolicy.maxSubmissions === 5
        ? ("rate_limit_loaded" as const)
        : ("rate_limit_missing" as const),
  }));

import { useEffect } from "react";

export function ContactHoneypotGuard() {
  useEffect(() => {
    if (window.location.pathname !== "/contact") return;

    const honeypot = document.querySelector<HTMLInputElement>('input[name="website"]');
    if (!honeypot) return;

    // Chrome/profile managers can treat a field named "website" as profile data even when it is
    // visually off-screen. Clear only the initial autofill value, then make the trap read-only so
    // browser autofill cannot repopulate it. Scripted bots can still assign a value directly.
    honeypot.value = "";
    honeypot.readOnly = true;
    honeypot.autocomplete = "new-password";
    honeypot.setAttribute("data-lpignore", "true");
    honeypot.setAttribute("data-1p-ignore", "true");
  }, []);

  return null;
}

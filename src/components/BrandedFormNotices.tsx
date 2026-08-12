import { useEffect } from "react";
import { consumeSubmissionFailureCategory } from "@/lib/submission-result";

function noticeTone(message: string) {
  return /sent successfully|confirmation email/i.test(message) ? "success" : "error";
}

function failureMessage(category: ReturnType<typeof consumeSubmissionFailureCategory>) {
  switch (category) {
    case "validation":
      return "Some of the submitted details were not accepted. Please review the form and try again.";
    case "origin":
      return "The request could not be verified as coming from Homent. Please refresh the page and try again.";
    case "rate_limit":
      return "Too many requests were sent recently. Please wait a few minutes and try again.";
    case "delivery":
      return "Homent could not deliver your message right now. Please try again or email info@hestiva.co.za.";
    case "bot":
      return "The request was blocked by Homent's anti-spam check. Please refresh the page, complete the form again, and retry.";
    case "framework":
      return "The website could not complete the submission request. Please refresh the page and try again or email info@hestiva.co.za.";
    case "unexpected":
      return "An unexpected website error prevented the request from being sent. Please try again or email info@hestiva.co.za.";
    default:
      return "We could not send your request. Please try again or email info@hestiva.co.za.";
  }
}

function showNotice(message: string) {
  document.getElementById("hestiva-form-notice")?.remove();

  const tone = noticeTone(message);
  const wrapper = document.createElement("div");
  wrapper.id = "hestiva-form-notice";
  wrapper.setAttribute("role", tone === "success" ? "status" : "alert");
  wrapper.setAttribute("aria-live", "assertive");
  wrapper.className =
    "fixed inset-x-4 top-5 z-[200] mx-auto max-w-xl rounded-xl border bg-[#FFFDF8] p-5 shadow-[0_20px_60px_rgba(70,37,29,0.18)] sm:inset-x-auto sm:right-5 sm:mx-0 sm:w-[28rem]";
  wrapper.style.borderColor = tone === "success" ? "#C9A45B" : "#9B3349";

  const header = document.createElement("div");
  header.className = "flex items-start justify-between gap-4";

  const copy = document.createElement("div");
  const title = document.createElement("p");
  title.className = "text-sm font-semibold uppercase tracking-[0.14em] text-[#3B0F1A]";
  title.textContent = tone === "success" ? "Homent — Request received" : "Homent — Request not sent";

  const body = document.createElement("p");
  body.className = "mt-2 text-sm leading-6 text-[#5F4B46]";
  body.textContent = message;
  copy.append(title, body);

  const close = document.createElement("button");
  close.type = "button";
  close.className =
    "rounded-md px-2 py-1 text-lg leading-none text-[#5F4B46] transition hover:bg-[#EDE2CF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]";
  close.setAttribute("aria-label", "Close notification");
  close.textContent = "×";
  close.addEventListener("click", () => wrapper.remove());

  header.append(copy, close);
  wrapper.appendChild(header);
  document.body.appendChild(wrapper);

  window.setTimeout(() => wrapper.remove(), tone === "success" ? 8000 : 12000);
}

function alignContactFallbackEmail() {
  if (window.location.pathname !== "/contact") return;
  const link = document.querySelector<HTMLAnchorElement>(
    '#enquiry-form a[href="mailto:quotes@hestiva.co.za"]',
  );
  if (!link) return;
  link.href = "mailto:info@hestiva.co.za";
  link.textContent = "info@hestiva.co.za";
}

export function BrandedFormNotices() {
  useEffect(() => {
    if (window.location.pathname !== "/quote" && window.location.pathname !== "/contact") return;

    alignContactFallbackEmail();
    const originalAlert = window.alert;
    window.alert = (message?: unknown) => {
      const text = String(message ?? "");
      if (/could not send your request/i.test(text)) {
        showNotice(failureMessage(consumeSubmissionFailureCategory()));
        return;
      }
      showNotice(text);
    };

    return () => {
      window.alert = originalAlert;
      document.getElementById("hestiva-form-notice")?.remove();
    };
  }, []);

  return null;
}

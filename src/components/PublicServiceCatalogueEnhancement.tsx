import { useEffect } from "react";

const RECLASSIFIED_TITLES = new Set(["Apartment Cleaning", "Eco-Friendly Cleaning"]);
const POST_RENOVATION_PATH = "/services/post-renovation-cleaning";

function reconcileServicesOverview() {
  if (window.location.pathname !== "/services" && window.location.pathname !== "/services/") return;

  const articles = Array.from(document.querySelectorAll<HTMLElement>("main article"));
  if (!articles.length) return;

  for (const article of articles) {
    const title = article.querySelector("h3")?.textContent?.trim();
    if (title && RECLASSIFIED_TITLES.has(title)) {
      article.remove();
    }
  }

  if (document.querySelector(`[data-post-renovation-catalogue="true"]`)) return;

  const remaining = Array.from(document.querySelectorAll<HTMLElement>("main article"));
  const container = remaining.at(-1)?.parentElement;
  if (!container) return;

  const article = document.createElement("article");
  article.dataset.postRenovationCatalogue = "true";
  article.className =
    "rounded-2xl border border-[#E6D9C8] bg-white p-7 shadow-[0_18px_50px_rgba(70,42,33,0.06)] sm:p-10 lg:p-12";
  article.innerHTML = `
    <p class="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#9A742E]">Assessment-led service</p>
    <h3 class="text-3xl font-semibold tracking-tight text-[#5A1425] md:text-4xl">
      <a href="${POST_RENOVATION_PATH}" class="rounded-sm transition-colors hover:text-[#711C31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]">Post-Renovation Cleaning</a>
    </h3>
    <p class="mt-5 max-w-3xl leading-7 text-[#695E59]">Detailed residential cleaning after renovation work. The property condition and renovation residue are assessed before scope and pricing are confirmed.</p>
    <p class="mt-5 text-sm font-medium text-[#5A1425]">Assessment and quotation required — no automatic per-square-metre price is promised.</p>
  `;
  container.appendChild(article);
}

export function PublicServiceCatalogueEnhancement() {
  useEffect(() => {
    if (window.location.pathname !== "/services" && window.location.pathname !== "/services/") return;

    const observer = new MutationObserver(reconcileServicesOverview);
    observer.observe(document.body, { childList: true, subtree: true });
    reconcileServicesOverview();
    return () => observer.disconnect();
  }, []);

  return null;
}

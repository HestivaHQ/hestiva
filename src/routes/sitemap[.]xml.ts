import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { servicePages } from "@/content/services";
import { locationPages } from "@/content/locations";

const BASE_URL = "https://www.hestiva.co.za";
const STATIC_PATHS = ["/", "/about", "/services", "/locations", "/quote", "/contact"];
const LEGAL_PATHS = ["/privacy", "/terms"];

function escapeXml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[character]!,
  );
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const paths = [
          ...STATIC_PATHS,
          ...servicePages.map((service) => `/services/${service.slug}`),
          ...locationPages.map((location) => `/locations/${location.slug}`),
          ...LEGAL_PATHS,
        ];
        const urls = paths.map(
          (path) => `  <url>\n    <loc>${escapeXml(`${BASE_URL}${path}`)}</loc>\n  </url>`,
        );
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});

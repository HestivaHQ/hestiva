import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { SITE_URL } from "@/lib/site";

const publicRoutes = [
  "/",
  "/services",
  "/services/apartment-cleaning",
  "/about",
  "/locations",
  "/contact",
  "/quote",
  "/privacy",
  "/terms",
] as const;

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls = publicRoutes.map(
          (path) => `  <url>\n    <loc>${SITE_URL}${path}</loc>\n  </url>`,
        );
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});

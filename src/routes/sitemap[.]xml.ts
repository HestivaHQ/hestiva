import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { servicePages } from "@/content/services";
import { locationPages } from "@/content/locations";

const BASE_URL = "https://hestiva.co.za";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/services", changefreq: "monthly", priority: "0.9" },
          { path: "/locations", changefreq: "monthly", priority: "0.9" },
          ...servicePages.map((service) => ({
            path: `/services/${service.slug}`,
            changefreq: "monthly",
            priority: "0.8",
          })),
          ...locationPages.map((location) => ({
            path: `/locations/${location.slug}`,
            changefreq: "monthly",
            priority: "0.75",
          })),
        ];
        const urls = entries.map(
          (entry) =>
            `  <url>\n    <loc>${BASE_URL}${entry.path}</loc>\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority}</priority>\n  </url>`,
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

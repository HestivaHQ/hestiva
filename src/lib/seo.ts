import { absoluteUrl, siteConfig } from "@/lib/site";

export type SeoRobots = {
  index?: boolean;
  follow?: boolean;
  noArchive?: boolean;
  noImageIndex?: boolean;
  noSnippet?: boolean;
};

export type SeoConfig = {
  title: string;
  description: string;
  path?: string;
  image?: string | null;
  type?: "website" | "article";
  keywords?: readonly string[];
  robots?: SeoRobots;
  themeColor?: string;
};

const DEFAULT_THEME_COLOR = "#3B0F1A";

function robotsContent(robots: SeoRobots = {}): string {
  const directives = [
    robots.index === false ? "noindex" : "index",
    robots.follow === false ? "nofollow" : "follow",
  ];

  if (robots.noArchive) directives.push("noarchive");
  if (robots.noImageIndex) directives.push("noimageindex");
  if (robots.noSnippet) directives.push("nosnippet");

  return directives.join(", ");
}

export function createSeoHead({
  title,
  description,
  path = "/",
  image = siteConfig.assets.socialImage,
  type = "website",
  keywords,
  robots,
  themeColor = DEFAULT_THEME_COLOR,
}: SeoConfig) {
  const canonicalUrl = absoluteUrl(path);
  const socialImageUrl = image ? absoluteUrl(image) : null;

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "author", content: siteConfig.name },
      { name: "robots", content: robotsContent(robots) },
      { name: "googlebot", content: robotsContent(robots) },
      { name: "theme-color", content: themeColor },
      ...(keywords?.length
        ? [{ name: "keywords", content: keywords.join(", ") }]
        : []),
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:site_name", content: siteConfig.name },
      { property: "og:locale", content: "en_ZA" },
      ...(canonicalUrl ? [{ property: "og:url", content: canonicalUrl }] : []),
      ...(socialImageUrl
        ? [
            { property: "og:image", content: socialImageUrl },
            { property: "og:image:secure_url", content: socialImageUrl },
            { property: "og:image:width", content: "1200" },
            { property: "og:image:height", content: "630" },
            {
              property: "og:image:alt",
              content: `${siteConfig.name} — ${siteConfig.tagline}`,
            },
          ]
        : []),
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      ...(socialImageUrl
        ? [
            { name: "twitter:image", content: socialImageUrl },
            {
              name: "twitter:image:alt",
              content: `${siteConfig.name} — ${siteConfig.tagline}`,
            },
          ]
        : []),
    ],
    links: canonicalUrl ? [{ rel: "canonical", href: canonicalUrl }] : [],
  };
}

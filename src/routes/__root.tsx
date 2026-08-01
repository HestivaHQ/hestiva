import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { absoluteUrl, BRAND_ASSETS, siteConfig } from "@/lib/site";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => {
    const canonicalUrl = absoluteUrl();
    const socialImageUrl = siteConfig.assets.socialImage
      ? absoluteUrl(siteConfig.assets.socialImage)
      : null;

    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "google-site-verification",
          content: "9ptdX6MHhpK25xbIHLMeVG7iSoMbLHXTVYynNZcH3zs",
        },
        { title: siteConfig.defaultTitle },
        { name: "description", content: siteConfig.defaultDescription },
        { name: "author", content: siteConfig.name },
        { property: "og:title", content: siteConfig.defaultTitle },
        { property: "og:description", content: siteConfig.defaultDescription },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: siteConfig.name },
        ...(canonicalUrl ? [{ property: "og:url", content: canonicalUrl }] : []),
        ...(socialImageUrl
          ? [
              { property: "og:image", content: socialImageUrl },
              { property: "og:image:width", content: "1200" },
              { property: "og:image:height", content: "630" },
            ]
          : []),
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: siteConfig.defaultTitle },
        { name: "twitter:description", content: siteConfig.defaultDescription },
        ...(socialImageUrl ? [{ name: "twitter:image", content: socialImageUrl }] : []),
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        { rel: "icon", type: "image/png", sizes: "16x16", href: BRAND_ASSETS.favicon16 },
        { rel: "icon", type: "image/png", sizes: "32x32", href: BRAND_ASSETS.favicon32 },
        { rel: "apple-touch-icon", sizes: "180x180", href: BRAND_ASSETS.appleTouchIcon },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}

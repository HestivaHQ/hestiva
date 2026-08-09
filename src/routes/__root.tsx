import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { LiveFormSubmission } from "@/components/LiveFormSubmission";
import { ServerFunctionProbe } from "@/components/ServerFunctionProbe";
import { BRAND_ASSETS } from "@/lib/site";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <meta name="robots" content="noindex, follow" />
      <meta name="googlebot" content="noindex, follow" />
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
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        name: "google-site-verification",
        content: "9ptdX6MHhpK25xbIHLMeVG7iSoMbLHXTVYynNZcH3zs",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", sizes: "16x16", href: BRAND_ASSETS.favicon16 },
      { rel: "icon", type: "image/png", sizes: "32x32", href: BRAND_ASSETS.favicon32 },
      { rel: "apple-touch-icon", sizes: "180x180", href: BRAND_ASSETS.appleTouchIcon },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA">
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
  return (
    <>
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-md bg-[#F5F1E8] px-4 py-3 font-semibold text-[#3B0F1A] shadow-lg transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#C9A45B] focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <LiveFormSubmission />
      <ServerFunctionProbe />
      <div id="main-content" tabIndex={-1}>
        <Outlet />
      </div>
    </>
  );
}

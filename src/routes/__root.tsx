import {
  Outlet,
  Link,
  createRootRoute,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { lazy, Suspense } from "react";

import appCss from "../styles.css?url";
import { BRAND_ASSETS } from "@/lib/site";

const LazyBrandedFormNotices = lazy(() =>
  import("@/components/BrandedFormNotices").then((module) => ({
    default: module.BrandedFormNotices,
  })),
);
const LazyContactValidationEnhancements = lazy(() =>
  import("@/components/ContactValidationEnhancements").then((module) => ({
    default: module.ContactValidationEnhancements,
  })),
);
const LazyFormSubmission = lazy(() =>
  import("@/components/LiveFormSubmission").then((module) => ({
    default: module.LiveFormSubmission,
  })),
);
const LazyAddonQuantityEnhancements = lazy(() =>
  import("@/components/AddonQuantityEnhancements").then((module) => ({
    default: module.AddonQuantityEnhancements,
  })),
);
const LazyPostRenovationFrequencyEnhancement = lazy(() =>
  import("@/components/PostRenovationFrequencyEnhancement").then((module) => ({
    default: module.PostRenovationFrequencyEnhancement,
  })),
);
const LazyLaundryOperatingModelEnhancement = lazy(() =>
  import("@/components/LaundryOperatingModelEnhancement").then((module) => ({
    default: module.LaundryOperatingModelEnhancement,
  })),
);

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
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const needsFormSubmission = pathname === "/quote" || pathname === "/contact";
  const needsContactValidation = pathname === "/quote" || pathname === "/contact";
  const needsBrandedFormNotices = pathname === "/quote" || pathname === "/contact";
  const needsAddonQuantityEnhancements = pathname === "/quote";
  const needsPostRenovationFrequencyEnhancement = pathname === "/quote";
  const needsLaundryOperatingModelEnhancement = pathname === "/quote";

  return (
    <>
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-md bg-[#F5F1E8] px-4 py-3 font-semibold text-[#3B0F1A] shadow-lg transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#C9A45B] focus:ring-offset-2"
      >
        Skip to main content
      </a>
      {needsBrandedFormNotices && (
        <Suspense fallback={null}>
          <LazyBrandedFormNotices />
        </Suspense>
      )}
      {needsContactValidation && (
        <Suspense fallback={null}>
          <LazyContactValidationEnhancements />
        </Suspense>
      )}
      {needsFormSubmission && (
        <Suspense fallback={null}>
          <LazyFormSubmission />
        </Suspense>
      )}
      {needsAddonQuantityEnhancements && (
        <Suspense fallback={null}>
          <LazyAddonQuantityEnhancements />
        </Suspense>
      )}
      {needsPostRenovationFrequencyEnhancement && (
        <Suspense fallback={null}>
          <LazyPostRenovationFrequencyEnhancement />
        </Suspense>
      )}
      {needsLaundryOperatingModelEnhancement && (
        <Suspense fallback={null}>
          <LazyLaundryOperatingModelEnhancement />
        </Suspense>
      )}
      <div id="main-content" tabIndex={-1}>
        <Outlet />
      </div>
    </>
  );
}

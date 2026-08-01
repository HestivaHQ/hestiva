import { BRAND_ASSETS, SITE_NAME, TAGLINE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
        <div className="flex items-center gap-3">
          <img
            src={BRAND_ASSETS.logoBlack}
            alt={`${SITE_NAME} logo`}
            className="h-12 w-auto max-w-[170px] object-contain"
          />
          <span className="sr-only">{TAGLINE}</span>
        </div>

        <p className="text-center text-xs text-muted-foreground md:text-right">
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

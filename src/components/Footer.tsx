import { Link } from "@tanstack/react-router";
import { BRAND_ASSETS, SITE_NAME, TAGLINE } from "@/lib/site";

const navigation = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
  { label: "Areas We Serve", to: "/locations" },
  { label: "Contact", to: "/contact" },
  { label: "Request a Quote", to: "/quote" },
] as const;

const linkStyles =
  "rounded-sm text-[#F5F1E8]/75 transition-colors hover:text-[#D8B970] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B970] focus-visible:ring-offset-2 focus-visible:ring-offset-[#3B0F1A]";

export function Footer() {
  return (
    <footer className="border-t border-[#C9A45B]/30 bg-[#3B0F1A] text-[#F5F1E8]">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-9 sm:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr] lg:gap-10">
        <div>
          <Link
            to="/"
            aria-label={`${SITE_NAME} home`}
            className="inline-flex rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B970] focus-visible:ring-offset-4 focus-visible:ring-offset-[#3B0F1A]"
          >
            <img
              src={BRAND_ASSETS.logoWhite}
              alt={`${SITE_NAME} logo`}
              width={1536}
              height={1024}
              className="h-12 w-auto max-w-[180px] object-contain"
            />
          </Link>
          <p className="mt-3 font-serif text-base text-[#D8B970]">{TAGLINE}</p>
          <p className="mt-2 max-w-xs text-sm leading-6 text-[#F5F1E8]/65">
            Thoughtful residential cleaning for beautifully cared-for homes.
          </p>
        </div>

        <nav aria-label="Footer navigation">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D8B970]">
            Explore
          </h2>
          <ul className="mt-4 grid gap-2 text-sm">
            {navigation.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={linkStyles}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D8B970]">
            Contact
          </h2>
          <ul className="mt-4 grid gap-2 text-sm">
            <li>
              <a href="tel:+27684231614" className={linkStyles}>
                068 423 1614
              </a>
            </li>
            <li>
              <a href="mailto:info@hestiva.co.za" className={`${linkStyles} break-all`}>
                info@hestiva.co.za
              </a>
            </li>
            <li>
              <a href="mailto:quotes@hestiva.co.za" className={`${linkStyles} break-all`}>
                quotes@hestiva.co.za
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#F5F1E8]/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-4 text-xs text-[#F5F1E8]/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <nav aria-label="Legal and credits">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              <li>
                <Link to="/privacy" className={linkStyles}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className={linkStyles}>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/image-credits" className={linkStyles}>
                  Image Credits
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}

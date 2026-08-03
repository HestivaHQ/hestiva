import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { BRAND_ASSETS, SITE_NAME, TAGLINE } from "@/lib/site";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Apartment Cleaning", href: "/services/apartment-cleaning" },
  { label: "Areas", href: "/locations" },
  { label: "Why Hestiva", href: "/#why-us" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <nav
      aria-label="Primary navigation"
      className="fixed inset-x-0 top-0 z-50 border-b border-[#C9A45B]/20 bg-[#3B0F1A]/95 shadow-[0_8px_30px_rgba(25,4,10,0.14)] backdrop-blur-md"
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-[height] duration-300 ${scrolled ? "h-16 md:h-[4.5rem]" : "h-[4.5rem] md:h-20"}`}
      >
        <a href="/" className="flex items-center gap-3" aria-label={`${SITE_NAME} home`}>
          <img
            src={BRAND_ASSETS.logoWhite}
            alt={`${SITE_NAME} logo`}
            className={`w-auto max-w-[180px] object-contain transition-[height] duration-300 ${scrolled ? "h-10 md:h-12" : "h-11 md:h-14"}`}
          />
          <span className="sr-only">{TAGLINE}</span>
        </a>

        <div className="hidden items-center gap-8 md:flex xl:gap-10">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative py-2 text-xs font-medium uppercase tracking-[0.16em] text-[#F5F1E8]/80 transition-colors duration-300 hover:text-[#F5F1E8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B] focus-visible:ring-offset-4 focus-visible:ring-offset-[#3B0F1A]"
            >
              {link.label}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[#C9A45B] transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
              />
            </a>
          ))}
          <a
            href="/#contact"
            className="rounded-lg bg-[#C9A45B] px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#3B0F1A] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#D8B970] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F1E8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#3B0F1A]"
          >
            Get a Quote
          </a>
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-[#F5F1E8] transition-colors hover:bg-[#F5F1E8]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B] md:hidden"
          onClick={() => setOpen((current) => !current)}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          {open ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            id="mobile-navigation"
            className="overflow-hidden border-b border-[#C9A45B]/20 bg-[#3B0F1A]/95 backdrop-blur-md md:hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-sm py-2 text-sm font-medium uppercase tracking-wider text-[#F5F1E8]/80 transition-colors hover:text-[#C9A45B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/#contact"
                onClick={() => setOpen(false)}
                className="mt-1 rounded-lg bg-[#C9A45B] px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.14em] text-[#3B0F1A] transition-colors duration-300 hover:bg-[#D8B970] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F1E8]"
              >
                Get a Quote
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

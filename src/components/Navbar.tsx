import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-3" aria-label={`${SITE_NAME} home`}>
          <img
            src={BRAND_ASSETS.logoPrimary}
            alt={`${SITE_NAME} logo`}
            className="h-14 w-auto max-w-[180px] object-contain"
          />
          <span className="sr-only">{TAGLINE}</span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
          <Button variant="hero" size="sm" asChild>
            <a href="/#contact">Get a Quote</a>
          </Button>
        </div>

        <button
          className="text-foreground md:hidden"
          onClick={() => setOpen((current) => !current)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-border bg-background md:hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium uppercase tracking-wider text-muted-foreground hover:text-primary"
                >
                  {link.label}
                </a>
              ))}
              <Button variant="hero" size="sm" asChild>
                <a href="/#contact" onClick={() => setOpen(false)}>
                  Get a Quote
                </a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

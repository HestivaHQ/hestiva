import { motion } from "framer-motion";
import {
  Bath,
  BedDouble,
  CookingPot,
  Home,
  Leaf,
  PackageOpen,
  Shirt,
  Sparkles,
  SprayCan,
  Square,
} from "lucide-react";

const services = [
  { title: "Regular Home Cleaning", icon: Home },
  { title: "Deep Cleaning", icon: Sparkles },
  { title: "Move-In Cleaning", icon: PackageOpen },
  { title: "Move-Out Cleaning", icon: PackageOpen },
  { title: "Kitchen Cleaning", icon: CookingPot },
  { title: "Bathroom Sanitisation", icon: Bath },
  { title: "Bedroom Cleaning", icon: BedDouble },
  { title: "Living Area Cleaning", icon: Home },
  { title: "Interior Window Cleaning", icon: Square },
  { title: "Laundry Folding", icon: Shirt },
  { title: "Apartment Cleaning", icon: Home },
  { title: "Eco-Friendly Cleaning", icon: Leaf },
  { title: "Add-on Services", icon: SprayCan },
];

export function ServicesSection() {
  return (
    <section id="services" className="bg-secondary py-24" aria-labelledby="services-heading">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Thoughtful Home Care
          </span>
          <h2
            id="services-heading"
            className="mt-3 text-4xl font-semibold text-foreground md:text-5xl"
          >
            Cleaning shaped around your home
          </h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            From weekly care to a detailed seasonal refresh, every visit is delivered with quiet
            precision and respect for your space.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.article
              key={service.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(index * 0.04, 0.24) }}
              className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                <service.icon className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Considered care, tailored to your space and preferred routine.
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

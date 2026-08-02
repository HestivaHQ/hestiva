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
  {
    title: "Regular Home Cleaning",
    description:
      "Reliable weekly or fortnightly care that keeps everyday spaces fresh, comfortable and beautifully maintained.",
    icon: Home,
  },
  {
    title: "Deep Cleaning",
    description:
      "A thorough top-to-bottom refresh for overlooked corners, built-up dust and hard-working household surfaces.",
    icon: Sparkles,
  },
  {
    title: "Move-In Cleaning",
    description:
      "Careful cleaning before you unpack, creating a fresh and welcoming start in your new home.",
    icon: PackageOpen,
  },
  {
    title: "Move-Out Cleaning",
    description:
      "Detailed end-of-lease care that leaves your former space clean, tidy and ready for handover.",
    icon: PackageOpen,
  },
  {
    title: "Kitchen Cleaning",
    description:
      "Focused care for counters, cupboards and cooking areas where grease and daily mess gather.",
    icon: CookingPot,
  },
  {
    title: "Bathroom Sanitisation",
    description:
      "Hygienic attention to showers, baths, fixtures and surfaces for a noticeably fresher bathroom.",
    icon: Bath,
  },
  {
    title: "Bedroom Cleaning",
    description:
      "Gentle, considered cleaning that makes bedrooms feel calm, dust-free and ready for rest.",
    icon: BedDouble,
  },
  {
    title: "Living Area Cleaning",
    description:
      "Thoughtful care for shared spaces, from dusting furniture to refreshing floors and finishing touches.",
    icon: Home,
  },
  {
    title: "Interior Window Cleaning",
    description:
      "Streak-free interior glass and frames that welcome more natural light into every room.",
    icon: Square,
  },
  {
    title: "Laundry Folding",
    description:
      "Neatly folded laundry organised with care, saving you time in a busy household routine.",
    icon: Shirt,
  },
  {
    title: "Apartment Cleaning",
    description:
      "Efficient whole-apartment care tailored to compact spaces, shared buildings and modern city living.",
    icon: Home,
  },
  {
    title: "Eco-Friendly Cleaning",
    description:
      "Mindful cleaning with gentler product choices for your household, pets and the wider environment.",
    icon: Leaf,
  },
  {
    title: "Add-on Services",
    description:
      "Flexible extras for the details your home needs, added easily to your chosen clean.",
    icon: SprayCan,
  },
];

export function ServicesSection() {
  return (
    <section
      id="services"
      className="bg-[#F8F3E8] py-24 sm:py-28 lg:py-32"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-3xl text-center lg:mb-20"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9A7132]">
            Care for Every Home
          </span>
          <h2
            id="services-heading"
            className="mt-4 text-4xl font-semibold tracking-[-0.025em] text-[#3B0F1A] sm:text-5xl"
          >
            Cleaning shaped around your life.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#5F4B46]">
            From dependable weekly care to a detailed home refresh, choose the service that suits
            your space, routine and priorities.
          </p>
        </motion.div>

        <div className="grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {services.map((service, index) => (
            <motion.article
              key={service.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(index * 0.04, 0.24) }}
              className="group h-full rounded-2xl border border-[#E7DCC9] bg-[#FFFDF8] p-7 shadow-[0_8px_24px_rgba(59,15,26,0.04)] transition-transform duration-300 hover:-translate-y-1 sm:p-8"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-[#C9A45B]/30 bg-[#F8F3E8]">
                <service.icon className="h-5 w-5 text-[#9A7132]" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold tracking-[-0.01em] text-[#3B0F1A]">
                {service.title}
              </h3>
              <p className="mt-3 text-[0.95rem] leading-7 text-[#6D5B55]">{service.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

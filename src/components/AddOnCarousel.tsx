import { visualAddOns } from "@/content/services";
import { ServiceImage } from "@/components/ServiceImage";
import { Link } from "@tanstack/react-router";

export function AddOnCarousel() {
  return (
    <section aria-labelledby="add-on-services-heading" className="overflow-hidden py-4">
      <div className="mb-8 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9A742E]">
          Personalise your clean
        </p>
        <h2
          id="add-on-services-heading"
          className="mt-3 text-3xl font-semibold tracking-tight text-[#5A1425] md:text-4xl"
        >
          <Link
            to="/services/$serviceSlug"
            params={{ serviceSlug: "cleaning-add-ons" }}
            className="rounded-sm hover:text-[#711C31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]"
          >
            Add-on Services
          </Link>
        </h2>
        <p className="mt-4 leading-7 text-[#695E59]">
          Optional extras can be added to eligible cleaning visits. Looking for clothing care?{" "}
          <Link
            to="/services/$serviceSlug"
            params={{ serviceSlug: "laundry-folding" }}
            className="rounded-sm font-semibold text-[#5A1425] underline decoration-[#C9A45B] underline-offset-4 transition-colors hover:text-[#711C31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]"
          >
            Learn about our Laundry &amp; Ironing Add-On.
          </Link>
        </p>
      </div>
      <ul
        aria-label="Visual selection of cleaning add-on services"
        className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-6 [scrollbar-color:#C9A45B_transparent] focus-within:scroll-smooth motion-reduce:focus-within:scroll-auto md:mx-0 md:px-0"
      >
        {visualAddOns.map((addOn) => (
          <li
            key={addOn.slug}
            tabIndex={0}
            className="min-w-[82%] snap-start overflow-hidden rounded-2xl border border-[#E6D9C8] bg-white shadow-[0_14px_38px_rgba(70,42,33,0.06)] outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B] focus-visible:ring-offset-4 sm:min-w-[44%] md:min-w-[31%]"
          >
            <ServiceImage
              image={addOn.image}
              className="block aspect-[3/2] overflow-hidden bg-[#EFE4D2]"
            />
            <h3 className="px-5 py-5 text-lg font-semibold text-[#5A1425]">{addOn.name}</h3>
          </li>
        ))}
      </ul>
    </section>
  );
}

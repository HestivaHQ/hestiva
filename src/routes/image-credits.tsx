import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { locationVisualLibrary } from "@/content/location-visuals";
import { pageBreadcrumbs } from "@/lib/breadcrumbs";
import { createSeoHead } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

const breadcrumbs = pageBreadcrumbs("Image Credits", "/image-credits");

export const Route = createFileRoute("/image-credits")({
  component: ImageCreditsPage,
  head: () => ({
    ...createSeoHead({
      title: `Image Credits | ${SITE_NAME}`,
      description:
        "Credits and licence information for third-party geographic photographs used on Hestiva service-area pages.",
      path: "/image-credits",
    }),
    meta: [{ name: "robots", content: "noindex,follow" }],
  }),
});

function ImageCreditsPage() {
  const entries = Object.entries(locationVisualLibrary).filter(([, images]) => images.length > 0);

  return (
    <div className="min-h-screen bg-[#F8F3E8] text-[#5F4B46]">
      <Navbar />
      <main>
        <section className="border-b border-[#C9A45B]/25 bg-[#EDE2CF] px-6 pb-16 pt-32 md:pt-36">
          <div className="mx-auto max-w-5xl">
            <Breadcrumbs
              items={breadcrumbs}
              className="mb-8 text-[#6D5B55]"
              linkClassName="transition-colors hover:text-[#5A1425]"
              separatorClassName="text-[#C9A45B]"
            />
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9A7132]">
              Media acknowledgements
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-[#5A1425] md:text-6xl">
              Image Credits
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#695E59]">
              Hestiva uses selected third-party photographs to provide genuine geographic context on
              service-area pages. The original creators, source pages and reuse licences are recorded
              here.
            </p>
          </div>
        </section>

        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto max-w-5xl space-y-10">
            {entries.map(([location, images]) => (
              <section key={location} aria-labelledby={`credits-${location.replace(/\s+/g, "-")}`}>
                <h2
                  id={`credits-${location.replace(/\s+/g, "-")}`}
                  className="text-2xl font-semibold text-[#5A1425]"
                >
                  {location}
                </h2>
                <div className="mt-5 divide-y divide-[#E2D3BD] rounded-2xl border border-[#E2D3BD] bg-[#FFFDF8] px-6">
                  {images.map((image) => (
                    <article key={image.sourceUrl} className="py-5">
                      <p className="font-medium text-[#4A3435]">{image.alt}</p>
                      <p className="mt-2 text-sm leading-6 text-[#695E59]">
                        Creator: {image.credit} · Licence:{" "}
                        <a
                          href={image.licenseUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="underline underline-offset-4 hover:text-[#5A1425]"
                        >
                          {image.license}
                        </a>
                        {" · "}
                        <a
                          href={image.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="underline underline-offset-4 hover:text-[#5A1425]"
                        >
                          Source file
                        </a>
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

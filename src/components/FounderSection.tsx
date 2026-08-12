export function FounderSection() {
  return (
    <section aria-labelledby="founder-heading" className="bg-[#FFFDF8] px-6 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <p className="pt-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#9A7132]">
          Built with care
        </p>
        <div>
          <h2
            id="founder-heading"
            className="max-w-3xl text-3xl font-semibold tracking-tight text-[#3B0F1A] md:text-5xl"
          >
            A simple idea behind Homent.
          </h2>
          <div className="mt-6 max-w-2xl space-y-5 text-lg leading-8 text-[#5F4B46]">
            <p>
              Homent was founded by Smangaliso Nkosi with a simple idea: professional home cleaning
              should feel reliable, respectful and easy to arrange.
            </p>
            <p>
              The aim is to build a cleaning company that customers can feel comfortable welcoming
              into their homes — one that communicates clearly, pays attention to the details and
              takes pride in doing the job properly.
            </p>
            <p>
              As Homent grows, those principles remain at the heart of the business: dependable
              service, respect for every home and a consistently high standard of care.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

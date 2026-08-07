import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Home,
  Info,
  MessageCircle,
  Send,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { createSeoHead } from "@/lib/seo";
import { pageBreadcrumbs } from "@/lib/breadcrumbs";
import { createBreadcrumbList, createPageGraph, schemaScripts } from "@/lib/structured-data";

const breadcrumbs = pageBreadcrumbs("Quote", "/quote");

export const Route = createFileRoute("/quote")({
  component: QuotePage,
  head: () => {
    const title = "Request a Residential Cleaning Quote | Hestiva";
    const description =
      "Tell Hestiva about your Johannesburg home and cleaning needs to request a personalised residential cleaning quotation.";
    const path = "/quote";
    return {
      ...createSeoHead({ title, description, path }),
      scripts: schemaScripts(
        createPageGraph(path, title, description),
        createBreadcrumbList(breadcrumbs),
      ),
    };
  },
});

const steps = [
  "Your Home",
  "Cleaning Requirements",
  "Personalise Your Service",
  "Preferred Visit",
  "Access and Household Details",
  "Photos and Notes",
  "Your Details",
  "Review and Submit",
] as const;

const initialForm = {
  propertyType: "",
  suburb: "",
  address: "",
  floorSize: "",
  bedrooms: "",
  bathrooms: "",
  livingAreas: "",
  storeys: "",
  outdoor: "",
  estate: "",
  service: "",
  frequency: "",
  condition: "",
  addons: [] as string[],
  preferredDate: "",
  alternativeDate: "",
  preferredTime: "",
  flexibility: "",
  urgency: "",
  recurringNotes: "",
  complexAccess: "",
  securityInstructions: "",
  parking: "",
  keyHandover: "",
  present: "",
  pets: "",
  petType: "",
  petTemperament: "",
  cameras: "",
  offLimits: "",
  fragileItems: "",
  restrictions: "",
  allergies: "",
  attentionAreas: "",
  existingDamage: "",
  renovationDust: "",
  applianceAddons: "",
  notes: "",
  fullName: "",
  mobile: "",
  email: "",
  contactMethod: "",
  consent: false,
};

type FormData = typeof initialForm;
type TextKey = Exclude<keyof FormData, "addons" | "consent">;

const selectOptions = {
  propertyType: ["Apartment", "Townhouse", "House", "Duplex", "Other"],
  floorSize: ["Under 80 m²", "80–150 m²", "151–250 m²", "Over 250 m²", "Not sure"],
  bedrooms: ["Studio", "1", "2", "3", "4", "5+"],
  bathrooms: ["1", "2", "3", "4", "5+"],
  livingAreas: ["1", "2", "3", "4+"],
  storeys: ["1 storey", "2 storeys", "3 storeys", "4+ storeys"],
  outdoor: ["None", "Balcony", "Patio", "Both"],
  estate: ["No", "Yes — estate", "Yes — complex", "Yes — gated community"],
  service: [
    "Regular Home Cleaning",
    "Deep Cleaning",
    "Move-In Cleaning",
    "Move-Out Cleaning",
    "Apartment Cleaning",
    "Kitchen Cleaning",
    "Bathroom Sanitisation",
    "Bedroom Cleaning",
    "Living Area Cleaning",
    "Interior Window Cleaning",
    "Laundry Folding",
    "Eco-Friendly Cleaning",
    "Add-on Services",
    "Not sure",
  ],
  frequency: ["One-time", "Weekly", "Every two weeks", "Monthly", "Custom"],
  condition: [
    "Light upkeep",
    "Standard lived-in condition",
    "Needs extra attention",
    "Heavy build-up",
    "Recently renovated",
    "Vacant property",
    "Move-in or move-out condition",
  ],
};

const addons = [
  "Inside oven",
  "Inside fridge",
  "Inside cupboards",
  "Interior windows",
  "Laundry folding",
  "Ironing",
  "Bed making",
  "Linen change",
  "Balcony or patio",
  "Garage sweep",
  "Extra bathroom",
  "Extra refrigerator",
  "Pet-hair treatment",
  "Eco-friendly products",
  "Post-renovation dust removal",
];

const requiredByStep: Partial<Record<number, TextKey[]>> = {
  0: ["propertyType", "suburb", "address", "floorSize", "bedrooms", "bathrooms"],
  1: ["service", "frequency", "condition"],
  3: ["preferredDate", "preferredTime"],
  6: ["fullName", "mobile", "email", "contactMethod"],
};

const labelByKey: Partial<Record<keyof FormData, string>> = {
  propertyType: "Property type",
  suburb: "Suburb",
  address: "Full service address",
  floorSize: "Approximate floor size",
  bedrooms: "Bedrooms",
  bathrooms: "Bathrooms",
  service: "Primary service",
  frequency: "Frequency",
  condition: "Home condition",
  preferredDate: "Preferred date",
  preferredTime: "Preferred time",
  fullName: "Full name",
  mobile: "Mobile number",
  email: "Email address",
  contactMethod: "Preferred contact method",
  consent: "Contact consent",
};

const inputClass =
  "mt-2 min-h-12 w-full rounded-xl border border-[#CDBFB1] bg-white px-4 py-3 text-base text-[#342C2A] shadow-sm outline-none transition placeholder:text-[#8B7E77] hover:border-[#A89380] focus:border-[#5A1425] focus:ring-2 focus:ring-[#C9A45B]/45";
const primaryButton =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#5A1425] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(90,20,37,0.16)] transition hover:bg-[#711C31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
const secondaryButton =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#5A1425]/25 bg-white px-6 py-3 text-sm font-semibold text-[#5A1425] transition hover:border-[#5A1425] hover:bg-[#FBF7EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B] focus-visible:ring-offset-2";

function QuotePage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const update = (key: TextKey, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  const validateStep = (index: number) => {
    const nextErrors: Record<string, string> = {};
    for (const key of requiredByStep[index] ?? []) {
      if (!form[key].trim()) nextErrors[key] = `${labelByKey[key]} is required.`;
    }
    if (index === 6 && form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const continueForm = () => {
    if (!validateStep(step)) return;
    setStep((current) => Math.min(current + 1, steps.length - 1));
    window.scrollTo({
      top: document.getElementById("quote-form")?.offsetTop ?? 0,
      behavior: "smooth",
    });
  };

  const submit = () => {
    const allErrors: Record<string, string> = {};
    Object.values(requiredByStep)
      .filter((keys): keys is TextKey[] => Boolean(keys))
      .flat()
      .forEach((key) => {
        if (!form[key].trim()) allErrors[key] = `${labelByKey[key]} is required.`;
      });
    if (!form.consent) allErrors.consent = "Please confirm that Hestiva may contact you.";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
      allErrors.email = "Enter a valid email address.";
    setErrors(allErrors);
    if (Object.keys(allErrors).length) return;
    setNotice(true);
  };

  const whatsappUrl = useMemo(() => {
    const message = `Hello Hestiva,\n\nI would like help with a residential cleaning quotation.\n\nName: ${form.fullName}\nSuburb: ${form.suburb}\nProperty type: ${form.propertyType}\nBedrooms: ${form.bedrooms}\nBathrooms: ${form.bathrooms}\nService: ${form.service}\nFrequency: ${form.frequency}\nPreferred date: ${form.preferredDate}\nAdditional notes: ${form.notes}`;
    return `https://wa.me/27684231614?text=${encodeURIComponent(message)}`;
  }, [form]);

  return (
    <div className="min-h-screen bg-[#FBF7EF] text-[#342C2A]">
      <Navbar />
      <main>
        <section className="relative overflow-hidden border-b border-[#C9A45B]/20 bg-[#F7F0E3] px-5 pb-16 pt-32 sm:px-6 md:pb-24 md:pt-40">
          <div
            aria-hidden="true"
            className="absolute -right-28 top-20 h-80 w-80 rounded-full border border-[#C9A45B]/20"
          />
          <div className="relative mx-auto max-w-7xl">
            <Breadcrumbs
              items={breadcrumbs}
              className="mb-12 text-[#5F4B46]"
              linkClassName="rounded-sm transition-colors hover:text-[#3B0F1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B]"
              separatorClassName="text-[#C9A45B]"
            />
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#98732E]">
              Request a Quote
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#5A1425] sm:text-5xl md:text-7xl">
              Tell us about your home.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#695E59]">
              Share a few details about your space, cleaning needs and preferred schedule. We’ll
              review your request and prepare a personalised quotation.
            </p>
            <div className="mt-8 inline-flex max-w-2xl items-start gap-3 rounded-xl border border-[#C9A45B]/30 bg-white/60 p-4 text-sm leading-6 text-[#5D504B]">
              <Info aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#9A742E]" />
              <p>
                <strong className="text-[#5A1425]">No automatic price will be shown.</strong> Your
                request will be reviewed by the Hestiva team.
              </p>
            </div>
          </div>
        </section>

        <section id="quote-form" className="px-4 py-12 sm:px-6 md:py-20">
          <div className="mx-auto max-w-7xl">
            <Progress step={step} />
            <button
              type="button"
              aria-expanded={summaryOpen}
              onClick={() => setSummaryOpen(!summaryOpen)}
              className="mt-6 flex min-h-12 w-full items-center justify-between rounded-xl border border-[#C9A45B]/30 bg-white px-4 text-left font-semibold text-[#5A1425] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45B] lg:hidden"
            >
              Your request summary{" "}
              <ChevronDown className={`h-5 w-5 transition ${summaryOpen ? "rotate-180" : ""}`} />
            </button>
            {summaryOpen && (
              <div className="mt-2 lg:hidden">
                <Summary form={form} />
              </div>
            )}

            <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_21rem]">
              <form
                onSubmit={(event) => event.preventDefault()}
                noValidate
                className="rounded-2xl border border-[#C9A45B]/25 bg-white p-5 shadow-[0_20px_60px_rgba(70,37,29,0.06)] sm:p-8 md:p-10"
              >
                <div className="mb-8 border-b border-[#E8DDD0] pb-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9A742E]">
                    Step {step + 1} of {steps.length}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-[#5A1425] sm:text-3xl">
                    {steps[step]}
                  </h2>
                </div>
                {Object.values(errors).some(Boolean) && (
                  <div
                    role="alert"
                    className="mb-6 rounded-xl border border-[#9B3349]/30 bg-[#FFF4F4] p-4 text-sm text-[#751C31]"
                  >
                    <p className="font-semibold">Please review the highlighted fields.</p>
                    <ul className="mt-2 list-disc pl-5">
                      {Object.values(errors)
                        .filter(Boolean)
                        .map((error) => (
                          <li key={error}>{error}</li>
                        ))}
                    </ul>
                  </div>
                )}
                <StepContent
                  step={step}
                  form={form}
                  update={update}
                  setForm={setForm}
                  errors={errors}
                />
                {notice && (
                  <div
                    role="status"
                    className="mt-8 rounded-xl border border-[#C9A45B]/40 bg-[#FBF7EF] p-5 leading-7 text-[#5D504B]"
                  >
                    <p className="font-semibold text-[#5A1425]">
                      Online quote submission is being prepared.
                    </p>
                    <p>
                      For immediate assistance, email{" "}
                      <a className="font-semibold underline" href="mailto:quotes@hestiva.co.za">
                        quotes@hestiva.co.za
                      </a>{" "}
                      or continue via WhatsApp.
                    </p>
                  </div>
                )}
                <div className="mt-10 flex flex-col-reverse gap-3 border-t border-[#E8DDD0] pt-6 sm:flex-row sm:justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setStep((current) => Math.max(0, current - 1));
                      setErrors({});
                    }}
                    disabled={step === 0}
                    className={secondaryButton}
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  {step < steps.length - 1 ? (
                    <button type="button" onClick={continueForm} className={primaryButton}>
                      Continue <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={secondaryButton}
                      >
                        <MessageCircle className="h-4 w-4" /> Continue via WhatsApp
                      </a>
                      <button type="button" onClick={submit} className={primaryButton}>
                        <Send className="h-4 w-4" /> Send Request
                      </button>
                    </div>
                  )}
                </div>
              </form>
              <aside className="sticky top-28 hidden lg:block">
                <Summary form={form} />
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Progress({ step }: { step: number }) {
  const percent = ((step + 1) / steps.length) * 100;
  return (
    <div aria-label={`Quote request progress: step ${step + 1} of ${steps.length}, ${steps[step]}`}>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#5A1425]">
            Step {step + 1} of {steps.length}
          </p>
          <p className="mt-1 text-sm text-[#695E59]">{steps[step]}</p>
        </div>
        <span className="text-sm font-semibold text-[#9A742E]">{Math.round(percent)}%</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E6DACD]">
        <div
          className="h-full rounded-full bg-[#5A1425] transition-[width] motion-reduce:transition-none"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function StepContent({
  step,
  form,
  update,
  setForm,
  errors,
}: {
  step: number;
  form: FormData;
  update: (key: TextKey, value: string) => void;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  errors: Record<string, string>;
}) {
  const props = { form, update, errors };
  if (step === 0)
    return (
      <div className="grid gap-6 sm:grid-cols-2">
        <SelectField
          {...props}
          name="propertyType"
          label="Property type"
          options={selectOptions.propertyType}
          required
        />
        <TextField {...props} name="suburb" label="Suburb" autoComplete="address-level2" required />
        <TextField
          {...props}
          name="address"
          label="Full service address"
          autoComplete="street-address"
          required
          wide
        />
        <SelectField
          {...props}
          name="floorSize"
          label="Approximate floor size"
          options={selectOptions.floorSize}
          required
        />
        <SelectField
          {...props}
          name="bedrooms"
          label="Bedrooms"
          options={selectOptions.bedrooms}
          required
        />
        <SelectField
          {...props}
          name="bathrooms"
          label="Bathrooms"
          options={selectOptions.bathrooms}
          required
        />
        <SelectField
          {...props}
          name="livingAreas"
          label="Living areas"
          options={selectOptions.livingAreas}
        />
        <SelectField {...props} name="storeys" label="Storeys" options={selectOptions.storeys} />
        <SelectField
          {...props}
          name="outdoor"
          label="Balcony or patio"
          options={selectOptions.outdoor}
        />
        <SelectField
          {...props}
          name="estate"
          label="Estate or complex"
          options={selectOptions.estate}
        />
      </div>
    );
  if (step === 1)
    return (
      <div className="grid gap-6 sm:grid-cols-2">
        <SelectField
          {...props}
          name="service"
          label="Primary service"
          options={selectOptions.service}
          required
          wide
        />
        <SelectField
          {...props}
          name="frequency"
          label="Frequency"
          options={selectOptions.frequency}
          required
        />
        <SelectField
          {...props}
          name="condition"
          label="Home condition"
          options={selectOptions.condition}
          required
        />
      </div>
    );
  if (step === 2)
    return (
      <fieldset>
        <legend className="text-sm leading-6 text-[#695E59]">
          Choose any extras you would like us to consider. You can leave all unchecked.
        </legend>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {addons.map((addon) => (
            <label
              key={addon}
              className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-[#D8CCC0] p-4 transition hover:border-[#C9A45B] has-[:checked]:border-[#5A1425] has-[:checked]:bg-[#FBF7EF]"
            >
              <input
                type="checkbox"
                checked={form.addons.includes(addon)}
                onChange={() =>
                  setForm((current) => ({
                    ...current,
                    addons: current.addons.includes(addon)
                      ? current.addons.filter((item) => item !== addon)
                      : [...current.addons, addon],
                  }))
                }
                className="h-5 w-5 accent-[#5A1425]"
              />
              <span className="text-sm font-medium">{addon}</span>
            </label>
          ))}
        </div>
      </fieldset>
    );
  if (step === 3)
    return (
      <>
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField {...props} name="preferredDate" label="Preferred date" type="date" required />
          <TextField {...props} name="alternativeDate" label="Alternative date" type="date" />
          <SelectField
            {...props}
            name="preferredTime"
            label="Preferred time"
            options={["Morning", "Midday", "Afternoon", "Flexible"]}
            required
          />
          <SelectField
            {...props}
            name="flexibility"
            label="Flexibility"
            options={[
              "Exact date preferred",
              "A day either side",
              "Flexible this week",
              "Fully flexible",
            ]}
          />
          <SelectField
            {...props}
            name="urgency"
            label="Urgency"
            options={[
              "Planning ahead",
              "Within two weeks",
              "Within one week",
              "As soon as possible",
            ]}
          />
          <TextArea {...props} name="recurringNotes" label="Recurring-cleaning notes" wide />
        </div>
        <Notice>
          Preferred dates and times are requests only and are confirmed after Hestiva reviews
          availability and location.
        </Notice>
      </>
    );
  if (step === 4)
    return (
      <>
        <div className="grid gap-6 sm:grid-cols-2">
          <SelectField
            {...props}
            name="complexAccess"
            label="Estate or complex access"
            options={["Not applicable", "Visitor sign-in", "Access arranged by resident", "Other"]}
          />
          <TextArea
            {...props}
            name="securityInstructions"
            label="Security or gate instructions"
            hint="Please do not include alarm codes at this stage."
            wide
          />
          <TextArea {...props} name="parking" label="Parking instructions" />
          <SelectField
            {...props}
            name="keyHandover"
            label="Key handover method"
            options={["Someone will open", "Concierge or reception", "To be arranged", "Other"]}
          />
          <SelectField
            {...props}
            name="present"
            label="Will someone be present?"
            options={["Yes", "No", "Not sure"]}
          />
          <SelectField
            {...props}
            name="pets"
            label="Pets"
            options={["No pets", "Yes, pets will be home", "Yes, pets will be away"]}
          />
          {form.pets.startsWith("Yes") && (
            <>
              <SelectField
                {...props}
                name="petType"
                label="Pet type"
                options={["Dog", "Cat", "Dog and cat", "Bird", "Other"]}
              />
              <SelectField
                {...props}
                name="petTemperament"
                label="Pet temperament"
                options={["Friendly", "Shy", "Protective", "Reactive", "Not sure"]}
              />
            </>
          )}
          <SelectField
            {...props}
            name="cameras"
            label="Cameras on the property"
            options={["No", "Yes", "Not sure"]}
          />
          <TextArea {...props} name="offLimits" label="Off-limits rooms or cupboards" />
          <TextArea
            {...props}
            name="fragileItems"
            label="Fragile surfaces or items"
            hint="General areas only—do not provide detailed valuables information."
          />
          <TextArea {...props} name="restrictions" label="Product restrictions" />
          <TextArea {...props} name="allergies" label="Allergies or sensitivities" />
        </div>
        <Notice>
          Confirmed clients will be asked to complete a short home-access and valuables declaration
          before the first visit.
        </Notice>
      </>
    );
  if (step === 5)
    return (
      <>
        <div className="rounded-xl border border-dashed border-[#B99A61] bg-[#FBF7EF] p-6 text-center">
          <Upload className="mx-auto h-7 w-7 text-[#9A742E]" />
          <p className="mt-3 font-semibold text-[#5A1425]">Optional reference photos</p>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#695E59]">
            Choose clear photos of rooms or areas needing attention. Avoid people, identity
            documents, keys, access codes and valuables. JPG, PNG or HEIC, up to 10 MB each.
          </p>
          <label className={`${secondaryButton} mt-4 cursor-pointer`}>
            <Upload className="h-4 w-4" /> Choose photos
            <input
              type="file"
              accept="image/jpeg,image/png,image/heic"
              multiple
              className="sr-only"
              onChange={(event) => {
                event.currentTarget.value = "";
              }}
            />
          </label>
          <p className="mt-3 text-xs text-[#756963]">
            Interface preview only. Files are not uploaded, stored or submitted.
          </p>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <TextArea {...props} name="attentionAreas" label="Areas needing attention" />
          <TextArea {...props} name="existingDamage" label="Existing damage" />
          <TextArea {...props} name="renovationDust" label="Renovation dust" />
          <TextArea {...props} name="applianceAddons" label="Appliances requested as add-ons" />
          <TextArea {...props} name="notes" label="Additional notes" wide />
        </div>
      </>
    );
  if (step === 6)
    return (
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField {...props} name="fullName" label="Full name" autoComplete="name" required />
        <TextField
          {...props}
          name="mobile"
          label="Mobile number"
          type="tel"
          autoComplete="tel"
          required
        />
        <TextField
          {...props}
          name="email"
          label="Email address"
          type="email"
          autoComplete="email"
          required
        />
        <SelectField
          {...props}
          name="contactMethod"
          label="Preferred contact method"
          options={["Phone", "WhatsApp", "Email"]}
          required
        />
      </div>
    );
  return <Review form={form} setForm={setForm} errors={errors} />;
}

function TextField({
  form,
  update,
  errors,
  name,
  label,
  type = "text",
  autoComplete,
  required,
  wide,
}: FieldProps & { type?: string; autoComplete?: string }) {
  const id = `field-${name}`;
  return (
    <label
      className={`text-sm font-semibold text-[#4A3435] ${wide ? "sm:col-span-2" : ""}`}
      htmlFor={id}
    >
      {label}
      {required && (
        <span aria-hidden="true" className="text-[#9B3349]">
          {" "}
          *
        </span>
      )}
      <input
        id={id}
        type={type}
        value={form[name]}
        onChange={(e) => update(name, e.target.value)}
        autoComplete={autoComplete}
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `${id}-error` : undefined}
        className={inputClass}
      />
      {errors[name] && (
        <span id={`${id}-error`} className="mt-2 block font-normal text-[#9B3349]">
          {errors[name]}
        </span>
      )}
    </label>
  );
}
function SelectField({
  form,
  update,
  errors,
  name,
  label,
  options,
  required,
  wide,
}: FieldProps & { options: readonly string[] }) {
  const id = `field-${name}`;
  return (
    <label
      className={`text-sm font-semibold text-[#4A3435] ${wide ? "sm:col-span-2" : ""}`}
      htmlFor={id}
    >
      {label}
      {required && (
        <span aria-hidden="true" className="text-[#9B3349]">
          {" "}
          *
        </span>
      )}
      <select
        id={id}
        value={form[name]}
        onChange={(e) => update(name, e.target.value)}
        aria-invalid={!!errors[name]}
        className={inputClass}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      {errors[name] && (
        <span className="mt-2 block font-normal text-[#9B3349]">{errors[name]}</span>
      )}
    </label>
  );
}
function TextArea({ form, update, name, label, hint, wide }: FieldProps & { hint?: string }) {
  const id = `field-${name}`;
  return (
    <label
      className={`text-sm font-semibold text-[#4A3435] ${wide ? "sm:col-span-2" : ""}`}
      htmlFor={id}
    >
      {label}
      <textarea
        id={id}
        rows={4}
        value={form[name]}
        onChange={(e) => update(name, e.target.value)}
        className={`${inputClass} resize-y`}
      />
      {hint && <span className="mt-2 block font-normal leading-5 text-[#756963]">{hint}</span>}
    </label>
  );
}
type FieldProps = {
  form: FormData;
  update: (key: TextKey, value: string) => void;
  errors: Record<string, string>;
  name: TextKey;
  label: string;
  required?: boolean;
  wide?: boolean;
};

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-8 flex gap-3 rounded-xl border border-[#C9A45B]/30 bg-[#FBF7EF] p-4 text-sm leading-6 text-[#5D504B]">
      <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#9A742E]" />
      {children}
    </div>
  );
}

function Summary({ form }: { form: FormData }) {
  const rows = [
    ["Property", form.propertyType],
    ["Suburb", form.suburb],
    ["Bedrooms", form.bedrooms],
    ["Bathrooms", form.bathrooms],
    ["Service", form.service],
    ["Frequency", form.frequency],
    ["Add-ons", form.addons.length ? `${form.addons.length} selected` : "None selected"],
    ["Preferred date", form.preferredDate],
  ];
  return (
    <div className="rounded-2xl border border-[#C9A45B]/30 bg-[#F7F0E3] p-6 shadow-[0_16px_40px_rgba(70,37,29,0.06)]">
      <div className="flex items-center gap-3">
        <Home className="h-5 w-5 text-[#9A742E]" />
        <h2 className="font-semibold text-[#5A1425]">Your request</h2>
      </div>
      <dl className="mt-5 divide-y divide-[#DCCEBF]">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 py-3 text-sm">
            <dt className="text-[#756963]">{label}</dt>
            <dd className="max-w-[55%] text-right font-medium text-[#443937]">
              {value || "Not added"}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-5 flex gap-3 border-t border-[#DCCEBF] pt-5 text-sm leading-6 text-[#5D504B]">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#9A742E]" />
        <p>Your request will be reviewed and a personalised quotation will be prepared.</p>
      </div>
    </div>
  );
}

function Review({
  form,
  setForm,
  errors,
}: {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  errors: Record<string, string>;
}) {
  const items = [
    ["Property type", form.propertyType],
    ["Suburb", form.suburb],
    ["Bedrooms", form.bedrooms],
    ["Bathrooms", form.bathrooms],
    ["Selected service", form.service],
    ["Frequency", form.frequency],
    ["Home condition", form.condition],
    ["Selected add-ons", form.addons.join(", ") || "None selected"],
    ["Preferred date", form.preferredDate],
    ["Preferred time", form.preferredTime],
    ["Contact method", form.contactMethod],
  ];
  return (
    <div>
      <p className="leading-7 text-[#695E59]">
        Review your request below. Use Back to edit any answer before continuing.
      </p>
      <dl className="mt-6 grid gap-px overflow-hidden rounded-xl border border-[#E0D4C7] bg-[#E0D4C7] sm:grid-cols-2">
        {items.map(([label, value]) => (
          <div key={label} className="bg-[#FBF7EF] p-4">
            <dt className="text-xs font-semibold uppercase tracking-wider text-[#8C7043]">
              {label}
            </dt>
            <dd className="mt-2 text-sm font-medium">{value || "Not added"}</dd>
          </div>
        ))}
      </dl>
      <label className="mt-7 flex cursor-pointer items-start gap-3 rounded-xl border border-[#D8CCC0] p-4 text-sm leading-6">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(e) => setForm((current) => ({ ...current, consent: e.target.checked }))}
          className="mt-1 h-5 w-5 shrink-0 accent-[#5A1425]"
        />
        <span>
          I consent to Hestiva contacting me about this enquiry and acknowledge the{" "}
          <a href="/terms" className="font-semibold text-[#5A1425] underline underline-offset-4">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="font-semibold text-[#5A1425] underline underline-offset-4">
            Privacy Policy
          </a>
          .
        </span>
      </label>
      {errors.consent && (
        <p role="alert" className="mt-2 text-sm text-[#9B3349]">
          {errors.consent}
        </p>
      )}
      <Notice>
        Sensitive access details, alarm information and valuables information should not be sent
        through WhatsApp.
      </Notice>
    </div>
  );
}

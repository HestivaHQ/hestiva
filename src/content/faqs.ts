export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type FaqCategory = {
  title: string;
  description: string;
  items: readonly FaqItem[];
};

export const faqCategories: readonly FaqCategory[] = [
  {
    title: "Getting started",
    description: "The basics of Homent, quotations, bookings and service areas.",
    items: [
      {
        id: "what-is-homent",
        question: "What kind of cleaning company is Homent?",
        answer:
          "Homent is a residential cleaning company serving selected areas across Johannesburg North, Randburg, Rosebank and central-north Johannesburg, Roodepoort and Johannesburg West, and Midrand, Waterfall and Kyalami. The current public service range is focused on home cleaning.",
      },
      {
        id: "service-areas",
        question: "Which areas does Homent serve?",
        answer:
          "Homent serves selected suburbs across Sandton and Johannesburg North, Randburg, Rosebank and central-north Johannesburg, Roodepoort and Johannesburg West, and Midrand, Waterfall and Kyalami. The Areas We Serve page lists the currently approved suburbs. If your suburb is not listed, you can contact Homent for a service-area check; availability outside the listed areas is not guaranteed.",
      },
      {
        id: "request-quote",
        question: "How do I request a cleaning quote?",
        answer:
          "Use the Request a Quote form and tell us about your home, the cleaning service you need, the condition of the property, your preferred timing and any relevant household or access details. Homent reviews the information before preparing a personalised quotation.",
      },
      {
        id: "quote-information",
        question: "What information should I provide for an accurate quote?",
        answer:
          "Provide accurate details about the property type, location, approximate size, bedrooms and bathrooms, requested service, current condition, selected add-ons and anything that could affect the work or access. The more accurately the home and scope are described, the better Homent can prepare the quotation.",
      },
      {
        id: "requested-date-confirmation",
        question: "If I request a date, is my booking confirmed?",
        answer:
          "No. A preferred date or automated acknowledgement is not a confirmed booking. Your booking is confirmed only when Homent expressly accepts it, communicates the applicable service and payment details, and any required booking payment has been verified as received.",
      },
      {
        id: "quote-pricing-basis",
        question: "How is my quotation worked out?",
        answer:
          "Quotations are prepared from the information supplied about the property, its condition, the requested cleaning scope, selected add-ons and relevant circumstances. The applicable price and booking terms are communicated before you accept the service.",
      },
      {
        id: "quote-can-change",
        question: "Can the quoted price change after Homent sees the property?",
        answer:
          "It can change if the actual size, condition, access requirements or requested scope differs materially from the information used for the quotation. Homent will explain the difference and obtain approval before carrying out chargeable work outside the accepted scope.",
      },
      {
        id: "multiple-services",
        question: "Can I request more than one cleaning service or add-on?",
        answer:
          "Yes. You can describe multiple cleaning needs and select available add-ons when requesting your quote. Any task outside the confirmed scope should be agreed before the booking or approved before additional chargeable work is carried out.",
      },
      {
        id: "photos-and-notes",
        question: "Can I send photos or extra notes with my quote request?",
        answer:
          "Yes. The quote process allows you to add photos and notes where they help explain the condition of the home, areas needing attention or other relevant details. Only send information that is useful for the quotation or service.",
      },
      {
        id: "recurring-cleaning",
        question: "Can I arrange recurring cleaning?",
        answer:
          "Yes. Regular home cleaning can be requested as a recurring service. Recurring residential cleaning has no fixed-term lock-in. The agreed frequency and schedule are confirmed as part of the booking, and customers may later end or pause the recurring arrangement with at least 14 days' notice.",
      },
    ],
  },
  {
    title: "Choosing the right service",
    description: "What the main Homent services are designed for and how add-ons work.",
    items: [
      {
        id: "regular-vs-deep",
        question: "What is the difference between Regular Home Cleaning and Deep Cleaning?",
        answer:
          "Regular Home Cleaning is intended for routine upkeep of a lived-in home, including everyday dusting, floors, kitchen surfaces, bathrooms and general finishing touches. Deep Cleaning is more detailed and is intended for homes that need additional time, broader surface attention or attention to accumulated build-up and detail areas.",
      },
      {
        id: "move-in-cleaning",
        question: "What is included in Move-In Cleaning?",
        answer:
          "Move-In Cleaning is designed for an empty or mostly empty home before you settle in. The confirmed scope can include accessible cupboards and surfaces, kitchens, bathrooms, floors, bedrooms, living areas, selected interior windows and final pre-occupancy finishing.",
      },
      {
        id: "move-out-cleaning",
        question: "What is Move-Out Cleaning for?",
        answer:
          "Move-Out Cleaning is a detailed clean for an empty or mostly empty property at the end of a move. It can cover empty rooms, kitchens, bathrooms, accessible cupboard interiors, floors, selected interior windows and approved move-out add-ons according to the quotation.",
      },
      {
        id: "apartment-cleaning",
        question: "Do you clean apartments as well as houses?",
        answer:
          "Yes. Homent offers residential apartment cleaning for studios and multi-bedroom units. Building access, the unit floor and other relevant access details are captured during the quotation process so the service can be planned appropriately.",
      },
      {
        id: "room-specific-cleaning",
        question: "Can I request cleaning for only a kitchen, bathroom, bedroom or living area?",
        answer:
          "Yes. Homent has focused residential services for kitchens, bathrooms, bedrooms and living areas. The exact rooms and tasks included are confirmed in the quotation so the scope is clear before the booking.",
      },
      {
        id: "interior-windows",
        question: "Does Homent clean windows?",
        answer:
          "Homent offers interior window cleaning for safely reachable residential windows, glass doors, frames and sills included in the quotation. Specialist-access or unsafe window work is outside the normal residential scope.",
      },
      {
        id: "laundry-folding",
        question: "Can I add Laundry or Ironing to my cleaning visit?",
        answer:
          "Yes, but Laundry and Ironing are add-ons only to eligible Regular Home Cleaning or Deep Cleaning visits and cannot be booked on their own. Laundry uses the customer's safe, working washing equipment: a washing machine with tumble dryer supports Wash, Dry & Fold, while a washing machine with a suitable line or drying rack supports Wash & Hang. Ironing is a separate add-on for suitable clean, dry clothing and requires a safe, working iron and ironing board. Requested load quantities are confirmed during quoting.",
      },
      {
        id: "eco-conscious",
        question: "Can I tell Homent about fragrance sensitivities or cleaning-product preferences?",
        answer:
          "Yes. Product preferences, fragrance sensitivities, allergies and household restrictions should be shared during the quotation process. Homent can record those requirements and discuss a suitable approach. This does not mean every requested product or product claim is automatically available or suitable.",
      },
      {
        id: "add-ons",
        question: "What cleaning add-ons can I request?",
        answer:
          "Available add-ons can include tasks such as inside-oven cleaning, inside-fridge cleaning, interior cupboard cleaning, interior windows, Laundry and Ironing on eligible whole-home cleaning visits, bed making or linen changes, balcony or patio cleaning and additional rooms or fixtures. The available options and final scope are confirmed with your quotation.",
      },
      {
        id: "unlisted-task",
        question: "What if I need a cleaning task that is not listed on the website?",
        answer:
          "Describe the task when requesting your quote or contact Homent before booking. Homent will confirm whether it can be included. Work that is unsafe, unlawful, specialist in nature or outside the agreed service may be declined or require a different arrangement.",
      },
    ],
  },
  {
    title: "Preparing your home and access",
    description: "What to tell Homent before the visit and how to avoid access problems.",
    items: [
      {
        id: "need-to-be-home",
        question: "Do I need to be at home while the cleaning is done?",
        answer:
          "Not necessarily. What matters is that safe, lawful and timely access is arranged in advance. You can tell Homent whether someone will be present and provide the appropriate access instructions when arranging the service.",
      },
      {
        id: "estate-complex-access",
        question: "What if I live in an estate, complex or access-controlled building?",
        answer:
          "Please provide the relevant access instructions when requesting or confirming your service. This can include building or complex access requirements, security instructions and any parking information needed for the visit.",
      },
      {
        id: "pets",
        question: "What should I tell Homent about pets in my home?",
        answer:
          "Please disclose relevant pets and any information that could affect safe access or the cleaning visit. The quote process allows you to describe the pet type and relevant behaviour or household arrangements so the visit can be planned with your home in mind.",
      },
      {
        id: "allergies-restrictions",
        question: "What if someone in my household has allergies or product restrictions?",
        answer:
          "Tell Homent before the visit and include the relevant restriction in your quotation details. Customers are responsible for identifying relevant allergies, product restrictions and specialist-surface concerns so they can be considered before cleaning begins.",
      },
      {
        id: "fragile-off-limits",
        question: "Can I mark certain rooms or items as off-limits?",
        answer:
          "Yes. Tell Homent about private or restricted areas, fragile items, existing damage and specialist surfaces before the service. Clear instructions help keep the agreed scope and household boundaries understood.",
      },
      {
        id: "valuables",
        question: "What should I do with valuables before a cleaning visit?",
        answer:
          "Where reasonably possible, secure cash, jewellery, important documents and unusually valuable or fragile items before the visit. Also point out fragile or damaged items that Homent should know about.",
      },
      {
        id: "prepare-home",
        question: "How should I prepare my home before Homent arrives?",
        answer:
          "Make sure the agreed areas can be accessed safely, provide any necessary access instructions, secure valuables where reasonably possible and tell Homent about pets, fragile items, restricted spaces, allergies, product restrictions or existing damage that could affect the service.",
      },
      {
        id: "failed-access",
        question: "What happens if Homent cannot get into the property at the agreed time?",
        answer:
          "Homent will make a reasonable attempt to contact you and allow a reasonable short waiting period. If access remains unavailable, the visit may be treated as a late cancellation. Homent will not bypass security or enter unlawfully.",
      },
    ],
  },
  {
    title: "Bookings, changes and payment",
    description: "What happens after a quote and what to know about changes, recurring billing and payment.",
    items: [
      {
        id: "cancel-reschedule",
        question: "How much notice should I give to cancel or reschedule?",
        answer:
          "Please give at least 24 hours' notice to cancel or reschedule an individual confirmed visit. With at least 24 hours' notice, there is no cancellation charge and rescheduling is free subject to availability. Ending or pausing an ongoing recurring arrangement requires at least 14 days' notice.",
      },
      {
        id: "late-cancellation-fee",
        question: "Can there be a fee for a late cancellation, no-show or failed access?",
        answer:
          "Yes. For less than 24 hours' notice, a no-show or failed access, the standard late-cancellation charge is 50% of the booked service price, subject to applicable South African consumer-law requirements and the circumstances. Homent may reduce or waive the charge where appropriate.",
      },
      {
        id: "deposit",
        question: "Do I have to pay a deposit?",
        answer:
          "Yes. Initial and once-off bookings require a 50% deposit to secure the booking, with the remaining 50% due when the service is completed. Where the price is known, your quotation or booking correspondence will show the actual rand amounts.",
      },
      {
        id: "payment-method",
        question: "How and when do I pay?",
        answer:
          "At launch, Homent supports EFT using the payment instructions supplied with your quotation or booking correspondence. For an initial or once-off booking, 50% is required to secure the booking and the remaining 50% is due on completion. Proof of payment shows that payment was initiated, but the booking is financially confirmed only once the required payment has been verified as received.",
      },
      {
        id: "recurring-payment",
        question: "How does payment work for recurring cleaning?",
        answer:
          "Standard recurring cleaning is billed per job. Homent keeps an advance equal to 50% of one normal scheduled visit toward your next clean. After each completed visit, your payment settles the outstanding part of that visit and replenishes the 50% advance for the next scheduled visit.",
      },
      {
        id: "month-end-billing",
        question: "Can recurring customers pay at month end?",
        answer:
          "Eligible recurring customers may request month-end billing after two successfully paid months of standard per-job service. Approval is not automatic and the account must be current and in good standing. Approved customers choose a billing date from the 25th through the 7th, and the bill reflects the actual completed visits in that billing cycle.",
      },
      {
        id: "refund-timing",
        question: "How long does an approved refund take?",
        answer:
          "Homent initiates an approved refund within 5 business days. Your bank or payment provider may take additional time to reflect the funds after Homent has initiated the refund.",
      },
      {
        id: "late-payment",
        question: "What happens if a payment is late?",
        answer:
          "Homent does not currently charge late-payment interest or a late fee. Payment reminders may be sent and future cleaning can be placed on hold rather than allowing unpaid services to accumulate. An outstanding amount of R50 or less does not by itself place the next service on hold, although the balance remains payable.",
      },
      {
        id: "extra-work",
        question: "Can Homent charge me for extra work I did not approve?",
        answer:
          "Work outside the accepted quotation or confirmed scope will not be charged unless you first approve the additional work and the associated price or schedule change.",
      },
      {
        id: "condition-different",
        question: "What happens if the home needs more work than I described in the quote request?",
        answer:
          "If the actual condition, size, access requirements or scope differs materially from the information supplied, Homent may need to revise the plan or quotation. The difference will be explained and approval obtained before chargeable work outside the accepted scope is performed.",
      },
    ],
  },
  {
    title: "During and after the service",
    description: "Service expectations, concerns, damage reporting and privacy.",
    items: [
      {
        id: "stains-results",
        question: "Is every stain, mark or build-up guaranteed to come out?",
        answer:
          "No blanket result can be promised for every surface or mark. Cleaning results can depend on the age and condition of the surface, existing staining or damage, safe access, available time and the agreed scope. Homent may decline or stop work that risks damage or requires specialist treatment.",
      },
      {
        id: "service-concern",
        question: "What should I do if I am unhappy with part of the cleaning?",
        answer:
          "Report the concern as soon as reasonably possible, preferably within 48 hours of the service, and provide enough information for Homent to investigate. Homent aims to provide a substantive response within 5 business days.",
      },
      {
        id: "remedy-return",
        question: "Will Homent come back if a cleaning-quality concern is confirmed?",
        answer:
          "Where a cleaning-quality concern is substantiated, Homent may first offer a reasonable remedy. Depending on the circumstances, that can include returning to correct the affected work where appropriate.",
      },
      {
        id: "damage-loss",
        question: "What should I do if I believe something was damaged or lost during a service?",
        answer:
          "Report suspected loss or damage as soon as it is discovered, preferably within 48 hours, and include photographs or other relevant information where available. Homent will investigate before determining cause, responsibility or an appropriate remedy.",
      },
      {
        id: "privacy",
        question: "How does Homent handle the personal information I provide?",
        answer:
          "Homent collects information reasonably needed to answer enquiries, prepare quotations, arrange and deliver services, communicate with customers and meet legal obligations. Personal information is handled in line with Homent's Privacy Policy and South Africa's POPIA requirements. Please provide only information relevant to your enquiry, quotation or service.",
      },
      {
        id: "contact-homent",
        question: "What is the best way to contact Homent if I still have a question?",
        answer:
          "You can contact Homent by phone or WhatsApp on 068 423 1614, email general enquiries to info@homent.co.za, or use the Contact page. Quote requests can also be sent through the dedicated Request a Quote page.",
      },
    ],
  },
] as const;

export const allFaqs = faqCategories.flatMap((category) => [...category.items]);

export const homepageFaqIds = [
  "quote-pricing-basis",
  "requested-date-confirmation",
  "regular-vs-deep",
  "need-to-be-home",
  "pets",
  "cancel-reschedule",
] as const;

export const homepageFaqs = homepageFaqIds
  .map((id) => allFaqs.find((faq) => faq.id === id))
  .filter((faq): faq is FaqItem => Boolean(faq));
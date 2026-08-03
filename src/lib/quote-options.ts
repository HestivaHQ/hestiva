export const SERVICE_OPTIONS = [
  "Regular Home Cleaning",
  "Deep Cleaning",
  "Move-In Cleaning",
  "Move-Out Cleaning",
  "Apartment Cleaning",
  "Kitchen Cleaning",
  "Bathroom Sanitisation",
  "Laundry Folding",
  "Multiple Services Required",
  "Other (Please Describe)",
] as const;

const homeTypes = ["Apartment", "Townhouse", "Freestanding Home", "Other"];

export const JOB_TYPES: Record<string, string[]> = {
  "Regular Home Cleaning": [
    "Once-Off Cleaning",
    "Weekly Cleaning",
    "Fortnightly Cleaning",
    "Monthly Cleaning",
  ],
  "Deep Cleaning": homeTypes,
  "Move-In Cleaning": homeTypes,
  "Move-Out Cleaning": homeTypes,
  "Apartment Cleaning": ["Studio", "One Bedroom", "Two Bedrooms", "Three or More Bedrooms"],
  "Kitchen Cleaning": ["Standard Cleaning", "Deep Cleaning"],
  "Bathroom Sanitisation": ["One Bathroom", "Two Bathrooms", "Three or More Bathrooms"],
  "Laundry Folding": ["Add to Cleaning Visit", "Laundry Folding Only"],
};

export const MULTIPLE_SERVICE_CATEGORIES = SERVICE_OPTIONS.slice(0, 8);

export const CONTACT_METHODS = ["Phone Call", "WhatsApp", "Email"] as const;

export const URGENCY_OPTIONS = [
  "As Soon as Available",
  "This Week",
  "Next Week",
  "Flexible",
] as const;

export const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const ACCEPTED_FILE_EXT = ".jpg,.jpeg,.png,.pdf,.doc,.docx";
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const SERVICE_OPTIONS = [
  "Regular Home Cleaning",
  "Deep Cleaning",
  "Move-In Cleaning",
  "Move-Out Cleaning",
  "Kitchen Cleaning",
  "Bathroom Sanitisation",
  "Bedroom Cleaning",
  "Living Area Cleaning",
  "Interior Window Cleaning",
  "Apartment Cleaning",
  "Eco-Friendly Cleaning",
  "Add-On Services",
  "Multiple Services Required",
  "Other (Please Describe)",
] as const;

export const JOB_TYPES: Record<string, string[]> = {
  "Regular Home Cleaning": ["Once-Off", "Weekly", "Fortnightly", "Monthly", "Other"],
  "Deep Cleaning": ["Whole Home", "Selected Rooms", "Before an Event", "After an Event", "Other"],
  "Move-In Cleaning": ["Empty Home", "Partly Furnished Home", "Apartment", "House", "Other"],
  "Move-Out Cleaning": ["Empty Home", "Partly Furnished Home", "Apartment", "House", "Other"],
  "Kitchen Cleaning": ["Standard Kitchen Clean", "Detailed Kitchen Clean", "Appliance Add-Ons", "Other"],
  "Bathroom Sanitisation": ["Single Bathroom", "Multiple Bathrooms", "Detailed Sanitisation", "Other"],
  "Bedroom Cleaning": ["Single Bedroom", "Multiple Bedrooms", "Linen Change", "Other"],
  "Living Area Cleaning": ["Lounge", "Dining Area", "Open-Plan Area", "Multiple Living Areas", "Other"],
  "Interior Window Cleaning": ["Selected Windows", "Whole Home", "Glass Doors", "Other"],
  "Apartment Cleaning": ["Studio", "One Bedroom", "Two Bedroom", "Three Bedroom or Larger", "Other"],
  "Eco-Friendly Cleaning": ["Whole Home", "Selected Rooms", "Recurring Service", "Other"],
  "Add-On Services": ["Fridge Interior", "Oven Interior", "Cupboard Interiors", "Linen Change", "Other"],
};

export const MULTIPLE_SERVICE_CATEGORIES = [
  "Regular Home Cleaning",
  "Deep Cleaning",
  "Move-In Cleaning",
  "Move-Out Cleaning",
  "Kitchen Cleaning",
  "Bathroom Sanitisation",
  "Bedroom Cleaning",
  "Living Area Cleaning",
  "Interior Window Cleaning",
  "Apartment Cleaning",
  "Eco-Friendly Cleaning",
  "Add-On Services",
];

export const CONTACT_METHODS = ["Phone Call", "WhatsApp", "Email"] as const;

export const URGENCY_OPTIONS = [
  "As Soon as Possible",
  "Within the Next Few Days",
  "This Week",
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

export type OptionalBusinessDetails = {
  domain: string | null;
  email: string | null;
  phone: string | null;
  whatsApp: string | null;
  serviceAreas: readonly string[];
  legalName: string | null;
  registrationNumber: string | null;
  address: string | null;
  operatingHours: string | null;
};

export type BrandAssets = {
  logo: string | null;
  favicon: string | null;
  socialImage: string | null;
};

export type SiteConfig = {
  name: string;
  tagline: string;
  businessType: string;
  defaultTitle: string;
  defaultDescription: string;
  business: OptionalBusinessDetails;
  assets: BrandAssets;
};

export const siteConfig: SiteConfig = {
  name: "Hestiva",
  tagline: "Grace in Every Detail.",
  businessType: "Residential Cleaning Company",
  defaultTitle: "Hestiva | Residential Cleaning",
  defaultDescription:
    "Hestiva is a residential cleaning company focused on calm, attentive care for the home.",
  business: {
    domain: null,
    email: null,
    phone: null,
    whatsApp: null,
    serviceAreas: [],
    legalName: null,
    registrationNumber: null,
    address: null,
    operatingHours: null,
  },
  assets: {
    logo: null,
    favicon: null,
    socialImage: null,
  },
};

export function absoluteUrl(path = "/"): string | null {
  const domain = siteConfig.business.domain;
  if (!domain) return null;

  const normalizedDomain = domain.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedDomain}${normalizedPath}`;
}

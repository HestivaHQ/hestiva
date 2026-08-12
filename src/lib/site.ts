import { approvedServiceAreas } from "@/content/service-areas";

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
  logoGold: string | null;
  logoWhite: string | null;
  logoBlack: string | null;
  favicon16: string | null;
  favicon32: string | null;
  appleTouchIcon: string | null;
  appIcon: string | null;
  socialImage: string | null;
  profileBadge: string | null;
  monogram: string | null;
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

export const SITE_NAME = "Homent";
export const COMPANY_NAME = "Homent";
export const SITE_URL = "https://www.homent.co.za";
export const TAGLINE = "Grace in Every Detail";
export const DEFAULT_SERVICE_AREA = "Johannesburg North, Randburg, Johannesburg West and Midrand";

export const BRAND_ASSETS = {
  logoPrimary: "/brand/logo/homent-burgundy.png",
  logoGold: "/brand/logo/homent-gold.png",
  logoWhite: "/brand/logo/homent-white.png",
  logoBlack: "/brand/logo/homent-black.png",
  favicon16: "/brand/favicon/favicon-16.png",
  favicon32: "/brand/favicon/favicon-32.png",
  appleTouchIcon: "/brand/favicon/favicon-180.png",
  appIcon: "/brand/favicon/favicon-512.png",
  socialImage: "/brand/social/social-share-1200x630.png",
  profileBadge: "/brand/badge/profile-badge.png",
  monogram: "/brand/monogram/monogram.png",
} as const;

export const siteConfig: SiteConfig = {
  name: SITE_NAME,
  tagline: `${TAGLINE}.`,
  businessType: "Residential Cleaning Company",
  defaultTitle: `${SITE_NAME} | Residential Cleaning`,
  defaultDescription:
    "Professional home cleaning across selected Johannesburg North, Randburg, Rosebank, Roodepoort, Midrand, Waterfall and Kyalami areas.",
  business: {
    domain: SITE_URL,
    email: "info@homent.co.za",
    phone: "+27684231614",
    whatsApp: "+27684231614",
    serviceAreas: approvedServiceAreas,
    legalName: null,
    registrationNumber: null,
    address: null,
    operatingHours: null,
  },
  assets: {
    logo: BRAND_ASSETS.logoPrimary,
    logoGold: BRAND_ASSETS.logoGold,
    logoWhite: BRAND_ASSETS.logoWhite,
    logoBlack: BRAND_ASSETS.logoBlack,
    favicon16: BRAND_ASSETS.favicon16,
    favicon32: BRAND_ASSETS.favicon32,
    appleTouchIcon: BRAND_ASSETS.appleTouchIcon,
    appIcon: BRAND_ASSETS.appIcon,
    socialImage: BRAND_ASSETS.socialImage,
    profileBadge: BRAND_ASSETS.profileBadge,
    monogram: BRAND_ASSETS.monogram,
  },
};

export const SOCIAL_IMAGE = `${SITE_URL}${BRAND_ASSETS.socialImage}`;

export function absoluteUrl(path = "/"): string | null {
  const domain = siteConfig.business.domain;
  if (!domain) return null;

  const normalizedDomain = domain.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedDomain}${normalizedPath}`;
}

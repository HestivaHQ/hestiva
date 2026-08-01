export const SITE_NAME = "Hestiva";
export const COMPANY_NAME = "Hestiva";
export const SITE_URL = "https://www.hestiva.co.za";
export const TAGLINE = "Grace in Every Detail";
export const DEFAULT_SERVICE_AREA = "Randburg to Centurion";

export const BRAND_ASSETS = {
  logoPrimary: "/brand/logo/hestiva-burgundy.png",
  logoGold: "/brand/logo/hestiva-gold.png",
  logoWhite: "/brand/logo/hestiva-white.png",
  logoBlack: "/brand/logo/hestiva-black.png",
  favicon16: "/brand/favicon/favicon-16.png",
  favicon32: "/brand/favicon/favicon-32.png",
  appleTouchIcon: "/brand/favicon/favicon-180.png",
  appIcon: "/brand/favicon/favicon-512.png",
  socialImage: "/brand/social/social-share-1200x630.png",
  profileBadge: "/brand/badge/profile-badge.png",
  monogram: "/brand/monogram/monogram.png",
} as const;

export const SOCIAL_IMAGE = `${SITE_URL}${BRAND_ASSETS.socialImage}`;

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
}

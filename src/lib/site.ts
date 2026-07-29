export const SITE_NAME = "Hestiva";
export const COMPANY_NAME = "Hestiva (Pty) Ltd";
export const SITE_URL = "https://www.hestiva.co.za";
export const SOCIAL_IMAGE = `${SITE_URL}/assets/hestiva-social.jpg`;
export const DEFAULT_SERVICE_AREA = "Gauteng";
export const TAGLINE = "Grace in Every Detail";

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
}

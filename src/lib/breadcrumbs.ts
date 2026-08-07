export type BreadcrumbItem = {
  label: string;
  path: string;
};

export const pageBreadcrumbs = (label: string, path: string): BreadcrumbItem[] => [
  { label: "Home", path: "/" },
  { label, path },
];

export const serviceBreadcrumbs = (name?: string, path?: string): BreadcrumbItem[] => [
  { label: "Home", path: "/" },
  { label: "Services", path: "/services" },
  ...(name && path ? [{ label: name, path }] : []),
];

export const locationBreadcrumbs = (name?: string, path?: string): BreadcrumbItem[] => [
  { label: "Home", path: "/" },
  { label: "Locations", path: "/locations" },
  ...(name && path ? [{ label: name, path }] : []),
];

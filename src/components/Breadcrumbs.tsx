import { Link } from "@tanstack/react-router";

import type { BreadcrumbItem } from "@/lib/breadcrumbs";
import { cn } from "@/lib/utils";

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
  linkClassName?: string;
  separatorClassName?: string;
};

export function Breadcrumbs({
  items,
  className,
  linkClassName,
  separatorClassName,
}: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <li key={item.path} className="contents">
              {index > 0 && (
                <span aria-hidden="true" className={separatorClassName}>
                  /
                </span>
              )}
              {current ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <Link to={item.path} activeOptions={{ exact: true }} className={linkClassName}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

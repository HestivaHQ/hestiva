import type { ServiceImageData } from "@/content/services";

type ServiceImageProps = {
  image: ServiceImageData;
  className?: string;
  eager?: boolean;
};

export function ServiceImage({ image, className, eager = false }: ServiceImageProps) {
  return (
    <picture className={className}>
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding="async"
        className="h-full w-full object-cover object-center"
      />
    </picture>
  );
}

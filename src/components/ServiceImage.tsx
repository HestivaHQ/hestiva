import type { ServiceImageData } from "@/content/services";

type ServiceImageProps = {
  image: ServiceImageData;
  className?: string;
  eager?: boolean;
};

export function ServiceImage({ image, className, eager = false }: ServiceImageProps) {
  const responsiveServiceImage =
    image.src.startsWith("/images/services/") && image.src.endsWith(".png");
  const webpBase = responsiveServiceImage ? image.src.slice(0, -4) : null;

  return (
    <picture className={className}>
      {webpBase && (
        <source
          type="image/webp"
          srcSet={`${webpBase}-480.webp 480w, ${webpBase}-768.webp 768w, ${webpBase}-1200.webp 1200w`}
          sizes="(min-width: 1280px) 592px, (min-width: 1024px) 50vw, calc(100vw - 3rem)"
        />
      )}
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

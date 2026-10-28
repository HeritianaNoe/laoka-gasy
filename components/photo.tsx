import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
  width?: number;
  height?: number;
};

/**
 * Renders either a normal path / blob URL (via next/image) or a data: URL (plain <img>).
 * next/image does not accept data: URLs.
 */
export function Photo({ src, alt, fill, priority, sizes, className, width, height }: Props) {
  if (src.startsWith("data:")) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className={`absolute inset-0 size-full object-cover ${className ?? ""}`} />
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} width={width} height={height} className={className} />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      priority={priority}
      sizes={sizes}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={className}
    />
  );
}

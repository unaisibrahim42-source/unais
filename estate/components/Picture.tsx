import type { Scene } from "@/lib/types";
import { srcSet } from "@/lib/types";

/** Responsive AVIF/WebP image for a processed photo, with a blurred placeholder. */
export function Picture({
  scene,
  sizes = "100vw",
  className = "",
  imgClassName = "",
  priority = false,
  alt,
}: {
  scene: Scene;
  sizes?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  alt?: string;
}) {
  const mid = scene.image.widths[Math.min(1, scene.image.widths.length - 1)];
  return (
    <picture className={className} style={{ backgroundImage: `url(${scene.image.placeholder})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <source type="image/avif" srcSet={srcSet(scene, "avif")} sizes={sizes} />
      <img
        src={`${scene.image.base}-${mid}.webp`}
        srcSet={srcSet(scene)}
        sizes={sizes}
        alt={alt ?? scene.caption.title}
        width={scene.image.width}
        height={scene.image.height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        className={imgClassName}
      />
    </picture>
  );
}

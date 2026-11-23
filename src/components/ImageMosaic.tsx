import { ListMusicIcon, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface ImageMosaicProps {
  /** Image URLs, e.g. the album covers of a playlist's first tracks */
  images?: string[];
  FallbackIcon?: LucideIcon;
  className?: string;
}

const NO_IMAGES: string[] = [];

export function ImageMosaic({
  images = NO_IMAGES,
  FallbackIcon = ListMusicIcon,
  className
}: ImageMosaicProps) {
  /**
   * - 4+ images: 2×2 grid of the first 4, all the same size
   * - 1 to 3 images: the first one fills the square (2 or 3 can't make an even square grid)
   */
  const tiles = images.length >= 4 ? images.slice(0, 4) : images.slice(0, 1);

  if (tiles.length === 0) {
    return (
      <div className="flex items-center justify-center aspect-square overflow-hidden rounded-xl bg-muted">
        <FallbackIcon className="size-10 text-muted-foreground" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid aspect-square overflow-hidden rounded-xl bg-muted",
        tiles.length === 4 && "grid-cols-2",
        className
      )}
    >
      {tiles.map((url, index) => (
        <img
          key={`${url}-${index.toString()}`}
          src={url}
          alt=""
          loading="lazy"
          className="size-full object-cover"
        />
      ))}
    </div>
  );
}

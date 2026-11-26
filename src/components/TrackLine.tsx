import { MusicIcon } from "lucide-react";
import { ReactNode } from "react";

import { formatDuration, formatReleaseDate } from "@/lib/format";
import { cn } from "@/lib/utils";

interface TrackLineProps {
  track: SpotifyApi.TrackObjectFull;
  actions?: ReactNode;
  className?: string;
}

export function TrackLine({ track, actions, className }: TrackLineProps) {
  // Spotify lists the largest image first: the last one is enough for a thumbnail
  const imageUrl = track.album.images.at(-1)?.url;
  const artists = track.artists.map((artist) => artist.name).join(", ");

  return (
    // Container: the release date shows only when the line itself is wide enough (not in the
    // search dropdown), whatever the screen size
    <div className={cn("@container", className)}>
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
          {imageUrl ? (
            <img src={imageUrl} alt="" loading="lazy" className="size-full object-cover" />
          ) : (
            <MusicIcon className="size-4 text-muted-foreground" aria-hidden="true" />
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <p className="truncate font-medium">{track.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {artists} · {track.album.name}
          </p>
        </div>

        <span className="hidden w-24 shrink-0 text-right text-sm text-muted-foreground @lg:block">
          {formatReleaseDate(track.album)}
        </span>

        <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
          {formatDuration(track.duration_ms)}
        </span>

        {actions}
      </div>
    </div>
  );
}

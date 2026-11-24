import { MusicIcon, PlayIcon } from "lucide-react";
import { ReactNode } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { formatDuration } from "@/lib/format";
import { cn } from "@/lib/utils";

interface TrackLineProps {
  track: SpotifyApi.TrackObjectFull;
  action?: ReactNode;
  showPlayButton?: boolean;
  /** "li" inside a <ul> (default), "div" where the parent is already the item, e.g. a combobox option */
  as?: "li" | "div";
  className?: string;
}

export function TrackLine({
  track,
  action,
  showPlayButton = true,
  as: Component = "li",
  className
}: TrackLineProps) {
  // Spotify lists the largest image first: the last one is enough for a thumbnail
  const imageUrl = track.album.images.at(-1)?.url;
  const isPlayable = track.is_playable !== false;
  const artists = track.artists.map((artist) => artist.name).join(", ");

  return (
    <Component className={cn("flex items-center gap-3 border-t py-2 first:border-t-0", className)}>
      <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
        {imageUrl ? (
          <img src={imageUrl} alt="" loading="lazy" className="size-full object-cover" />
        ) : (
          <MusicIcon className="size-4 text-muted-foreground" aria-hidden="true" />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <p className="truncate font-medium">{track.name}</p>
        <p className="truncate text-xs text-muted-foreground">{artists}</p>
      </div>

      <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
        {formatDuration(track.duration_ms)}
      </span>

      {action}

      {showPlayButton && <PlayButton track={track} isPlayable={isPlayable} />}
    </Component>
  );
}

interface PlayButtonProps {
  track: SpotifyApi.TrackObjectFull;
  isPlayable: boolean;
}

function PlayButton({ track, isPlayable }: PlayButtonProps) {
  const playLabel = `Play ${track.name} on Spotify`;
  const spotifyUrl = `https://open.spotify.com/track/${track.id}`;

  if (!isPlayable) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        disabled
        aria-label={`${track.name} isn't playable`}
      >
        <PlayIcon />
      </Button>
    );
  }

  return (
    <a
      href={spotifyUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={playLabel}
      className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full")}
    >
      <PlayIcon />
    </a>
  );
}

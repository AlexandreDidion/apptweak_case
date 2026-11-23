import { MusicIcon, PlayIcon } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { formatDuration } from "@/lib/format";
import { cn } from "@/lib/utils";

interface TrackLineProps {
  track: SpotifyApi.TrackObjectFull;
}

export function TrackLine({ track }: TrackLineProps) {
  // Spotify lists the largest image first: the last one is enough for a thumbnail
  const imageUrl = track.album.images.at(-1)?.url;
  const isPlayable = track.is_playable !== false;
  const playLabel = `Play ${track.name} on Spotify`;
  const spotifyUrl = `https://open.spotify.com/track/${track.id}`;

  return (
    <li className="flex items-center gap-3 border-t py-2 first:border-t-0">
      <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
        {imageUrl ? (
          <img src={imageUrl} alt="" loading="lazy" className="size-full object-cover" />
        ) : (
          <MusicIcon className="size-4 text-muted-foreground" aria-hidden="true" />
        )}
      </div>

      <p className="min-w-0 flex-1 truncate font-medium">{track.name}</p>

      <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
        {formatDuration(track.duration_ms)}
      </span>

      {isPlayable ? (
        <a
          href={spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={playLabel}
          className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full")}
        >
          <PlayIcon />
        </a>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          disabled
          aria-label={`${track.name} isn't playable`}
        >
          <PlayIcon />
        </Button>
      )}
    </li>
  );
}

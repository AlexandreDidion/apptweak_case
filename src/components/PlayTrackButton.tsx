import { PlayIcon } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PlayTrackButtonProps {
  track: SpotifyApi.TrackObjectFull;
}

export function PlayTrackButton({ track }: PlayTrackButtonProps) {
  const spotifyUrl = `https://open.spotify.com/track/${track.id}`;

  if (track.is_playable === false) {
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
      aria-label={`Play ${track.name} on Spotify`}
      className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full")}
    >
      <PlayIcon />
    </a>
  );
}

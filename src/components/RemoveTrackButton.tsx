import { MinusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface RemoveTrackButtonProps {
  track: SpotifyApi.TrackObjectFull;
  isRemoving: boolean;
  onRemove: () => void;
}

export function RemoveTrackButton({ track, isRemoving, onRemove }: RemoveTrackButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full"
      isLoading={isRemoving}
      aria-label={`Remove ${track.name} from the playlist`}
      onClick={onRemove}
    >
      <MinusIcon />
    </Button>
  );
}

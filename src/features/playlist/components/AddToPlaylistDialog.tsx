import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { selectUser } from "@/features/auth/selectors";
import { useAppSelector } from "@/store/hooks";

import { selectPlaylists } from "../selectors";

const SELECT_ID = "add-to-playlist-select";

interface AddToPlaylistDialogProps {
  track: SpotifyApi.TrackObjectFull | null;
  isAdding: boolean;
  onAdd: (playlistId: string, track: SpotifyApi.TrackObjectFull) => void;
  onClose: () => void;
}

export function AddToPlaylistDialog({ track, isAdding, onAdd, onClose }: AddToPlaylistDialogProps) {
  const user = useAppSelector(selectUser);
  const playlists = useAppSelector(selectPlaylists);

  const [playlistId, setPlaylistId] = useState<string | null>(null);

  const editablePlaylists = playlists.filter(
    (playlist) => playlist.owner.id === user?.id || playlist.collaborative
  );

  const playlistNameOptions = Object.fromEntries(
    editablePlaylists.map((playlist) => [playlist.id, playlist.name])
  );

  return (
    <Dialog
      open={track !== null}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to a playlist</DialogTitle>
          {track && <DialogDescription>Where should “{track.name}” go?</DialogDescription>}
        </DialogHeader>

        {editablePlaylists.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            You don&apos;t have a playlist to add tracks to yet. Create one first.
          </p>
        ) : (
          <Field>
            <FieldLabel htmlFor={SELECT_ID}>Playlist</FieldLabel>
            <Select items={playlistNameOptions} value={playlistId} onValueChange={setPlaylistId}>
              <SelectTrigger id={SELECT_ID} className="w-full">
                <SelectValue placeholder="Choose a playlist" />
              </SelectTrigger>
              <SelectContent>
                {editablePlaylists.map((playlist) => (
                  <SelectItem key={playlist.id} value={playlist.id}>
                    {playlist.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        )}

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button
            disabled={!playlistId}
            isLoading={isAdding}
            onClick={() => {
              if (track && playlistId) onAdd(playlistId, track);
            }}
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

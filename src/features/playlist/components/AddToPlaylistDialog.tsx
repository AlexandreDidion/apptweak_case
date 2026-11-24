import { useRef, useState } from "react";
import { toast } from "sonner";

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
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { selectUser } from "@/features/auth/selectors";
import { useAppSelector } from "@/store/hooks";
import { useReduxMutation } from "@/store/useReduxMutation";

import { selectAddItemsRequest, selectPlaylists } from "../selectors";
import { addItemsToPlaylist } from "../slice";

const SELECT_ID = "add-to-playlist-select";

interface AddToPlaylistDialogProps {
  track: SpotifyApi.TrackObjectFull | null;
  onClose: () => void;
}

export function AddToPlaylistDialog({ track, onClose }: AddToPlaylistDialogProps) {
  const user = useAppSelector(selectUser);
  const playlists = useAppSelector(selectPlaylists);

  const [playlistId, setPlaylistId] = useState<string | null>(null);

  const isAddingFromDialogRef = useRef(false);
  const addMutation = useReduxMutation({
    action: addItemsToPlaylist,
    selectState: selectAddItemsRequest,
    onSuccess: () => {
      if (!isAddingFromDialogRef.current) return;

      isAddingFromDialogRef.current = false;

      if (track && playlistId) {
        toast.success(
          `Added "${track.name}" to "${playlistNameOptions[playlistId] ?? "the playlist"}"`
        );
      }

      close();
    },
    onError: () => {
      isAddingFromDialogRef.current = false;
    }
  });

  const editablePlaylists = playlists.filter(
    (playlist) => playlist.owner.id === user?.userId || playlist.collaborative
  );

  const playlistNameOptions = Object.fromEntries(
    editablePlaylists.map((playlist) => [playlist.id, playlist.name])
  );

  function close() {
    setPlaylistId(null);
    onClose();
  }

  return (
    <Dialog
      open={track !== null}
      onOpenChange={(isOpen) => {
        if (!isOpen) close();
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
            {addMutation.isError && <FieldError>{addMutation.error}</FieldError>}
          </Field>
        )}

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button
            disabled={!playlistId}
            isLoading={addMutation.isPending}
            onClick={() => {
              if (!track || !playlistId) return;

              isAddingFromDialogRef.current = true;
              addMutation.mutate({ playlistId, tracks: [track] });
            }}
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

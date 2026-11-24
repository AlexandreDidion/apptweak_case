import { useParams } from "@tanstack/react-router";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useReduxMutation } from "@/store/useReduxMutation";

import { selectAddItemsRequest, selectPlaylist, selectPlaylists } from "./selectors";
import { addItemsToPlaylist, removeItemsFromPlaylist } from "./slice";

/**
 * Adds a track to a playlist, e.g. from the search:
 * - a playlist is open (/playlists/$playlistId): added to it directly.
 *   `targetPlaylistName` is its name, e.g. to tell the user where tracks go
 * - no playlist open: the track waits in `trackToPick`, render <AddToPlaylistDialog> to pick one
 *
 * Lets other features add tracks without depending on the playlist feature.
 */
export function useAddTrackToPlaylist() {
  const { playlistId } = useParams({ strict: false });
  const [trackToPick, setTrackToPick] = useState<SpotifyApi.TrackObjectFull | null>(null);

  const dispatch = useAppDispatch();
  const playlists = useAppSelector(selectPlaylists);
  const openedPlaylist = useAppSelector(selectPlaylist);

  // From the sidebar list, or the opened playlist if the list isn't loaded yet
  const targetPlaylistName = playlistId
    ? (playlists.find((playlist) => playlist.id === playlistId)?.name ??
      (openedPlaylist?.id === playlistId ? openedPlaylist.name : undefined))
    : undefined;

  // As the hook can be used in different contexts, we keep track of the pending add operation separately
  const pendingAddRef = useRef<{
    track: SpotifyApi.TrackObjectFull;
    playlistId: string;
    playlistName?: string;
  } | null>(null);

  const { mutate } = useReduxMutation({
    action: addItemsToPlaylist,
    selectState: selectAddItemsRequest,
    onSuccess: () => {
      const added = pendingAddRef.current;
      pendingAddRef.current = null;
      if (!added) return;

      toast.success(`Added "${added.track.name}" to "${added.playlistName ?? "the playlist"}"`, {
        action: {
          label: "Undo",
          onClick: () => {
            dispatch(
              removeItemsFromPlaylist({ playlistId: added.playlistId, uris: [added.track.uri] })
            );
          }
        }
      });
    },
    onError: (error) => {
      const failed = pendingAddRef.current;
      pendingAddRef.current = null;
      if (!failed) return;

      toast.error(`Could not add "${failed.track.name}"`, { description: error });
    }
  });

  const addTrack = useCallback(
    (track: SpotifyApi.TrackObjectFull) => {
      if (playlistId) {
        pendingAddRef.current = { track, playlistId, playlistName: targetPlaylistName };
        mutate({ playlistId, tracks: [track] });
      } else {
        setTrackToPick(track);
      }
    },
    [playlistId, targetPlaylistName, mutate]
  );

  const closePicker = useCallback(() => {
    setTrackToPick(null);
  }, []);

  return { addTrack, trackToPick, closePicker, targetPlaylistName };
}

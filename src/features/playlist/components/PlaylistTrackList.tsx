import { useState } from "react";
import { toast } from "sonner";

import { PlayTrackButton } from "@/components/PlayTrackButton";
import { TrackLine } from "@/components/TrackLine";
import { Button } from "@/components/ui/button";
import { selectUser } from "@/features/auth/selectors";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useReduxMutation } from "@/store/useReduxMutation";

import { RemoveTrackButton } from "../../../components/RemoveTrackButton";
import { playlistItemTracks } from "../playlistItemTracks";
import { selectGetMoreItemsRequest, selectRemoveItemsRequest } from "../selectors";
import { addItemsToPlaylist, getMorePlaylistItems, removeItemsFromPlaylist } from "../slice";

interface PlaylistTrackListProps {
  playlist: SpotifyApi.PlaylistObjectFull;
}

export function PlaylistTrackList({ playlist }: PlaylistTrackListProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const canEdit = playlist.owner.id === user?.userId || playlist.collaborative;
  const tracks = playlistItemTracks(playlist.items?.items ?? []);
  const hasMore = !!playlist.items && playlist.items.items.length < playlist.items.total;

  const { mutate: loadMore, isPending: isLoadingMore } = useReduxMutation({
    action: getMorePlaylistItems,
    selectState: selectGetMoreItemsRequest,
    onError: (error) => {
      toast.error("Could not load more tracks", { description: error });
    }
  });

  const [removal, setRemoval] = useState<{
    track: SpotifyApi.TrackObjectFull;
    /** Where the track was, in the playlist's items, to put it back on Undo */
    positions: number[];
  } | null>(null);

  const { mutate: removeItems } = useReduxMutation({
    action: removeItemsFromPlaylist,
    selectState: selectRemoveItemsRequest,
    onSuccess: () => {
      if (removal) {
        const { track, positions } = removal;
        toast.success(`Removed "${track.name}"`, {
          action: {
            label: "Undo",
            onClick: () => {
              dispatch(
                addItemsToPlaylist({
                  playlistId: playlist.id,
                  tracks: positions.map(() => track),
                  position: positions[0]
                })
              );
            }
          }
        });
      }
      setRemoval(null);
    },
    onError: (error) => {
      if (removal) {
        toast.error(`Could not remove "${removal.track.name}"`, { description: error });
      }
      setRemoval(null);
    }
  });

  if (tracks.length === 0 && !hasMore) {
    return <p>No tracks yet.</p>;
  }

  return (
    <div className="space-y-4">
      <ul>
        {tracks.map((track, index) => (
          <li key={`${track.id}-${index.toString()}`} className="border-t py-2 first:border-t-0">
            <TrackLine
              track={track}
              actions={
                <>
                  {canEdit && (
                    <RemoveTrackButton
                      track={track}
                      isRemoving={removal?.track.uri === track.uri}
                      onRemove={() => {
                        // Indexes in the playlist's items (Spotify's positions), not in `tracks`
                        const positions = (playlist.items?.items ?? []).flatMap(
                          (playlistItem, i) => (playlistItem.item?.uri === track.uri ? [i] : [])
                        );
                        setRemoval({ track, positions });

                        removeItems({ playlistId: playlist.id, uris: [track.uri] });
                      }}
                    />
                  )}
                  <PlayTrackButton track={track} />
                </>
              }
            />
          </li>
        ))}
      </ul>
      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            isLoading={isLoadingMore}
            onClick={() => {
              loadMore({ playlistId: playlist.id });
            }}
          >
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}

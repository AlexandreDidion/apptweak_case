import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useState } from "react";
import { toast } from "sonner";

import { PlayTrackButton } from "@/components/PlayTrackButton";
import { RemoveTrackButton } from "@/components/RemoveTrackButton";
import { TrackLine } from "@/components/TrackLine";
import { Button } from "@/components/ui/button";
import { selectUser } from "@/features/auth/selectors";
import { sortBy, SortDirection } from "@/lib/sorting";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useReduxMutation } from "@/store/useReduxMutation";

import { playlistTrackEntries } from "../playlistItemTracks";
import {
  selectGetMoreItemsRequest,
  selectRemoveItemsRequest,
  selectReorderItemsRequest
} from "../selectors";
import {
  addItemsToPlaylist,
  getMorePlaylistItems,
  removeItemsFromPlaylist,
  reorderPlaylistItems
} from "../slice";
import { TRACK_SORT_FIELDS } from "../trackSort";
import { SortableTrackItem } from "./SortableTrackItem";
import { PLAYLIST_ORDER, TrackSortControls, TrackSortOption } from "./TrackSortControls";

interface PlaylistTrackListProps {
  playlist: SpotifyApi.PlaylistObjectFull;
}

export function PlaylistTrackList({ playlist }: PlaylistTrackListProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const canEdit = playlist.owner.id === user?.id || playlist.collaborative;
  const [sortOption, setSortOption] = useState<TrackSortOption>(PLAYLIST_ORDER);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const playlistEntries = playlistTrackEntries(playlist.items?.items ?? []);
  // Only the loaded pages are sorted: "Load more" can bring tracks that belong higher up
  const entries =
    sortOption === PLAYLIST_ORDER
      ? playlistEntries
      : sortBy(
          playlistEntries,
          (entry) => TRACK_SORT_FIELDS[sortOption].value(entry.track),
          sortDirection
        );
  // Dragging only makes sense in the playlist's own order
  const canReorder = canEdit && sortOption === PLAYLIST_ORDER;
  const hasMore = !!playlist.items && playlist.items.items.length < playlist.items.total;

  const { mutate: loadMore, isPending: isLoadingMore } = useReduxMutation({
    action: getMorePlaylistItems,
    selectState: selectGetMoreItemsRequest,
    onError: (error) => {
      toast.error("Could not load more tracks", { description: error });
    }
  });

  const sensors = useSensors(useSensor(PointerSensor));

  const { mutate: reorder } = useReduxMutation({
    action: reorderPlaylistItems,
    selectState: selectReorderItemsRequest,
    onError: (error) => {
      toast.error("Could not move the track", { description: error });
    }
  });

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = entries.findIndex((entry) => entry.id === active.id);
    const to = entries.findIndex((entry) => entry.id === over.id);

    // Spotify's positions, not indexes in `entries`: hidden items (episodes…) count too
    const targetPosition = entries[to].position;
    reorder({
      playlistId: playlist.id,
      rangeStart: entries[from].position,
      // Moving down: goes after the target, so before the item that follows it
      insertBefore: to > from ? targetPosition + 1 : targetPosition
    });
  };

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

  if (entries.length === 0 && !hasMore) {
    return <p>No tracks yet.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <TrackSortControls
          sortOption={sortOption}
          direction={sortDirection}
          onSortOptionChange={setSortOption}
          onDirectionChange={setSortDirection}
        />
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={entries} strategy={verticalListSortingStrategy}>
          <ul>
            {entries.map(({ id, track }) => (
              <SortableTrackItem key={id} id={id} isReorderable={canReorder} trackName={track.name}>
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
              </SortableTrackItem>
            ))}
          </ul>
        </SortableContext>
      </DndContext>
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

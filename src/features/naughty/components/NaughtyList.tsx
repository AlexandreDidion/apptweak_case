import { ShuffleIcon } from "lucide-react";

import { PlayTrackButton } from "@/components/PlayTrackButton";
import { TrackLine } from "@/components/TrackLine";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useReduxQuery } from "@/store/useReduxQuery";

import { selectExplicitTrackCount, selectNaughtySample, selectNaughtyState } from "../selectors";
import { getNaughtyTracks } from "../slice";

const SKELETON_COUNT = 8;

/**
 * A random selection of explicit tracks, from a few random pages of the user's playlists
 */
export function NaughtyList() {
  const dispatch = useAppDispatch();
  const explicitTrackCount = useAppSelector(selectExplicitTrackCount);

  const {
    data: tracks,
    isLoading,
    isError,
    error
  } = useReduxQuery({
    action: getNaughtyTracks,
    selectData: selectNaughtySample,
    selectState: selectNaughtyState
  });

  if (isLoading) {
    return (
      <div aria-busy="true">
        <span className="sr-only">Loading the naughty list…</span>
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <div key={index} className="flex items-center gap-3 border-t py-2 first:border-t-0">
            <Skeleton className="size-10 shrink-0 rounded-md" />
            <div className="flex flex-1 flex-col gap-1.5">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) return <p>Could not load the naughty list: {error}</p>;

  if (tracks.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No explicit track found in your playlists, you&apos;re all clean!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {explicitTrackCount > tracks.length && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => {
              dispatch(getNaughtyTracks());
            }}
          >
            <ShuffleIcon />
            Shuffle
          </Button>
        </div>
      )}
      <ul>
        {tracks.map((track) => (
          <li key={track.id} className="border-t py-2 first:border-t-0">
            <TrackLine track={track} actions={<PlayTrackButton track={track} />} />
          </li>
        ))}
      </ul>
    </div>
  );
}

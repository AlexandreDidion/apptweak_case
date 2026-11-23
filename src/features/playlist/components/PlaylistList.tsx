import { useReduxQuery } from "@/store/useReduxQuery";

import { selectPlaylists, selectPlaylistState } from "../selectors";
import { getPlaylists } from "../slice";
import { PlaylistCard, PlaylistCardSkeleton } from "./PlaylistCard";

const GRID_CLASS_NAME = "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
const SKELETON_COUNT = 8;

export function PlaylistList() {
  const {
    data: playlists,
    isLoading,
    isError,
    error
  } = useReduxQuery({
    action: getPlaylists,
    selectData: selectPlaylists,
    selectState: selectPlaylistState
  });

  if (isLoading) {
    return (
      <div className={GRID_CLASS_NAME} aria-busy="true">
        <span className="sr-only">Loading playlists…</span>
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <PlaylistCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) return <p>Could not load playlists: {error}</p>;

  return (
    <ul className={GRID_CLASS_NAME}>
      {playlists.map((playlist) => (
        <PlaylistCard key={playlist.id} playlist={playlist} />
      ))}
    </ul>
  );
}

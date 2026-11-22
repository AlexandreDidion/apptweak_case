import { useReduxQuery } from "@/store/useReduxQuery";

import { selectPlaylists, selectPlaylistState } from "./selectors";
import { getPlaylists } from "./slice";

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

  if (isLoading) return <p>Loading playlists…</p>;
  if (isError) return <p>Could not load playlists: {error}</p>;

  return (
    <div>
      Playlist Lists Component
      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.id}>{playlist.name}</li>
        ))}
      </ul>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";

import { selectGetPlaylistRequest, selectPlaylist } from "@/features/playlist/selectors";
import { getPlaylist } from "@/features/playlist/slice";
import { useReduxQuery } from "@/store/useReduxQuery";

export const Route = createFileRoute("/playlists/$playlistId")({ component: PlaylistPage });

function PlaylistPage() {
  const { playlistId } = Route.useParams();

  const {
    data: playlist,
    isLoading,
    isError,
    error
  } = useReduxQuery({
    action: getPlaylist,
    actionPayload: { playlistId },
    selectData: selectPlaylist,
    selectState: selectGetPlaylistRequest
  });

  console.log(playlist);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-center">Playlist {playlist?.name}</h1>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Your tracks</h2>
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { TrackList } from "@/components/TrackList";

import { selectGetPlaylistRequest, selectPlaylist } from "@/features/playlist/selectors";
import { getPlaylist } from "@/features/playlist/slice";
import { useReduxQuery } from "@/store/useReduxQuery";
import { LoaderCircleIcon } from "lucide-react";

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

  if (isLoading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <LoaderCircleIcon className="animate-spin" size={46} />
      </div>
    );
  }

  if (isError || !playlist) {
    return <div>Could not load this playlist</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-center">Playlist {playlist.name}</h1>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Your tracks</h2>
        <TrackList playlistTracks={playlist.items?.items || []} />
      </div>
    </div>
  );
}

import { TrackLine } from "./TrackLine";

interface TrackListProps {
  playlistTracks: SpotifyApi.PlaylistTrackObject[];
}

export function TrackList({ playlistTracks }: TrackListProps) {
  const tracks = playlistTracks.reduce<SpotifyApi.TrackObjectFull[]>((acc, playlistTrack) => {
    if (playlistTrack.item) acc.push(playlistTrack.item);
    return acc;
  }, []);

  return (
    <ul>
      {tracks.map((track) => (
        <TrackLine key={track.id} track={track} />
      ))}
    </ul>
  );
}

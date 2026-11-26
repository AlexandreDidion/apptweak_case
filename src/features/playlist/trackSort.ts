import { SortValue } from "@/lib/sorting";

interface SortField {
  label: string;
  value: (track: SpotifyApi.TrackObjectFull) => SortValue;
}

/** The track fields the list can be sorted by. Without one, the playlist's own order is kept */
export const TRACK_SORT_FIELDS = {
  name: { label: "Title", value: (track) => track.name },
  artist: { label: "Artist", value: (track) => track.artists[0]?.name ?? "" },
  album: { label: "Album", value: (track) => track.album.name },
  releaseDate: { label: "Release date", value: (track) => track.album.release_date },
  duration: { label: "Duration", value: (track) => track.duration_ms }
} satisfies Record<string, SortField>;

export type TrackSortField = keyof typeof TRACK_SORT_FIELDS;

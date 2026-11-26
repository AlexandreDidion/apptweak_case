import { ArrowDownWideNarrowIcon, ArrowUpNarrowWideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { SortDirection } from "@/lib/sorting";

import { TRACK_SORT_FIELDS, TrackSortField } from "../trackSort";

/** No sort field: the playlist's own order */
export const PLAYLIST_ORDER = "playlistOrder";
export type TrackSortOption = TrackSortField | typeof PLAYLIST_ORDER;

const SORT_OPTION_LABELS: Record<TrackSortOption, string> = {
  [PLAYLIST_ORDER]: "Playlist sorting",
  ...Object.fromEntries(
    Object.entries(TRACK_SORT_FIELDS).map(([field, { label }]) => [field, label])
  )
} as Record<TrackSortOption, string>;

interface TrackSortControlsProps {
  sortOption: TrackSortOption;
  direction: SortDirection;
  onSortOptionChange: (sortOption: TrackSortOption) => void;
  onDirectionChange: (direction: SortDirection) => void;
}

export function TrackSortControls({
  sortOption,
  direction,
  onSortOptionChange,
  onDirectionChange
}: TrackSortControlsProps) {
  const isAscending = direction === "asc";

  return (
    <div className="flex items-center gap-1">
      <Select
        items={SORT_OPTION_LABELS}
        value={sortOption}
        onValueChange={(value) => {
          if (value) onSortOptionChange(value);
        }}
      >
        <SelectTrigger size="sm" aria-label="Sort tracks by">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(SORT_OPTION_LABELS).map(([option, label]) => (
            <SelectItem key={option} value={option}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="ghost"
        size="icon-sm"
        disabled={sortOption === PLAYLIST_ORDER}
        aria-label={isAscending ? "Sort descending" : "Sort ascending"}
        onClick={() => {
          onDirectionChange(isAscending ? "desc" : "asc");
        }}
      >
        {isAscending ? <ArrowUpNarrowWideIcon /> : <ArrowDownWideNarrowIcon />}
      </Button>
    </div>
  );
}

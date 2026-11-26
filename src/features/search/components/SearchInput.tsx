import { Disc3Icon, GlassesIcon, PlusIcon, SearchIcon } from "lucide-react";
import { useState } from "react";

import { TrackLine } from "@/components/TrackLine";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor
} from "@/components/ui/combobox";
import { InputGroupAddon } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RequestStatus } from "@/types/requests";

import { selectSearchQuery, selectSearchState } from "../selectors";
import { clearSearch, searchTracks } from "../slice";

const HIPSTER_SWITCH_ID = "hipster-search-switch";
/** Space between the mobile popup and the screen edges (`1rem` in total in its width) */
const SCREEN_EDGE_GAP = 8;

interface SearchInputProps {
  onTrackSelect?: (track: SpotifyApi.TrackObjectFull) => void;
  targetName?: string;
}

export function SearchInput({ onTrackSelect, targetName }: SearchInputProps) {
  const dispatch = useAppDispatch();
  const anchor = useComboboxAnchor();
  const isMobile = useIsMobile();
  const { status, error, tracks, total } = useAppSelector(selectSearchState);
  const lastQuery = useAppSelector(selectSearchQuery);

  const [query, setQuery] = useState(lastQuery);
  const [isHipsterSearch, setIsHipsterSearch] = useState(false);

  const isSearching = status === RequestStatus.PENDING;

  function emptyMessage() {
    if (!query.trim()) return "Type to search tracks";

    if (isSearching) return "Searching…";

    if (status === RequestStatus.ERROR) return `Could not search: ${error ?? "unknown error"}`;

    return "No tracks found";
  }

  return (
    <Combobox<SpotifyApi.TrackObjectFull>
      items={tracks}
      // Spotify does the matching: no client-side filtering
      filter={null}
      // Picking a result is an action, not a selection to keep
      value={null}
      onValueChange={(track) => {
        if (!track) return;

        onTrackSelect?.(track);

        setQuery("");
        dispatch(clearSearch());
      }}
      itemToStringLabel={(track) => track.name}
      isItemEqualToValue={(item, value) => item.id === value.id}
      autoHighlight
      inputValue={query}
      onInputValueChange={(nextQuery, { reason }) => {
        if (reason !== "input-change") return;

        setQuery(nextQuery);
        // The saga debounces and cancels outdated searches
        dispatch(searchTracks({ query: nextQuery, isHipsterSearch }));
      }}
    >
      <div className="flex items-center gap-2">
        <div ref={anchor} className="min-w-24 flex-1">
          <ComboboxInput
            placeholder={targetName ? `Search tracks to add to "${targetName}"` : "Search tracks"}
            aria-label="Search tracks"
            aria-busy={isSearching || undefined}
            showTrigger={false}
          >
            <InputGroupAddon>
              {isSearching ? (
                <Disc3Icon className="animate-spin" aria-hidden="true" />
              ) : (
                <SearchIcon aria-hidden="true" />
              )}
            </InputGroupAddon>
          </ComboboxInput>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 md:gap-2">
          <Switch
            id={HIPSTER_SWITCH_ID}
            checked={isHipsterSearch}
            onCheckedChange={(checked) => {
              setIsHipsterSearch(checked);
              // Re-run the current query with the new mode
              if (query.trim()) dispatch(searchTracks({ query, isHipsterSearch: checked }));
            }}
          />
          <Label
            htmlFor={HIPSTER_SWITCH_ID}
            title="Only little-known results (Spotify's tag:hipster)"
          >
            {/* Icon only on small screens: the text would leave no room for the input */}
            <GlassesIcon className="size-4 md:hidden" aria-hidden="true" />
            <span className="sr-only md:not-sr-only">Hipster search mode</span>
          </Label>
        </div>
      </div>

      <ComboboxContent
        anchor={anchor}
        // On mobile the input is narrow: the popup spans the screen instead, 8px from each edge
        alignOffset={
          isMobile ? () => SCREEN_EDGE_GAP - (anchor.current?.getBoundingClientRect().left ?? 0) : 0
        }
        className={cn(isMobile && "w-[calc(100vw-1rem)] max-w-none min-w-0")}
      >
        <ComboboxEmpty className="py-4">{emptyMessage()}</ComboboxEmpty>
        <ComboboxList className="max-h-[60vh] overflow-y-auto p-1">
          {(track: SpotifyApi.TrackObjectFull) => (
            <ComboboxItem key={track.id} value={track} className="cursor-pointer">
              <TrackLine
                track={track}
                className="w-full"
                actions={<PlusIcon className="text-muted-foreground" aria-hidden="true" />}
              />
            </ComboboxItem>
          )}
        </ComboboxList>
        {tracks.length > 0 && (
          <p className="border-t px-4 py-2 text-xs text-muted-foreground">
            Press Enter or click a track to add it to{" "}
            {targetName ? `"${targetName}"` : "a playlist"}
            {total > tracks.length &&
              ` · ${tracks.length.toString()} of ${total.toString()} results`}
          </p>
        )}
      </ComboboxContent>
    </Combobox>
  );
}

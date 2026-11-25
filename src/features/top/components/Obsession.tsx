import { type LucideIcon, MicVocalIcon, MusicIcon } from "lucide-react";
import { useState } from "react";

import { ImageMosaic } from "@/components/ImageMosaic";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { useReduxQuery } from "@/store/useReduxQuery";

import { selectTopItems, selectTopState } from "../selectors";
import { getTopItems, TimeRange } from "../slice";

const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: "short_term", label: "Last 4 weeks" },
  { value: "medium_term", label: "Last 6 months" },
  { value: "long_term", label: "Last year" }
];

export function Obsession() {
  const [rangeIndex, setRangeIndex] = useState(0);

  const timeRange = TIME_RANGES[rangeIndex].value;

  const {
    data: { topTrack, topArtist },
    isLoading,
    isError,
    error
  } = useReduxQuery({
    action: getTopItems,
    // Refetches when the slider moves to another period
    actionPayload: { timeRange },
    selectData: selectTopItems,
    selectState: selectTopState
  });

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="space-y-4">
        <Slider
          min={0}
          max={TIME_RANGES.length - 1}
          step={1}
          value={[rangeIndex]}
          onValueChange={(value: number | readonly number[]) => {
            setRangeIndex(typeof value === "number" ? value : (value[0] ?? 0));
          }}
          getAriaLabel={() => "Period"}
          getAriaValueText={(_formatted, value) => TIME_RANGES[value].label}
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          {TIME_RANGES.map((range, index) => (
            <span
              key={range.value}
              className={index === rangeIndex ? "font-medium text-foreground" : ""}
            >
              {range.label}
            </span>
          ))}
        </div>
      </div>

      {isError ? (
        <p className="text-center text-sm text-destructive">
          Could not load your top items: {error}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <TopItemCard
            heading="Top track"
            isLoading={isLoading}
            name={topTrack?.name}
            details={topTrack?.artists.map((artist) => artist.name).join(", ")}
            imageUrl={topTrack?.album.images[0]?.url}
            FallbackIcon={MusicIcon}
          />
          <TopItemCard
            heading="Top artist"
            isLoading={isLoading}
            name={topArtist?.name}
            imageUrl={topArtist?.images[0]?.url}
            FallbackIcon={MicVocalIcon}
          />
        </div>
      )}
    </div>
  );
}

interface TopItemCardProps {
  heading: string;
  isLoading: boolean;
  name?: string;
  details?: string;
  imageUrl?: string;
  FallbackIcon: LucideIcon;
}

function TopItemCard({
  heading,
  isLoading,
  name,
  details,
  imageUrl,
  FallbackIcon
}: TopItemCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{heading}</CardDescription>
        {isLoading ? (
          <Skeleton className="h-5 w-2/3" />
        ) : (
          // No result when there is too little listening history for the period
          <CardTitle className="truncate">{name ?? "Not enough listening yet"}</CardTitle>
        )}
        {!isLoading && details && <CardDescription className="truncate">{details}</CardDescription>}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="aspect-square w-full" />
        ) : (
          <ImageMosaic images={imageUrl ? [imageUrl] : []} FallbackIcon={FallbackIcon} />
        )}
      </CardContent>
    </Card>
  );
}

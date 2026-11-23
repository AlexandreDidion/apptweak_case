import { Link } from "@tanstack/react-router";
import { LockIcon } from "lucide-react";

import { ImageMosaic } from "@/components/ImageMosaic";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface PlaylistCardProps {
  playlist: SpotifyApi.PlaylistObjectSimplified;
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  const coverUrls = playlist.images?.map((img) => img.url) || [];
  const trackCount = playlist.items?.total;

  return (
    <Link
      to="/playlists/$playlistId"
      params={{ playlistId: playlist.id }}
      className="group block rounded-2xl"
    >
      <Card size="sm" className="transition-colors group-hover:bg-muted">
        <CardContent>
          <ImageMosaic images={coverUrls} />
        </CardContent>

        <CardHeader>
          <CardTitle className="truncate">{playlist.name}</CardTitle>
          <CardDescription className="flex items-center gap-1">
            {playlist.public === false && (
              <LockIcon className="size-3 shrink-0" aria-label="Private" role="img" />
            )}
            <span className="truncate">
              {trackCount !== undefined && `${trackCount.toString()} tracks`}
            </span>
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}

/**
 * Same layout as PlaylistCard, shown while playlists load
 */
export function PlaylistCardSkeleton() {
  return (
    <Card size="sm" aria-hidden="true">
      <CardContent>
        <Skeleton className="aspect-square w-full" />
      </CardContent>
      <CardHeader>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
      </CardHeader>
    </Card>
  );
}

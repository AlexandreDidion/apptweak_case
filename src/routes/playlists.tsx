import { createFileRoute } from "@tanstack/react-router";

import { PlaylistList } from "@/features/playlist/PlaylistList";

export const Route = createFileRoute("/playlists")({ component: PlaylistList });

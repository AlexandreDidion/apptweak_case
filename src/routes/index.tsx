import { createFileRoute } from "@tanstack/react-router";
import { Disc3Icon } from "lucide-react";

import { selectUser } from "@/features/auth/selectors";
import { PlaylistList } from "@/features/playlist/components/PlaylistList";
import { useAppSelector } from "@/store/hooks";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  const user = useAppSelector(selectUser);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-center">
        {user ? `Welcome back, ${user.userName} !` : <Disc3Icon className="animate-spin" />}
      </h1>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Your playlists</h2>
        <PlaylistList />
      </div>
    </div>
  );
}

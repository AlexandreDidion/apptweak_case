import { createFileRoute, Link } from "@tanstack/react-router";
import { Disc3Icon, EyeOffIcon, RepeatIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { selectUser } from "@/features/auth/selectors";
import { PlaylistList } from "@/features/playlist/components/PlaylistList";
import { useAppSelector } from "@/store/hooks";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  const user = useAppSelector(selectUser);

  const welcomeMessage = user?.userName ? `Welcome back, ${user.userName} !` : "Welcome back !";

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-center">
        {user ? welcomeMessage : <Disc3Icon className="animate-spin" />}
      </h1>
      <div className="flex justify-center gap-3">
        <Link to="/obsession" className={buttonVariants({ variant: "outline" })}>
          <RepeatIcon />
          Obsession
        </Link>
        <Link to="/naughty" className={buttonVariants({ variant: "outline" })}>
          <EyeOffIcon />
          Naughty list
        </Link>
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Your playlists</h2>
        <PlaylistList />
      </div>
    </div>
  );
}

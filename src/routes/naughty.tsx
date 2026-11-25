import { createFileRoute } from "@tanstack/react-router";

import { NaughtyList } from "@/features/naughty/components/NaughtyList";

export const Route = createFileRoute("/naughty")({
  component: NaughtyPage
});

function NaughtyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold">Naughty list</h1>
        <p className="text-sm text-muted-foreground">
          A random selection of the tracks in your playlists with explicit lyrics
        </p>
      </div>
      <NaughtyList />
    </div>
  );
}

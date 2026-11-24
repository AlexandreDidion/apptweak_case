import { createFileRoute } from "@tanstack/react-router";

import { Obsession } from "@/features/top/components/Obsession";

export const Route = createFileRoute("/obsession")({ component: ObsessionPage });

function ObsessionPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-center text-2xl font-bold">Your obsession</h1>
      <Obsession />
    </div>
  );
}

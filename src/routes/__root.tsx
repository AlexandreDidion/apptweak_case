import { createRootRoute, Outlet } from "@tanstack/react-router";

import { MainHeader } from "@/components/MainHeader";
import { UserAvatar } from "@/features/auth/UserAvatar";

export const Route = createRootRoute({ component: RootLayout });

function RootLayout() {
  return (
    <div>
      <MainHeader userAvatar={<UserAvatar />} />
      <main className="h-full w-full px-8 py-4">
        <Outlet />
      </main>
    </div>
  );
}

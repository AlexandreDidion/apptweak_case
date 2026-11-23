import { createRootRoute, Outlet } from "@tanstack/react-router";

import { MainHeader } from "@/components/MainHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { UserAvatar } from "@/features/auth/components/UserAvatar";
import { PlaylistSidebar } from "@/features/playlist/components/PlaylistSidebar";

export const Route = createRootRoute({ component: RootLayout });

function RootLayout() {
  return (
    // --header-height (h-16 = 4rem) lets the fixed sidebar start below the header
    <SidebarProvider className="flex-col [--header-height:4rem]">
      <div className="sticky top-0 z-20">
        <MainHeader userAvatar={<UserAvatar />} />
      </div>
      <div className="flex flex-1">
        <PlaylistSidebar />
        <SidebarInset className="px-8 py-4">
          <Outlet />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

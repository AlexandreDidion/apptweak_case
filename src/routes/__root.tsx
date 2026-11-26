import { createRootRoute, Outlet } from "@tanstack/react-router";

import { MainHeader } from "@/components/MainHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { UserAvatar } from "@/features/auth/components/UserAvatar";
import { AddToPlaylistDialog } from "@/features/playlist/components/AddToPlaylistDialog";
import { PlaylistSidebar } from "@/features/playlist/components/PlaylistSidebar";
import { useAddTrackToPlaylist } from "@/features/playlist/useAddTrackToPlaylist";
import { SearchInput } from "@/features/search/components/SearchInput";

export const Route = createRootRoute({ component: RootLayout });

function RootLayout() {
  const { addTrack, addTrackTo, trackToPick, closePicker, targetPlaylistName, isAdding } =
    useAddTrackToPlaylist();

  return (
    // --header-height (h-16 = 4rem) lets the fixed sidebar start below the header
    <SidebarProvider className="flex-col [--header-height:4rem]">
      <div className="sticky top-0 z-20">
        <MainHeader
          search={<SearchInput onTrackSelect={addTrack} targetName={targetPlaylistName} />}
          userAvatar={<UserAvatar />}
        />
      </div>
      <div className="flex flex-1">
        <PlaylistSidebar />
        <SidebarInset className="px-8 py-4">
          <Outlet />
        </SidebarInset>
      </div>
      <AddToPlaylistDialog
        track={trackToPick}
        isAdding={isAdding}
        onAdd={addTrackTo}
        onClose={closePicker}
      />
      <Toaster />
    </SidebarProvider>
  );
}

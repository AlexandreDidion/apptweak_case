import { ListMusicIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarRail
} from "@/components/ui/sidebar";
import { useReduxMutation } from "@/store/useReduxMutation";
import { useReduxQuery } from "@/store/useReduxQuery";

import { PlaylistFormDialog } from "./PlaylistFormDialog";
import { selectCreatePlaylistRequest, selectPlaylists, selectPlaylistState } from "../selectors";
import { createPlaylist, getPlaylists } from "../slice";

export function PlaylistSidebar() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const {
    data: playlists,
    isLoading,
    isError,
    error
  } = useReduxQuery({
    action: getPlaylists,
    selectData: selectPlaylists,
    selectState: selectPlaylistState
  });

  const createMutation = useReduxMutation({
    action: createPlaylist,
    selectState: selectCreatePlaylistRequest,
    onSuccess: () => {
      setIsCreateDialogOpen(false);
    }
  });

  return (
    <>
      {/* Fixed under the header (see --header-height in __root.tsx), collapses to an icon strip */}
      <Sidebar
        side="left"
        collapsible="icon"
        className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Create a playlist"
                onClick={() => {
                  setIsCreateDialogOpen(true);
                }}
                className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              >
                <PlusIcon />
                <span>Create a playlist</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Your playlists</SidebarGroupLabel>
            <SidebarGroupContent>
              {isError && <p className="px-2 text-sm text-destructive">{error}</p>}

              <SidebarMenu>
                {isLoading
                  ? Array.from({ length: 5 }, (_, index) => (
                      <SidebarMenuItem key={index}>
                        <SidebarMenuSkeleton showIcon />
                      </SidebarMenuItem>
                    ))
                  : playlists.map((playlist) => (
                      <SidebarMenuItem key={playlist.id}>
                        <SidebarMenuButton tooltip={playlist.name}>
                          <ListMusicIcon />
                          <span>{playlist.name}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        {/* Click or drag the edge to toggle */}
        <SidebarRail />
      </Sidebar>

      <PlaylistFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        title="Create a playlist"
        description="Give it a name, and optionally a description."
        submitLabel="Create"
        onSubmit={createMutation.mutate}
        isSubmitting={createMutation.isPending}
        submitError={createMutation.isError ? createMutation.error : undefined}
      />
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { PencilIcon } from "lucide-react";
import { useState } from "react";

import { CenteredSpinner } from "@/components/CenteredSpinner";
import { Button } from "@/components/ui/button";
import { PlaylistFormDialog } from "@/features/playlist/components/PlaylistFormDialog";
import { PlaylistTrackList } from "@/features/playlist/components/PlaylistTrackList";
import { emptyPlaylistFormValues } from "@/features/playlist/playlistFormSchema";
import {
  selectEditPlaylistRequest,
  selectGetPlaylistRequest,
  selectPlaylist
} from "@/features/playlist/selectors";
import { editPlaylist, getPlaylist } from "@/features/playlist/slice";
import { useReduxMutation } from "@/store/useReduxMutation";
import { useReduxQuery } from "@/store/useReduxQuery";

export const Route = createFileRoute("/playlists/$playlistId")({ component: PlaylistPage });

function PlaylistPage() {
  const { playlistId } = Route.useParams();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const editMutation = useReduxMutation({
    action: editPlaylist,
    selectState: selectEditPlaylistRequest,
    onSuccess: () => {
      setIsEditDialogOpen(false);
    }
  });

  const {
    data: playlist,
    isLoading,
    isError
  } = useReduxQuery({
    action: getPlaylist,
    actionPayload: { playlistId },
    selectData: selectPlaylist,
    selectState: selectGetPlaylistRequest
  });

  if (isLoading) {
    return <CenteredSpinner />;
  }

  if (isError || !playlist) {
    return <div>Could not load this playlist</div>;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex items-center gap-1 justify-center">
          <h1 className="text-2xl font-bold text-center">{playlist.name}</h1>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Edit playlist details"
            onClick={() => {
              setIsEditDialogOpen(true);
            }}
          >
            <PencilIcon />
          </Button>
        </div>
        {playlist.description && <p className="text-center text-sm">{playlist.description}</p>}
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Tracks</h2>
        <PlaylistTrackList playlist={playlist} />
      </div>
      <PlaylistFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        defaultValues={{
          name: playlist.name,
          description: playlist.description ?? emptyPlaylistFormValues.description,
          public: playlist.public ?? emptyPlaylistFormValues.public
        }}
        title="Edit playlist"
        submitLabel="Save"
        onSubmit={(values) => {
          editMutation.mutate({ playlistId, values });
        }}
        isSubmitting={editMutation.isPending}
        submitError={editMutation.isError ? editMutation.error : undefined}
      />
    </div>
  );
}

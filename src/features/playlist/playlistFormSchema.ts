import * as z from "zod";

/**
 * Shared by the create and edit playlist forms
 */
export const playlistFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Give your playlist a name.")
    .max(100, "Name must be at most 100 characters."),
  // Optional for Spotify, sent only when filled in
  description: z.string().trim().max(300, "Description must be at most 300 characters.")
});

export type PlaylistFormValues = z.infer<typeof playlistFormSchema>;

export const emptyPlaylistFormValues: PlaylistFormValues = {
  name: "",
  description: ""
};

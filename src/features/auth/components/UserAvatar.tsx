import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppSelector } from "@/store/hooks";

import { selectUser } from "../selectors";

export function UserAvatar() {
  const user = useAppSelector(selectUser);
  const name = user?.display_name ?? "";
  // Spotify lists the largest image first: the last one is enough for an avatar
  const imageUrl = user?.images?.at(-1)?.url;
  const initial = name.charAt(0).toUpperCase() || "?";

  return (
    <Avatar size="lg" title={name}>
      {imageUrl && <AvatarImage src={imageUrl} alt="" />}
      <AvatarFallback>{initial}</AvatarFallback>
    </Avatar>
  );
}

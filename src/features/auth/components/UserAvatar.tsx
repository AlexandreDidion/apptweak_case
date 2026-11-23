import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppSelector } from "@/store/hooks";

import { selectUser } from "../selectors";

export function UserAvatar() {
  const user = useAppSelector(selectUser);
  const initial = user?.userName?.charAt(0).toUpperCase() ?? "?";

  return (
    <Avatar size="lg" title={user?.userName}>
      <AvatarFallback>{initial}</AvatarFallback>
    </Avatar>
  );
}

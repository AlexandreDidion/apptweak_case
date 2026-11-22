import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { MainHeader } from "@/components/MainHeader";

import { selectUser } from "@/features/auth/selectors";
import { useAppSelector } from "@/store/hooks";

export const Route = createRootRoute({ component: RootLayout });

function RootLayout() {
  const user = useAppSelector(selectUser);

  return (
    <div>
      <MainHeader />
      <main className="h-full w-full px-8 py-4">
        <Outlet />
      </main>
    </div>
  );
}

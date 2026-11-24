import { Link } from "@tanstack/react-router";
import { HouseIcon } from "lucide-react";
import { ReactNode } from "react";

import { ModeToggle } from "@/components/ModeToggle";
import { buttonVariants } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface MainHeaderProps {
  search?: ReactNode;
  userAvatar?: ReactNode;
}

export function MainHeader({ search, userAvatar }: MainHeaderProps) {
  return (
    <header className="flex h-16 w-full items-center gap-4 bg-card px-4 text-card-foreground shadow-md ring-1 ring-foreground/10">
      {/* Lives in the header so it stays reachable on mobile, where the sidebar is a closed sheet */}
      <SidebarTrigger className="rounded-full" />
      <Link
        to="/"
        aria-label="Home"
        className={cn(buttonVariants({ variant: "ghost", size: "icon-lg" }), "rounded-full")}
      >
        <HouseIcon />
      </Link>

      <div className="w-full max-w-md">{search}</div>

      <div className="flex flex-1 items-center justify-end gap-2">
        <ModeToggle />
        {userAvatar}
      </div>
    </header>
  );
}
